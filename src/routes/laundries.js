const express = require("express");
const supabase = require("../config/supabase");
const { verifyToken, requireRoles, normalizeRole } = require("../middleware/auth");

const router = express.Router();

function isAllowedStatusChange(role, fromStatus, toStatus) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") return true;
  if (normalizedRole === "user") return false;

  if (normalizedRole === "distributor") {
    return (
      (fromStatus === "Collected" && toStatus === "Pending") ||
      (fromStatus === "Done" && toStatus === "Collected")
    );
  }


  if (normalizedRole === "washerman") {
    return fromStatus === "Pending" && toStatus === "Washed";
  }

  if (normalizedRole === "ironman") {
    return fromStatus === "Washed" && toStatus === "Done";
  }

  return false;
}

// Roles that may see full personal info
const FULL_ACCESS_ROLES = ["admin"];

// Roles that may see limited personal info (id, status, enrollment_id)
const LIMITED_VIEW_ROLES = ["distributor"];

function redactRecordForRole(role, record) {
  const normalized = normalizeRole(role);
  if (FULL_ACCESS_ROLES.includes(normalized)) return record;
  if (LIMITED_VIEW_ROLES.includes(normalized)) {
    if (!record) return record;
    const { id, status, enrollment_id } = record;
    return { id, status, enrollment_id };
  }
  // return a shallow copy with sensitive fields removed for everyone else
  const { name, phone, enrollment_id, ...rest } = record || {};
  return rest;
}

/**
 * Public route (no token required)
 * Only exposes minimal information.
 */
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("laundries")
      .select("id,status")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Laundry bag not found" });
    }

    return res.json({ laundry: data });
  } catch (err) {
    console.error("GET /laundries/:id error:", err.message);
    return res.status(500).json({ error: "Failed to fetch laundry" });
  }
});



// All routes below require authentication
router.use(verifyToken);

// Authenticated detail route — redacts fields for non-full roles
router.get("/:id/details", async (req, res) => {
  try {
    console.log(req.user);
    const role = normalizeRole(req.user?.username);
    console.log('role :',role)

    let selectFields;
    if (role === "admin") selectFields = "*";
    else if (role === "distributor") selectFields = "id,enrollment_id,status";
    else selectFields = "id,status";

    const { data, error } = await supabase
      .from("laundries")
      .select(selectFields)
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Laundry bag not found" });
    }

    // For safety, also apply redaction function (no-op when selectFields already limited)
    const redacted = redactRecordForRole(role, data);
    return res.json({ laundry: redacted });
  } catch (err) {
    console.error("GET /laundries/:id/details error:", err.message);
    return res.status(500).json({ error: "Failed to fetch laundry" });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log(req.user)
    const role = normalizeRole(req.user?.username);

    let selectFields = "id,status,updated_at";
    if (role === "admin") {
      selectFields = "*";
    } else if (role === "distributor") {
      selectFields = "id,enrollment_id,status,updated_at";
    }

    let query = supabase
      .from("laundries")
      .select(selectFields)
      .order("updated_at", { ascending: false });

    if (req.query.status) {
      query = query.eq("status", req.query.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    const laundries = Array.isArray(data)
      ? data.map((r) => redactRecordForRole(role, r))
      : redactRecordForRole(role, data);

    return res.json({ laundries });
  } catch (err) {
    console.error("GET /laundries error:", err.message);
    return res.status(500).json({ error: "Failed to fetch laundries" });
  }
});

router.post("/", requireRoles("admin"), async (req, res) => {
  try {
    const { id, name, phone, enrollment_id, status } = req.body;

    if (!id || !name || !phone || !status || !enrollment_id) {
      return res.status(400).json({ error: "id, name, phone, enrollment_id and status are required" });
    }

    const insertData = { id, name, phone, enrollment_id, status };

    const { data, error } = await supabase
      .from("laundries")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ error: "Unique value required" });
      }
      throw error;
    }

    return res.status(201).json({ message: "Laundry bag created", laundry: data });
  } catch (err) {
    console.error("POST /laundries error:", err.message);
    return res.status(500).json({ error: "Failed to create laundry bag" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    console.log('patch initiated')
    const { name, phone, status } = req.body;
    const updates = {};
    const userRole = normalizeRole(req.user?.username);
    console.log(userRole)

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Provide at least one field to update" });
    }

    if (userRole !== "admin") {
      if (updates.name !== undefined || updates.phone !== undefined) {
        return res.status(403).json({ error: "Only admin can update name or phone" });
      }

      if (updates.status === undefined) {
        return res.status(403).json({ error: "Only admin can update non-status fields" });
      }
    }

    const { data: currentBag, error: currentError } = await supabase
      .from("laundries")
      .select("status")
      .eq("id", req.params.id)
      .single();

    if (currentError || !currentBag) {
      return res.status(404).json({ error: "Laundry bag not found" });
    }

    if (userRole !== "admin" && updates.status !== undefined) {
      const allowed = isAllowedStatusChange(userRole, currentBag.status, updates.status);

      if (!allowed) {
        return res.status(403).json({
          error: "Not authorized",
          message: `${userRole} is not allowed to change status from ${currentBag.status} to ${updates.status}`,
        });
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("laundries")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Laundry bag not found" });

    const redacted = redactRecordForRole(userRole, data);
    return res.json({ message: "Laundry bag updated", laundry: redacted });
  } catch (err) {
    console.error("PATCH /laundries/:id error:", err.message);
    return res.status(500).json({ error: "Failed to update laundry bag" });
  }
});

router.delete("/:id", requireRoles("admin"), async (req, res) => {
  try {
    const { error } = await supabase
      .from("laundries")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    return res.json({ message: "Laundry bag deleted" });
  } catch (err) {
    console.error("DELETE /laundries/:id error:", err.message);
    return res.status(500).json({ error: "Failed to delete laundry bag" });
  }
});

module.exports = router;

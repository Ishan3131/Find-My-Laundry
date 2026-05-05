const express = require("express");
const supabase = require("../config/supabase");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// ── Public route (no token required) ──

/**
 * GET /laundries/:id
 * Returns a single laundry bag by ID.
 * No authentication required.
 */
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("laundries")
      .select("*")
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

// ── All routes below require authentication ──
router.use(verifyToken);

/**
 * GET /laundries
 * Returns all laundry bags, ordered by most recently updated.
 * Optional query params: ?status=Pending
 */
router.get("/", async (req, res) => {
  try {
    let query = supabase
      .from("laundries")
      .select("*")
      .order("updated_at", { ascending: false });

    // Optional filter by status
    if (req.query.status) {
      query = query.eq("status", req.query.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({ laundries: data });
  } catch (err) {
    console.error("GET /laundries error:", err.message);
    return res.status(500).json({ error: "Failed to fetch laundries" });
  }
});

/**
 * POST /laundries
 * Body: { id, name, phone, status }
 * Creates a new laundry bag entry.
 */
router.post("/", async (req, res) => {
  try {
    const { id, name, phone, status } = req.body;

    if (!id || !name || !phone || !status) {
      return res.status(400).json({ error: "id, name, phone, and status are required" });
    }

    const insertData = { id, name, phone, status };

    const { data, error } = await supabase
      .from("laundries")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // Handle unique constraint on phone
      if (error.code === "23505") {
        return res.status(409).json({ error: "Phone number already exists" });
      }
      throw error;
    }

    return res.status(201).json({ message: "Laundry bag created", laundry: data });
  } catch (err) {
    console.error("POST /laundries error:", err.message);
    return res.status(500).json({ error: "Failed to create laundry bag" });
  }
});

/**
 * PATCH /laundries/:id
 * Body: { name?, phone?, status? }
 * Updates an existing laundry bag.
 */
router.patch("/:id", async (req, res) => {
  try {
    const { name, phone, status } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (status) updates.status = status;
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length === 1) {
      return res.status(400).json({ error: "Provide at least one field to update" });
    }

    const { data, error } = await supabase
      .from("laundries")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Laundry bag not found" });

    return res.json({ message: "Laundry bag updated", laundry: data });
  } catch (err) {
    console.error("PATCH /laundries/:id error:", err.message);
    return res.status(500).json({ error: "Failed to update laundry bag" });
  }
});

/**
 * DELETE /laundries/:id
 * Removes a laundry bag by ID.
 */
router.delete("/:id", async (req, res) => {
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

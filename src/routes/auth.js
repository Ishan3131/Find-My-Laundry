const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const router = express.Router();

function canonicalRole(role) {
  if (!role) return "";
  const r = String(role).trim().toLowerCase();
  if (r.includes("collector")) return "distributor";
  if (r.includes("washed") || r.includes("washer")) return "washerman";
  if (r.includes("iron")) return "ironman";
  return r;
}

/**
 * POST /auth/login
 * Body: { username, password }
 * Returns a JWT token on successful authentication.
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("staff")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.hashed_password || "");
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Canonicalize role and include it in the token so protected routes can check authorization
    const role = canonicalRole(user.role);
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

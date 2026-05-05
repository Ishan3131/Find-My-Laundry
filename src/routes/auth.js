const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const router = express.Router();

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
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.hashed_password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT (expires in 24 hours)
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.json({
      message: "Login successful",
      token,
      user: { username: user.username },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

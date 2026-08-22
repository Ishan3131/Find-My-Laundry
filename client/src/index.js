require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const laundryRoutes = require("./routes/laundries");

const app = express();
const PORT = process.env.PORT || 8000;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Health check ──
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Find My Laundry API",
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use("/auth", authRoutes);       // POST /auth/login
app.use("/laundries", laundryRoutes); // GET/POST/PATCH/DELETE /laundries

// ── Start server (local dev only — Vercel uses the export) ──
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🧺 Find My Laundry API running on http://localhost:${PORT}`);
  });
}

module.exports = app;

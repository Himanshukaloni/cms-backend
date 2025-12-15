const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);
app.use("/admin", adminRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ message: "✅ CMS Backend running with MongoDB" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
})();

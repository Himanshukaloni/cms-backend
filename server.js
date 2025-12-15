const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const adminRoutes = require("./routes/admin");

const app = express();

/* 🔥 STRONG CORS (MOBILE SAFE) */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* 🔥 HANDLE PREFLIGHT */
app.options("*", cors());

/* BODY PARSER */
app.use(express.json());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);
app.use("/admin", adminRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("CMS backend running");
});

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
  });
})();

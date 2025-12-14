const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // check approval
    if (!user.is_approved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ IMPORTANT: send role
    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

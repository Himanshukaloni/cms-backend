const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
      is_approved: role === "admin" ? false : true
    });

    await user.save();

    res.json({ message: "Registration successful. Waiting for approval if admin." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password exists in DB
    if (!user.password) {
      console.error("Password missing in DB for user:", email);
      return res.status(500).json({ message: "Server error" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

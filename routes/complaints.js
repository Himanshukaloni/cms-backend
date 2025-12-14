const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Complaint = require("../models/complaint");

// Submit complaint (Student)
router.post("/submit", auth, async (req, res) => {
  try {
    const { title, category, description } = req.body;

    const complaint = new Complaint({
      user_id: req.user.id,
      title,
      category,
      description
    });

    await complaint.save();
    res.json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get logged-in user's complaints
router.get("/my", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

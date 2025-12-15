const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Complaint = require("../models/complaint");

/* ===============================
   SUBMIT COMPLAINT (STUDENT)
================================ */
router.post("/submit", auth, async (req, res) => {
  try {
    const { title, category, description } = req.body;

    // Basic validation
    if (!title || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const complaint = new Complaint({
      user_id: req.user.id,
      title,
      category,
      description,
      status: "pending"
    });

    await complaint.save();

    res.json({ message: "Complaint submitted successfully" });

  } catch (error) {
    console.error("SUBMIT COMPLAINT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==================================
   GET LOGGED-IN USER COMPLAINTS
================================== */
router.get("/my", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user_id: req.user.id
    }).sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    console.error("FETCH MY COMPLAINTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


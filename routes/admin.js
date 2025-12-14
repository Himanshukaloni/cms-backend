const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Complaint = require("../models/complaint");
const User = require("../models/User");

// Get all complaints (Admin)
router.get("/complaints", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "first_name last_name email");

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update complaint status
router.put("/complaint-status/:id", auth, async (req, res) => {
  try {
    await Complaint.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Reply to complaint
router.put("/complaint-reply/:id", auth, async (req, res) => {
  try {
    await Complaint.findByIdAndUpdate(req.params.id, {
      admin_reply: req.body.reply,
      status: "resolved"
    });

    res.json({ message: "Reply sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get pending admin requests
router.get("/pending-admins", auth, async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
      is_approved: false
    });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Approve admin
router.put("/approve-admin/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      is_approved: true
    });

    res.json({ message: "Admin approved" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Reject admin
router.delete("/reject-admin/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin rejected" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

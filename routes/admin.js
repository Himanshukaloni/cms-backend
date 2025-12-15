const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Complaint = require("../models/complaint");
const User = require("../models/User");

/* =========================
   ADMIN MIDDLEWARE
========================= */
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

/* =========================
   GET ALL COMPLAINTS (ADMIN)
========================= */
router.get("/complaints", auth, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "first_name last_name email");

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   UPDATE COMPLAINT STATUS
========================= */
router.put("/complaint-status/:id", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, {
      status
    });

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   REPLY TO COMPLAINT
========================= */
router.put("/complaint-reply/:id", auth, adminOnly, async (req, res) => {
  try {
    const { reply } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, {
      admin_reply: reply,
      status: "resolved"
    });

    res.json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET PENDING ADMINS
========================= */
router.get("/pending-admins", auth, adminOnly, async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
      is_approved: false
    }).select("-password");

    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   APPROVE ADMIN
========================= */
router.put("/approve-admin/:id", auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      is_approved: true
    });

    res.json({ message: "Admin approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   REJECT ADMIN
========================= */
router.delete("/reject-admin/:id", auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

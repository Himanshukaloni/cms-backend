const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    category: String,
    description: String,
    status: { type: String, default: "pending" },
    admin_reply: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);

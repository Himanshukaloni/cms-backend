const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    is_approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

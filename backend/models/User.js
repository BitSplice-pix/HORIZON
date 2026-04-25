const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: {type: String, default: ""},
  otpExpiry: {type: Date, default: Date.now},
  isVerified: {type: Boolean, default: false},
  resetToken: {type: String, default: ''},
  resetTokenExpiry: {type: Date, default: Date.now},

  // ── Login Lockout ─────────────────────────────────────────────────────────────
  // Stored in DB so lockouts survive server restarts.
  // failedLoginAttempts: incremented on each wrong password; reset on success / password change.
  // lockUntil: a future Date means the account is locked; null / past date = unlocked.
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("User", userSchema);
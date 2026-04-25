const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendAccountLockedEmail } = require("../../utils/email-util");
require("dotenv").config();

const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes in ms

const getMe = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ isLoggedIn: false, user: null });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ isLoggedIn: true, user: decodedUser });
  } catch (err) {
    return res.status(200).json({ isLoggedIn: false, user: null });
  }
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Generic error — never reveal whether email exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ── LOCK CHECK — before anything else ──────────────────────────────────────
    // If lockUntil is in the future the account is still locked.
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMs = user.lockUntil - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      return res.status(423).json({   // HTTP 423 = Locked
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${remainingMinutes} minute(s).`,
        locked: true,
        lockUntil: user.lockUntil, // Frontend uses this for a countdown display
      });
    }

    // ── EXPIRED LOCK — if lockUntil is in the past, clean up and let them try ──
    if (user.lockUntil && user.lockUntil <= Date.now()) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // ── EMAIL VERIFICATION CHECK ────────────────────────────────────────────────
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
        redirectTo: `/verify-otp?email=${email}`,
      });
    }

    const isMatching = await bcrypt.compare(password, user.password);

    if (isMatching) {
      // ── SUCCESS — reset lockout counters ──────────────────────────────────────
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();

      const { _id, firstName, lastName, email: userEmail } = user;
      const payload = { _id, firstName, lastName, email: userEmail };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });

      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', 
        maxAge: 60000 * 60 * 24 * 15,
      });

      return res.status(200).json({ success: true, user: payload });

    } else {
      // ── FAILED ATTEMPT — increment counter ────────────────────────────────────
      user.failedLoginAttempts += 1;
      const attemptsRemaining = MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts;

      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        // Lock the account
        user.lockUntil = new Date(Date.now() + LOCK_DURATION);
        await user.save();

        // Send account-locked notification email (fire-and-forget, don't block response)
        const lockMinutes = Math.ceil(LOCK_DURATION / (60 * 1000));
        sendAccountLockedEmail(user.email, user.firstName, lockMinutes).catch((err) =>
          console.error("Failed to send account-locked email:", err.message)
        );

        return res.status(423).json({
          success: false,
          message: `Too many failed attempts. Account locked for ${Math.ceil(LOCK_DURATION / (60 * 1000))} minutes.`,
          locked: true,
          lockUntil: user.lockUntil,
          attemptsRemaining: 0,
        });
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${attemptsRemaining} attempt(s) remaining before lockout.`,
        attemptsRemaining,
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const postLogout = (req, res) => {
  res.clearCookie("token", { path: "/", httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', secure: process.env.NODE_ENV === "production" });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { getMe, postLogin, postLogout };

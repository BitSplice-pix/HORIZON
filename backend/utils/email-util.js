const { sendEmail } = require("../config/email_config");
require("dotenv").config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ─── Shared HTML wrapper ────────────────────────────────────────────────────────
const wrapHtml = (body) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
    ${body}
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 16px;" />
    <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">© Horizon</p>
  </div>
`;

// ─── 1. OTP Verification Email ──────────────────────────────────────────────────
// Used during: signup verification, profile password-change OTP request, resend OTP
const sendOtpEmail = async (email, firstName, lastName, otp) => {
  const subject = "Verify Your Email — Horizon";
  const html = wrapHtml(`
    <h2 style="color: #111827; margin-bottom: 8px;">Hello ${firstName} ${lastName},</h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      Use the OTP below to verify your email address. It expires in <strong>5 minutes</strong>.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4f46e5; background: #eef2ff; padding: 14px 28px; border-radius: 8px;">
        ${otp}
      </span>
    </div>
    <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email.</p>
  `);
  await sendEmail(email, subject, html);
};

// ─── 2. Forgot Password Email ───────────────────────────────────────────────────
// Used during: forgot-password flow (logged-out users get a reset link)
const sendForgotPasswordEmail = async (email, token) => {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  const subject = "Reset Your Password — Horizon";
  const html = wrapHtml(`
    <h2 style="color: #111827; margin-bottom: 8px;">Password Reset Request</h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password.
      This link expires in <strong>5 minutes</strong>.
    </p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetLink}" style="display: inline-block; padding: 12px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 8px;">
        Reset Password
      </a>
    </div>
    <p style="color: #6b7280; font-size: 13px;">If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="color: #6b7280; font-size: 12px; word-break: break-all;">${resetLink}</p>
    <p style="color: #6b7280; font-size: 13px;">If you did not request a password reset, you can safely ignore this email.</p>
  `);
  await sendEmail(email, subject, html);
};

// ─── 3. Password Changed Confirmation Email ─────────────────────────────────────
// Used after: password is successfully changed (via forgot-password OR profile reset)
const sendPasswordChangedEmail = async (email, firstName) => {
  const subject = "Your Password Was Changed — Horizon";
  const html = wrapHtml(`
    <h2 style="color: #111827; margin-bottom: 8px;">Hi ${firstName},</h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      Your password was successfully changed. If you made this change, no further action is needed.
    </p>
    <p style="color: #ef4444; font-size: 14px; font-weight: 600; line-height: 1.6;">
      If you did <strong>not</strong> change your password, please reset it immediately using the link below and contact support.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${FRONTEND_URL}/forgot-password" style="display: inline-block; padding: 12px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 8px;">
        Secure My Account
      </a>
    </div>
  `);
  await sendEmail(email, subject, html);
};

// ─── 4. Welcome Email ───────────────────────────────────────────────────────────
// Used after: user successfully verifies their OTP and account is activated
const sendWelcomeEmail = async (email, firstName) => {
  const subject = "Welcome to Horizon!";
  const html = wrapHtml(`
    <h2 style="color: #111827; margin-bottom: 8px;">Welcome, ${firstName}! 🎉</h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      Your email has been verified and your account is now active. You're all set to get started.
    </p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${FRONTEND_URL}/login" style="display: inline-block; padding: 12px 32px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 8px;">
        Log In Now
      </a>
    </div>
    <p style="color: #6b7280; font-size: 13px;">Thanks for joining Horizon.</p>
  `);
  await sendEmail(email, subject, html);
};

// ─── 5. Account Locked Email ────────────────────────────────────────────────────
// Used when: account is locked after too many failed login attempts
const sendAccountLockedEmail = async (email, firstName, lockDurationMinutes) => {
  const subject = "Account Locked — Horizon";
  const html = wrapHtml(`
    <h2 style="color: #111827; margin-bottom: 8px;">Hi ${firstName},</h2>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      Your Horizon account has been temporarily locked due to <strong>too many failed login attempts</strong>.
    </p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
      You can try again in <strong>${lockDurationMinutes} minutes</strong>, or reset your password now to unlock your account immediately.
    </p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${FRONTEND_URL}/forgot-password" style="display: inline-block; padding: 12px 32px; background-color: #f59e0b; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; border-radius: 8px;">
        Reset Password
      </a>
    </div>
    <p style="color: #6b7280; font-size: 13px;">If this wasn't you, someone may be trying to access your account. Please reset your password immediately.</p>
  `);
  await sendEmail(email, subject, html);
};

module.exports = {
  sendOtpEmail,
  sendForgotPasswordEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendAccountLockedEmail,
};

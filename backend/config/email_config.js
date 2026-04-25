const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.EMAIL;

/**
 * Send an email using SendGrid.
 * All email-util functions call this single abstraction so the provider
 * can be swapped later without touching any controller/util code.
 *
 * @param {string} to        – Recipient email address
 * @param {string} subject   – Email subject line
 * @param {string} html      – Email body (HTML)
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error("SendGrid email error:", err?.response?.body || err.message);
    throw new Error("Failed to send email");
  }
};

module.exports = {
  sendEmail,
};

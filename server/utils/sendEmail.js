// --- START OF FILE server/utils/sendEmail.js ---
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const requiredSettings = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"];
  const missingSettings = requiredSettings.filter((key) => !process.env[key]);

  if (missingSettings.length) {
    const message = missingSettings.includes("SMTP_PASS")
      ? "Email service is not configured: SMTP_PASS is missing. Add a Gmail App Password to server/.env, then restart the server."
      : `Email service is not configured: ${missingSettings.join(", ")}`;
    const error = new Error(message);
    error.code = "EMAIL_CONFIG_MISSING";
    throw error;
  }

  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    const error = new Error("Email service has an invalid SMTP_PORT.");
    error.code = "EMAIL_CONFIG_INVALID";
    throw error;
  }

  // 1. Create the transporter with your Gmail credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 2. Define the email layout
  const message = {
    from: process.env.EMAIL_FROM,
    to: options.email.trim().toLowerCase(),
    subject: options.subject,
    text: options.message, // Plain text fallback
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">Disaster Management Portal Verification</h2>
        <p>Hello,</p>
        <p>To verify your email address, please use the following One-Time Password (OTP):</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${options.otp}</h1>
        </div>

        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">Disaster Management Portal Team</p>
      </div>
    `,
  };

  // 3. Send the email
  await transporter.sendMail(message);
};

module.exports = sendEmail;
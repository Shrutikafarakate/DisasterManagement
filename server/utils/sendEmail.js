const parseSender = (value) => {
  const formatted = value.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);
  const sender = formatted
    ? {
        name: formatted[1].replace(/^["']|["']$/g, "").trim(),
        email: formatted[2].trim(),
      }
    : { email: value.trim() };

  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(sender.email)) {
    const error = new Error("Email service has an invalid EMAIL_FROM address.");
    error.code = "EMAIL_CONFIG_INVALID";
    throw error;
  }

  return sender;
};

const sendEmail = async (options) => {
  const requiredSettings = ["BREVO_API_KEY", "EMAIL_FROM"];
  const missingSettings = requiredSettings.filter((key) => !process.env[key]);

  if (missingSettings.length) {
    const error = new Error(
      `Email service is not configured: ${missingSettings.join(", ")}`
    );
    error.code = "EMAIL_CONFIG_MISSING";
    throw error;
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    signal: AbortSignal.timeout(10000),
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: parseSender(process.env.EMAIL_FROM),
      to: [{ email: options.email.trim().toLowerCase() }],
      subject: options.subject,
      textContent: options.message,
      htmlContent: `
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
    }),
  });

  if (!response.ok) {
    const error = new Error(
      `Brevo email API request failed with status ${response.status}.`
    );
    error.code = "EMAIL_DELIVERY_FAILED";
    throw error;
  }
};

module.exports = sendEmail;

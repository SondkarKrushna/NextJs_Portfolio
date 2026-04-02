import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendThankYouEmail(name: string, email: string) {
  const ownerName = process.env.PORTFOLIO_OWNER_NAME || "Krushna Sondkar";
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  const mailOptions = {
    from: `"${ownerName}" <${fromAddress}>`,
    to: email,
    subject: `Thanks for connecting, ${name}!`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #818cf8); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Thanks for Reaching Out!</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-top: 0;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Thank you for connecting with me. I have received your message and truly appreciate you taking the time to reach out.
          </p>
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            I will review your message and get back to you as soon as possible.
          </p>
          <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 0;">
            Best regards,<br />
            <strong>${ownerName}</strong>
          </p>
        </div>
        <div style="background-color: #f3f4f6; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 13px; color: #9ca3af; margin: 0;">
            This is an automated confirmation email. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

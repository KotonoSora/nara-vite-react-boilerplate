// Email service for authentication-related emails
// In a production environment, you would integrate with a real email service like:
// - SendGrid
// - Mailgun
// - AWS SES
// - Resend
// For now, we'll simulate email sending

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailVerificationData {
  name: string;
  verificationLink: string;
  email: string;
}

export interface PasswordResetData {
  name: string;
  resetLink: string;
  email: string;
}

// Mock email service - replace with real implementation
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // In production, integrate with your email service
  console.log("📧 Email would be sent:", options);

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In development, log to console instead of sending real email
  if (import.meta.env.MODE === "development") {
    console.log("Development mode: Email content:");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    console.log("HTML:", options.html);
    return true;
  }

  // For production, implement actual email sending
  // Example with SendGrid:
  // const sg = require('@sendgrid/mail');
  // sg.setApiKey(process.env.SENDGRID_API_KEY);
  // await sg.send(options);

  return true;
}

export function createEmailVerificationTemplate(
  data: EmailVerificationData,
): EmailOptions {
  const { name, verificationLink, email } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - NARA</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .footer { margin-top: 30px; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Email Address</h2>
        <p>Hello ${name},</p>
        <p>Thank you for creating an account with NARA! To complete your registration, please verify your email address by clicking the button below:</p>
        <p><a href="${verificationLink}" class="button">Verify Email Address</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>This verification link will expire in 24 hours.</p>
        <div class="footer">
          <p>If you didn't create an account with NARA, you can safely ignore this email.</p>
          <p>Best regards,<br>The NARA Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Verify Your Email Address
    
    Hello ${name},
    
    Thank you for creating an account with NARA! To complete your registration, please verify your email address by clicking the link below:
    
    ${verificationLink}
    
    This verification link will expire in 24 hours.
    
    If you didn't create an account with NARA, you can safely ignore this email.
    
    Best regards,
    The NARA Team
  `;

  return {
    to: email,
    subject: "Verify Your Email Address - NARA",
    html,
    text,
  };
}

export function createPasswordResetTemplate(
  data: PasswordResetData,
): EmailOptions {
  const { name, resetLink, email } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - NARA</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
        .footer { margin-top: 30px; font-size: 14px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reset Your Password</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password for your NARA account. Click the button below to set a new password:</p>
        <p><a href="${resetLink}" class="button">Reset Password</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <div class="warning">
          <strong>Security Notice:</strong> This reset link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
        </div>
        <div class="footer">
          <p>For security reasons, we recommend using a strong, unique password.</p>
          <p>Best regards,<br>The NARA Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Reset Your Password
    
    Hello ${name},
    
    We received a request to reset your password for your NARA account. Click the link below to set a new password:
    
    ${resetLink}
    
    Security Notice: This reset link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
    
    For security reasons, we recommend using a strong, unique password.
    
    Best regards,
    The NARA Team
  `;

  return {
    to: email,
    subject: "Reset Your Password - NARA",
    html,
    text,
  };
}

export async function sendEmailVerification(
  data: EmailVerificationData,
): Promise<boolean> {
  const emailOptions = createEmailVerificationTemplate(data);
  return await sendEmail(emailOptions);
}

export async function sendPasswordReset(
  data: PasswordResetData,
): Promise<boolean> {
  const emailOptions = createPasswordResetTemplate(data);
  return await sendEmail(emailOptions);
}

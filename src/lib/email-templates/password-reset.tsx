import * as React from 'react';

interface PasswordResetEmailProps {
  firstName: string;
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  firstName,
  resetUrl,
}) => (
  <html>
    <head>
      <style>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #6b7c3f 0%, #8a9b5a 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background: #6b7c3f;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .info-box {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
        `}
      </style>
    </head>
    <body>
      <div className="header">
        <h1>Password Reset Request</h1>
      </div>
      <div className="content">
        <p>Hi {firstName},</p>
        
        <p>
          We received a request to reset your password for your OrbitHR account. 
          If you made this request, click the button below to reset your password.
        </p>

        <div style={{ textAlign: 'center' }}>
          <a href={resetUrl} className="button">
            Reset Your Password
          </a>
        </div>

        <div className="info-box">
          <strong>ℹ️ Important Information:</strong><br />
          This password reset link will expire in <strong>1 hour</strong> for security reasons.
          If you don't reset your password within this time, you'll need to request a new link.
          <ul>
            <li>Don't share your password with anyone</li>
            <li>Change your password regularly</li>
            <li>Enable two-factor authentication if available</li>
          </ul>
        </div>
        <p>
          If you have any concerns about your account security, please contact 
          your HR department immediately.
        </p>

        <p>
          Best regards,<br />
          <strong>The OrbitHR Team</strong>
        </p>
      </div>

      <div className="footer">
        <p>
          This is an automated message. Please do not reply to this email.<br />
          If the button above doesn't work, copy and paste this link into your browser:<br />
          <span style={{ fontSize: '10px', wordBreak: 'break-all' }}>{resetUrl}</span>
        </p>
        <p>
          © {new Date().getFullYear()} OrbitHR. All rights reserved.
        </p>
      </div>
    </body>
  </html>
);

export default PasswordResetEmail;

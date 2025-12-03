import * as React from 'react';

interface WelcomeEmployeeEmailProps {
  firstName: string;
  email: string;
  password: string;
  portalUrl: string;
}

export const WelcomeEmployeeEmail: React.FC<WelcomeEmployeeEmailProps> = ({
  firstName,
  email,
  password,
  portalUrl,
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
          .credentials-box {
            background: white;
            border: 2px solid #6b7c3f;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .credential-item {
            margin: 10px 0;
          }
          .credential-label {
            font-weight: bold;
            color: #6b7c3f;
          }
          .credential-value {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 8px 12px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 5px;
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
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
        `}
      </style>
    </head>
    <body>
      <div className="header">
        <h1>Welcome to OrbitHR!</h1>
      </div>
      <div className="content">
        <p>Hi {firstName},</p>
        
        <p>
          Welcome to OrbitHR! Your employee account has been successfully created. 
          You can now access the employee portal to view your information, request time off, 
          and stay connected with your team.
        </p>

        <div className="credentials-box">
          <h3 style={{ marginTop: 0, color: '#6b7c3f' }}>Your Login Credentials</h3>
          
          <div className="credential-item">
            <div className="credential-label">Email:</div>
            <div className="credential-value">{email}</div>
          </div>
          
          <div className="credential-item">
            <div className="credential-label">Temporary Password:</div>
            <div className="credential-value">{password}</div>
          </div>
        </div>

        <div className="warning">
          <strong>⚠️ Important Security Notice:</strong><br />
          For your security, please change your password after your first login. 
          Do not share your credentials with anyone.
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href={portalUrl} className="button">
            Access Employee Portal
          </a>
        </div>

        <h3 style={{ color: '#6b7c3f' }}>Getting Started</h3>
        <ul>
          <li>Complete your profile information</li>
          <li>Review company policies and documents</li>
          <li>Set up your preferences</li>
          <li>Explore available features</li>
        </ul>

        <p>
          If you have any questions or need assistance, please don't hesitate to contact 
          your HR department.
        </p>

        <p>
          Best regards,<br />
          <strong>The OrbitHR Team</strong>
        </p>
      </div>

      <div className="footer">
        <p>
          This is an automated message. Please do not reply to this email.<br />
          © {new Date().getFullYear()} OrbitHR. All rights reserved.
        </p>
      </div>
    </body>
  </html>
);

export default WelcomeEmployeeEmail;

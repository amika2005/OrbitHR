import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeaveRequestEmailData {
  employeeName: string;
  employeeEmail: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  reviewerName: string;
  reviewNotes?: string;
}

export async function sendLeaveApprovalEmail(data: LeaveRequestEmailData) {
  try {
    const { employeeName, employeeEmail, leaveType, startDate, endDate, totalDays, reviewerName, reviewNotes } = data;

    await resend.emails.send({
      from: 'OrbitHR <noreply@orbithr.com>',
      to: employeeEmail,
      subject: '✅ Leave Request Approved',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
              .header { background: linear-gradient(135deg, #6da670 0%, #5a8f5d 100%); padding: 40px 20px; text-align: center; }
              .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
              .content { padding: 40px 30px; }
              .status-badge { display: inline-block; background-color: #6da670; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; margin-bottom: 20px; }
              .info-box { background-color: #f0fdf4; border-left: 4px solid #6da670; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .info-row:last-child { border-bottom: none; }
              .info-label { font-weight: 600; color: #6b7280; }
              .info-value { color: #111827; }
              .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background-color: #6da670; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Leave Request Approved</h1>
              </div>
              <div class="content">
                <p>Hi ${employeeName},</p>
                <p>Great news! Your leave request has been approved.</p>
                
                <div class="status-badge">✓ APPROVED</div>
                
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Leave Type:</span>
                    <span class="info-value">${leaveType.replace(/_/g, ' ')}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">${startDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">End Date:</span>
                    <span class="info-value">${endDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${totalDays} ${totalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Approved By:</span>
                    <span class="info-value">${reviewerName}</span>
                  </div>
                </div>
                
                ${reviewNotes ? `
                  <p><strong>Manager's Note:</strong></p>
                  <p style="background-color: #f9fafb; padding: 15px; border-radius: 6px; font-style: italic;">${reviewNotes}</p>
                ` : ''}
                
                <p>Your leave has been added to the company calendar. Enjoy your time off!</p>
                
                <a href="http://localhost:3000/dashboard/leave" class="button">View Leave Calendar</a>
              </div>
              <div class="footer">
                <p>This is an automated email from OrbitHR. Please do not reply to this email.</p>
                <p>&copy; 2024 OrbitHR. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export async function sendLeaveRejectionEmail(data: LeaveRequestEmailData) {
  try {
    const { employeeName, employeeEmail, leaveType, startDate, endDate, totalDays, reviewerName, reviewNotes } = data;

    await resend.emails.send({
      from: 'OrbitHR <noreply@orbithr.com>',
      to: employeeEmail,
      subject: '❌ Leave Request Not Approved',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
              .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
              .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
              .content { padding: 40px 30px; }
              .status-badge { display: inline-block; background-color: #ef4444; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; margin-bottom: 20px; }
              .info-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .info-row:last-child { border-bottom: none; }
              .info-label { font-weight: 600; color: #6b7280; }
              .info-value { color: #111827; }
              .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background-color: #6da670; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Leave Request Update</h1>
              </div>
              <div class="content">
                <p>Hi ${employeeName},</p>
                <p>We wanted to inform you about the status of your leave request.</p>
                
                <div class="status-badge">✗ NOT APPROVED</div>
                
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Leave Type:</span>
                    <span class="info-value">${leaveType.replace(/_/g, ' ')}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">${startDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">End Date:</span>
                    <span class="info-value">${endDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${totalDays} ${totalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Reviewed By:</span>
                    <span class="info-value">${reviewerName}</span>
                  </div>
                </div>
                
                ${reviewNotes ? `
                  <p><strong>Manager's Note:</strong></p>
                  <p style="background-color: #f9fafb; padding: 15px; border-radius: 6px; font-style: italic;">${reviewNotes}</p>
                ` : ''}
                
                <p>If you have any questions or would like to discuss this further, please reach out to your manager or HR department.</p>
                
                <a href="http://localhost:3000/dashboard/leave" class="button">View Leave Dashboard</a>
              </div>
              <div class="footer">
                <p>This is an automated email from OrbitHR. Please do not reply to this email.</p>
                <p>&copy; 2024 OrbitHR. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export async function sendLeaveRequestNotification(data: LeaveRequestEmailData & { managerEmail: string }) {
  try {
    const { employeeName, managerEmail, leaveType, startDate, endDate, totalDays, reason } = data;

    await resend.emails.send({
      from: 'OrbitHR <noreply@orbithr.com>',
      to: managerEmail,
      subject: '📋 New Leave Request Pending Approval',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
              .header { background: linear-gradient(135deg, #d67349 0%, #c55a35 100%); padding: 40px 20px; text-align: center; }
              .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
              .content { padding: 40px 30px; }
              .status-badge { display: inline-block; background-color: #d67349; color: #ffffff; padding: 8px 16px; border-radius: 6px; font-weight: 600; margin-bottom: 20px; }
              .info-box { background-color: #fff7ed; border-left: 4px solid #d67349; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .info-row:last-child { border-bottom: none; }
              .info-label { font-weight: 600; color: #6b7280; }
              .info-value { color: #111827; }
              .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background-color: #6da670; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📋 New Leave Request</h1>
              </div>
              <div class="content">
                <p>A new leave request requires your approval.</p>
                
                <div class="status-badge">⏳ PENDING APPROVAL</div>
                
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">Employee:</span>
                    <span class="info-value">${employeeName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Leave Type:</span>
                    <span class="info-value">${leaveType.replace(/_/g, ' ')}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">${startDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">End Date:</span>
                    <span class="info-value">${endDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${totalDays} ${totalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
                
                ${reason ? `
                  <p><strong>Reason:</strong></p>
                  <p style="background-color: #f9fafb; padding: 15px; border-radius: 6px; font-style: italic;">${reason}</p>
                ` : ''}
                
                <p>Please review and approve or reject this request in the OrbitHR dashboard.</p>
                
                <a href="http://localhost:3000/dashboard/leave" class="button">Review Request</a>
              </div>
              <div class="footer">
                <p>This is an automated email from OrbitHR. Please do not reply to this email.</p>
                <p>&copy; 2024 OrbitHR. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

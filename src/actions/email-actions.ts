"use server";

import nodemailer from "nodemailer";

export async function sendPayslipEmail(
  to: string,
  cc: string[],
  subject: string,
  html: string,
  payslipData?: any,
  pdfAttachment?: string // Base64 encoded PDF
) {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("Gmail credentials missing");
      return { 
        success: false, 
        error: "Email service not configured. Please add GMAIL_USER and GMAIL_APP_PASSWORD to .env" 
      };
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Prepare attachments
    const attachments = [];
    if (pdfAttachment) {
      // Extract base64 data from data URL
      const base64Data = pdfAttachment.split(',')[1] || pdfAttachment;
      attachments.push({
        filename: `Payslip_${payslipData?.employeeName?.replace(/\s/g, '_')}_${payslipData?.month}_${payslipData?.year}.pdf`,
        content: base64Data,
        encoding: 'base64',
        contentType: 'application/pdf'
      });
    }

    // Check for local logo image
    try {
      const path = await import('path');
      const fs = await import('fs');
      
      // Check possible locations for the logo
      const possiblePaths = [
        path.join(process.cwd(), 'public', 'assets', 'Mail_logo.png'),
        path.join(process.cwd(), 'public', 'Mail_logo.png')
      ];

      let logoAttached = false;

      for (const logoPath of possiblePaths) {
        if (fs.existsSync(logoPath)) {
          console.log("✅ Found logo at:", logoPath);
          attachments.push({
            filename: 'Mail_logo.png',
            path: logoPath, // Use path instead of content for better handling
            cid: 'company-logo',
            contentType: 'image/png'
          });
          logoAttached = true;
          break;
        }
      }

      if (!logoAttached) {
        console.warn("⚠️ Logo file not found. Checked:", possiblePaths);
      }
    } catch (e) {
      console.warn("❌ Could not attach local logo:", e);
    }

    // Send email to employee
    const info = await transporter.sendMail({
      from: `"OrbitHR Payroll" <${process.env.GMAIL_USER}>`,
      to: to,
      cc: cc.length > 0 ? cc.join(', ') : undefined,
      subject: subject,
      html: html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log("✅ Email sent:", info.messageId, "to:", to, "with PDF:", !!pdfAttachment);
    return { success: true, id: info.messageId };
    
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send email" 
    };
  }
}

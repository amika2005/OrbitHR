import { formatCurrency } from "@/lib/utils";

interface EmailData {
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netSalary: number;
  companyName: string;
}

export function generatePayslipEmail(data: EmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 40px auto; 
          background-color: #ffffff;
          padding: 40px;
        }
        .header { 
          margin-bottom: 30px;
        }
        .header h1 { 
          color: #000000; 
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content { 
          margin-bottom: 40px;
          font-size: 16px;
          line-height: 1.8;
        }
        .content p {
          margin: 0 0 15px 0;
        }
        .signature {
          margin-top: 40px;
          padding-top: 20px;
        }
        .signature-name {
          font-weight: 600;
          margin: 5px 0;
          font-size: 16px;
        }
        .signature-title {
          color: #666;
          margin: 3px 0;
          font-size: 14px;
        }
        .company-info {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
        .company-name {
          font-weight: 600;
          margin-bottom: 5px;
        }
        .company-details {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
        }
        .logo {
          margin-top: 15px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Salary Slip for ${data.month} ${data.year}</h1>
        </div>
        
        <div class="content">
          <p>Dear ${data.employeeName},</p>
          <p>Please find attached your salary slip for the month of ${data.month}. Let me know if you have any questions or need further clarification.</p>
          <p>Best regards,</p>
        </div>
        
        <div class="signature">
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
            <tr>
              <td style="vertical-align: top; width: 120px; padding-right: 20px;">
                <!-- Logo attached via CID in email-actions.ts -->
                <img src="cid:company-logo" alt="Infinit Tech Systems" style="width: 100px; height: auto; display: block;" />
              </td>
              <td style="vertical-align: top; color: #333; font-size: 13px; line-height: 1.5;">
                <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #000;">
                  Namadini Perera | HR- People & Culture
                </div>
                
                <div style="margin-bottom: 12px;">
                  <div style="font-weight: 600;">Infinit Tech Systems (Pvt) Ltd,</div>
                  <div>[affiliated with <a href="https://sonasu.jp" style="color: #0066cc; text-decoration: none;">Sonasu Co. Ltd.</a>]</div>
                  <div>Level 35, West Tower, World Trade Center, Colombo 01, Sri Lanka.</div>
                  <div>+94 11 749 4398 | <a href="mailto:info@infinit.lk" style="color: #0066cc; text-decoration: none;">info@infinit.lk</a> , <a href="mailto:info@sonasu.jp" style="color: #0066cc; text-decoration: none;">info@sonasu.jp</a></div>
                </div>

                <div>
                  <div>E-Mail :- <a href="mailto:namadini@infinit.lk" style="color: #0066cc; text-decoration: none;">namadini@infinit.lk</a> , <a href="mailto:namadini@sonasu.jp" style="color: #0066cc; text-decoration: none;">namadini@sonasu.jp</a> , <a href="mailto:hr@infinit.lk" style="color: #0066cc; text-decoration: none;">hr@infinit.lk</a></div>
                  <div>Mobile :- +94 77 029 1591</div>
                  <div>Web :- <a href="https://infinit.lk" style="color: #0066cc; text-decoration: none;">infinit.lk</a> , <a href="https://sonasu.jp" style="color: #0066cc; text-decoration: none;">sonasu.jp</a></div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
}

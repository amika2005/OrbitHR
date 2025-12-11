import jsPDF from 'jspdf';
// Removed autoTable dependency to ensure stability

interface PayslipData {
  employeeName: string;
  employeeId?: string;
  epfNumber?: string;
  nicNumber?: string;
  designation: string;
  department?: string;
  employmentType?: string;
  dateOfJoining?: string;
  payPeriod: string;
  workedDays: number;
  totalDays?: number;
  basicSalary: number;
  allowances: {
    fixed?: number;
    operational: number;
    wellBeing: number;
    utilityTravel: number;
    salesCommission: number;
    other: number;
  };
  deductions: {
    apit: number;
    unpaidLeave: number;
    lateAttendance: number;
    other: number;
  };
  commission: number;
  epf: number;
  epfEmployer: number;
  etf: number;
  netPay: number;
  bankName?: string;
  branch?: string;
  accountNumber?: string;
  companyName: string;
  companyAddress: string;
  companyPhone?: string;
  companyMobile?: string;
  companyEmail?: string;
  companyPvNumber?: string;
  companyLogo?: string;
  notes?: string;
}

function formatAmount(amount: number): string {
  if (amount === undefined || amount === null || amount === 0) return '-';
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generatePayslipPDF(data: PayslipData): string {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Colors - Matching Image
    // Dark Navy / Teal from Logo Text "Infinit Tech Systems"
    const DARK_BLUE = [0, 51, 102] as [number, number, number];
    // Light Gray for Header Background
    const GRAY_HEADER = [224, 224, 224] as [number, number, number];
    // Light Cyan/Blue for Net Pay Background
    const LIGHT_CYAN_BG = [224, 247, 250] as [number, number, number];

    // ============ COMPANY HEADER ============
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    doc.text(data.companyName || 'Infinit Tech Systems (PVT) LTD', margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Black text for details
    
    // Address
    doc.text(data.companyAddress || 'Level 35, West Tower, World Trade Center, Colombo 01, Sri Lanka', margin, y);
    y += 5;
    
    // Contact
    const phone = (data.companyPhone && data.companyMobile) 
      ? `T.P : ${data.companyPhone} | M : ${data.companyMobile}`
      : 'T.P : +94 11 749 4398 | M : +94 77 029 1591';
    doc.text(phone, margin, y);
    y += 5;
    
    // Email
    doc.text(`E-mail : ${data.companyEmail || 'hr@infinit.lk'}`, margin, y);
    y += 5;
    
    // PV Number
    doc.text(`PV ${data.companyPvNumber || '00338004'}`, margin, y);

    // Right Side Logo
    if (data.companyLogo) {
        try {
             // Logo positioned higher and larger as requested
             // Y position: margin - 2 (moves up), Size: 45x20 (increased from 35x15)
             doc.addImage(data.companyLogo, 'PNG', pageWidth - margin - 45, margin - 8, 55, 25, undefined, 'FAST');
        } catch (e) {
            console.error('Logo failed to load');
        }
    }
    
    // Ensure Y moves down enough
    y = Math.max(y + 10, margin + 40);

    // ============ TITLE ============
    const [payMonth, payYear] = data.payPeriod.split(' ');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    
    const titleText = `PAYSLIP FOR THE MONTH OF       ${(payMonth || 'DECEMBER').toUpperCase()}         ${payYear || '2025'}`;
    doc.text(titleText, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // ============ EMPLOYEE DETAILS BOX ============
    const boxTop = y;
    const boxHeight = 25;
    
    // Border
    doc.setDrawColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    doc.setLineWidth(0.4);
    doc.rect(margin, boxTop, contentWidth, boxHeight);

    // Content
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const col1 = margin + 4;
    // Align col2 at the start of Deductions column (x3) with padding
    const amtW = 28;
    const halfWidth = contentWidth / 2;
    const x3 = margin + halfWidth;
    const col2 = x3 + 15; // Move further right for better alignment
    let textY = boxTop + 6;

    // Row 1
    doc.text(`Employee Name : ${data.employeeName || ''}`, col1, textY);
    doc.text(`Employee No : ${data.employeeId || ''}`, col2, textY);
    textY += 6;

    // Row 2
    doc.text(`Designation : ${data.designation || ''}`, col1, textY);
    doc.text(`EPF No : ${data.epfNumber || ''}`, col2, textY);
    textY += 6;

    // Row 3
    doc.text(`Employment type : ${data.employmentType || ''}`, col1, textY);
    doc.text(`Joined Date : ${data.dateOfJoining || ''}`, col2, textY);
    textY += 6;

    // Row 4
    doc.text(`NIC/P.P No. : ${data.nicNumber || '-'}`, col1, textY);
    const attendance = data.totalDays ? `${data.workedDays}/${data.totalDays} days` : `${data.workedDays} days`;
    doc.text(`Attendance : ${attendance}`, col2, textY);
    
    // NO GAP - Bind directly to table
    y = boxTop + boxHeight; 

    // ============ MAIN TABLE ============
    const rowHeight = 7;
    // Columns Strategy:
    // Image shows 4 vertical columns: EarningsDesc | EarningsAmt | DeductionsDesc | DeductionsAmt
    // Visual estimation: 
    // Amt columns ~ 25-28mm. 
    // Desc columns take remaining space equally.
    
    // columns: EarningsDesc | EarningsAmt | DeductionsDesc | DeductionsAmt
    // Reuse descW from above
    const descW = halfWidth - amtW;
    
    const x1 = margin;
    const x2 = x1 + descW;      // Line between Earnings Desc & Amt
    // const x3 = x1 + halfWidth;  // Reuse x3 from above
    const x4 = x3 + descW;      // Line between Deductions Desc & Amt

    // Header Row
    doc.setFillColor(GRAY_HEADER[0], GRAY_HEADER[1], GRAY_HEADER[2]);
    doc.rect(margin, y, contentWidth, rowHeight, 'F'); // BG
    
    doc.setDrawColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    doc.setLineWidth(0.1); 
    doc.rect(margin, y, contentWidth, rowHeight); // Border
    
    // Vertical Lines (Only center line x3)
    // Removed x2 and x4 lines as per user request
    doc.line(x3, y, x3, y + rowHeight);

    // Text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    doc.text('EARNINGS', x1 + 2, y + 5);
    doc.text('DEDUCTIONS', x3 + 2, y + 5);

    y += rowHeight;

    // Data Rows
    const rows = [
        ['Basic Salary', data.basicSalary, 'EPF YEE 8%', data.epf],
        ['Fixed Allowances', (data.allowances.fixed || 0), 'APIT', data.deductions.apit],
        ['  Operational Allowance', data.allowances.operational, 'Unpaid Leave', data.deductions.unpaidLeave],
        ['  Employee Well-being Allowance', data.allowances.wellBeing, 'Late attendance', data.deductions.lateAttendance],
        ['  Utility/Travel Allowance', data.allowances.utilityTravel, 'Other', data.deductions.other],
        ['Sales Commission', (data.allowances.salesCommission + data.commission), '', null],
        ['Other Additions/ Reimbursements', data.allowances.other, '', null],
    ];

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Black content

    for (const row of rows) {
        // Row Box
        doc.rect(margin, y, contentWidth, rowHeight);
        
        // Vertical Lines
        // Keep center line x3 for all rows (user requested)
        doc.line(x3, y, x3, y + rowHeight);

        // Content
        // Col 1 (Earnings Desc)
        doc.text(String(row[0]), x1 + 2, y + 5);
        
        // Col 2 (Earnings Amt)
        const amt1 = row[1];
        const isFixedAllowances = String(row[0]) === 'Fixed Allowances';
        // Don't show amount for Fixed Allowances (it's a topic)
        if (amt1 !== null && !isFixedAllowances) {
             const displayVal = (typeof amt1 === 'number' && amt1 === 0) ? '-' : formatAmount(amt1 as number);
             doc.text(displayVal, x3 - 2, y + 5, { align: 'right' });
        }

        // Col 3 (Deductions Desc)
        const label2 = String(row[2] || '');
        if (label2) doc.text(label2, x3 + 2, y + 5);

        // Col 4 (Deductions Amt)
        const amt2 = row[3];
        if (label2 || (amt2 !== null && amt2 !== undefined)) { 
             const displayVal = (typeof amt2 === 'number' && amt2 === 0) ? '-' : (amt2 === null ? '' : formatAmount(amt2 as number));
             if (displayVal !== '') doc.text(displayVal, margin + contentWidth - 2, y + 5, { align: 'right' });
        }
        
        y += rowHeight;
    }

    // Totals Row
    const totalEarnings = data.basicSalary + (Object.values(data.allowances).reduce((a, b) => a + (b || 0), 0) as number) + data.commission;
    const totalDeductions = data.epf + (Object.values(data.deductions).reduce((a, b) => a + (b || 0), 0) as number);

    doc.setFont('helvetica', 'bold');
    doc.rect(margin, y, contentWidth, rowHeight);
    
    // Vertical Lines
    doc.line(x2, y, x2, y + rowHeight); 
    doc.line(x3, y, x3, y + rowHeight);
    doc.line(x4, y, x4, y + rowHeight);

    doc.text('Total Earnings', x1 + 2, y + 5);
    doc.text(formatAmount(totalEarnings), x3 - 2, y + 5, { align: 'right' });
    doc.text('Total Deduction', x3 + 2, y + 5);
    doc.text(formatAmount(totalDeductions), margin + contentWidth - 2, y + 5, { align: 'right' });
    
    y += rowHeight;

    // ============ NET PAY ============
    // Attached to Totals (No Gap)
    doc.setFillColor(LIGHT_CYAN_BG[0], LIGHT_CYAN_BG[1], LIGHT_CYAN_BG[2]);
    doc.rect(margin, y, contentWidth, 9, 'F');
    
    doc.setDrawColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    doc.rect(margin, y, contentWidth, 9); // Border
    
    doc.setFontSize(11);
    doc.setTextColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]);
    
    doc.text('NET PAY', margin + 4, y + 6);
    doc.text(formatAmount(data.netPay), margin + contentWidth - 4, y + 6, { align: 'right' });

    y += 9;

    // ============ FOOTER (EPF / BANK) ============
    // Recreating exact grid from image
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2]); 
    
    const bottomRows = [
        ['EPF YER 12%', formatAmount(data.epfEmployer), `Bank Name : ${data.bankName || ''}`],
        ['ETF YER 3%', formatAmount(data.etf), `Branch : ${data.branch || ''}`],
        [`Notes : ${data.notes || ''}`, '', `Account Number : ${data.accountNumber || ''}`],
        ['', '', `Amount : ${formatAmount(data.netPay)}`]
    ];

    const footerStartY = y;
    let currentRowY = y;
    
    // Define widths for the left side columns
    const x1Width = halfWidth * 0.6; // Adjust as needed for description
    const x2Width = halfWidth * 0.4; // Adjust as needed for amount

    let rowIndex = 0;
    for (const row of bottomRows) {
        const isNotesRow = rowIndex === 2; // Notes Row
        const isAmountRow = rowIndex === 3; // Amount Row (Last one) (Empty on left)

        // RIGHT SIDE: Draw box for each row WITHOUT horizontal lines between them
        // Only draw vertical borders and text, no horizontal dividers
        if (rowIndex === 0) {
            // First row - draw top border
            doc.line(x3, currentRowY, x3 + halfWidth, currentRowY);
        }
        // Draw vertical borders
        doc.line(x3, currentRowY, x3, currentRowY + rowHeight); // Left border
        doc.line(x3 + halfWidth, currentRowY, x3 + halfWidth, currentRowY + rowHeight); // Right border
        // Draw bottom border only on last row
        if (rowIndex === 3) {
            doc.line(x3, currentRowY + rowHeight, x3 + halfWidth, currentRowY + rowHeight);
        }
        doc.text(String(row[2]), x3 + 2, currentRowY + 5);

        // LEFT SIDE:
        // If Notes row, draw Double Height Box (Merge with next)
        if (isNotesRow) {
             doc.rect(margin, currentRowY, halfWidth, rowHeight * 2);
             doc.text(String(row[0]), x1 + 2, currentRowY + 5); // Notes Text
        } else if (!isAmountRow) {
             // Normal rows (not Notes, not Amount)
             doc.rect(margin, currentRowY, x1Width, rowHeight);
             doc.text(String(row[0]), x1 + 2, currentRowY + 5);
             
             // Monetary value column
             doc.rect(margin + x1Width, currentRowY, x2Width, rowHeight);
             doc.text(String(row[1]), margin + x1Width + 2, currentRowY + 5);
        }
        // If Amount row, Left side is entirely empty, No box drawn.
        
        currentRowY += rowHeight;
        rowIndex++;
    }

    // Removed One Big Box logic, restored per-row grid above
    
    y = currentRowY; // Update main Y

    // ============ PAGE FOOTER ============

    const footerY = pageHeight - 12;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    doc.text('**THIS IS A SYSTEM-GENERATED PAYSLIP. NO SIGNATURE REQUIRED**', margin, footerY);
    doc.text('Infinit Tech Systems Pvt Ltd', pageWidth - margin, footerY, { align: 'right' });
    
    console.log("PDF Recreated - Image Match Mode");
    return doc.output('datauristring');

  } catch (error) {
    console.error('Fatal PDF Error:', error);
    return '';
  }
}

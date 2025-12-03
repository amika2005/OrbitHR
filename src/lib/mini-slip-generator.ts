interface MiniSlipData {
  employeeName: string;
  basicSalary: number;
  fixedAllowance: number;
  commission: number;
  epf: number;
  etf: number;
  netPay: number;
  month: string;
  companyName: string;
  companyLogo: string;
}

export function generateMiniPayslip(data: MiniSlipData): string {
  const {
    employeeName,
    basicSalary,
    fixedAllowance,
    commission,
    epf,
    etf,
    netPay,
    month,
    companyName,
    companyLogo,
  } = data;

  // Create a canvas element (check size: 3.5" x 8.5" at 96 DPI = 336px x 816px)
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Set canvas size (check dimensions)
  canvas.width = 400;
  canvas.height = 600;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Company Logo (if available)
  let yPos = 30;
  if (companyLogo) {
    const img = new Image();
    img.src = companyLogo;
    try {
      ctx.drawImage(img, canvas.width / 2 - 30, yPos, 60, 60);
      yPos += 70;
    } catch (e) {
      // If logo fails, just skip it
      yPos += 10;
    }
  }

  // Company Name
  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(companyName || 'Company Name', canvas.width / 2, yPos);
  yPos += 10;

  // Divider
  ctx.strokeStyle = '#d4d4d8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, yPos);
  ctx.lineTo(canvas.width - 30, yPos);
  ctx.stroke();
  yPos += 25;

  // Title
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#3f3f46';
  ctx.fillText('PAYSLIP', canvas.width / 2, yPos);
  yPos += 5;

  // Month
  ctx.font = '12px Arial';
  ctx.fillStyle = '#71717a';
  ctx.fillText(month, canvas.width / 2, yPos);
  yPos += 30;

  // Employee Name
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#18181b';
  ctx.textAlign = 'left';
  ctx.fillText('Employee:', 30, yPos);
  ctx.font = '14px Arial';
  ctx.fillText(employeeName, 130, yPos);
  yPos += 30;

  // Earnings Section
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#52525b';
  ctx.fillText('EARNINGS', 30, yPos);
  yPos += 20;

  // Basic Salary
  ctx.font = '11px Arial';
  ctx.fillStyle = '#3f3f46';
  ctx.fillText('Basic Salary', 40, yPos);
  ctx.textAlign = 'right';
  ctx.fillText(`Rs.${basicSalary.toLocaleString()}`, canvas.width - 30, yPos);
  yPos += 18;

  // Fixed Allowance
  if (fixedAllowance > 0) {
    ctx.textAlign = 'left';
    ctx.fillText('Fixed Allowance', 40, yPos);
    ctx.textAlign = 'right';
    ctx.fillText(`Rs.${fixedAllowance.toLocaleString()}`, canvas.width - 30, yPos);
    yPos += 18;
  }

  // Commission
  if (commission > 0) {
    ctx.textAlign = 'left';
    ctx.fillText('Commission', 40, yPos);
    ctx.textAlign = 'right';
    ctx.fillText(`Rs.${commission.toLocaleString()}`, canvas.width - 30, yPos);
    yPos += 18;
  }

  yPos += 10;

  // Deductions Section (only if there are deductions)
  if (epf > 0 || etf > 0) {
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = '#52525b';
    ctx.fillText('DEDUCTIONS', 30, yPos);
    yPos += 20;

    // EPF
    if (epf > 0) {
      ctx.font = '11px Arial';
      ctx.fillStyle = '#3f3f46';
      ctx.fillText('EPF (8%)', 40, yPos);
      ctx.textAlign = 'right';
      ctx.fillText(`Rs.${epf.toLocaleString()}`, canvas.width - 30, yPos);
      yPos += 18;
    }

    // ETF
    if (etf > 0) {
      ctx.textAlign = 'left';
      ctx.fillText('ETF (3%)', 40, yPos);
      ctx.textAlign = 'right';
      ctx.fillText(`Rs.${etf.toLocaleString()}`, canvas.width - 30, yPos);
      yPos += 18;
    }

    yPos += 12;
  } else {
    // If no deductions, add some spacing
    yPos += 10;
  }


  // Net Pay Box
  ctx.fillStyle = '#f4f4f5';
  ctx.fillRect(20, yPos - 10, canvas.width - 40, 50);
  ctx.strokeStyle = '#d4d4d8';
  ctx.strokeRect(20, yPos - 10, canvas.width - 40, 50);

  ctx.fillStyle = '#18181b';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('NET PAY', 30, yPos + 15);
  ctx.textAlign = 'right';
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#16a34a';
  ctx.fillText(`Rs.${netPay.toLocaleString()}`, canvas.width - 30, yPos + 15);

  yPos += 70;

  // Footer
  ctx.font = 'italic 9px Arial';
  ctx.fillStyle = '#a1a1aa';
  ctx.textAlign = 'center';
  ctx.fillText('This is a computer-generated payslip', canvas.width / 2, yPos);

  // Convert canvas to base64
  return canvas.toDataURL('image/png');
}

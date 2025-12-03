export interface PayrollInput {
  basicSalary: number;
  allowances: number;
  bonuses: number;
  employmentStatus: string; // "PERMANENT", "CONTRACT", "INTERN", etc.
}

export interface PayrollResult {
  grossSalary: number;
  basicSalary: number;
  allowances: number;
  bonuses: number;
  employeeEPF: number;
  employerEPF: number;
  employerETF: number;
  apit: number;
  totalDeductions: number;
  netSalary: number;
  totalEmployerCost: number;
}

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const { basicSalary, allowances, bonuses, employmentStatus } = input;

  // 1. Calculate Gross Salary (for tax purposes, usually includes fixed allowances)
  // Note: EPF is usually calculated on Basic + Fixed Allowances. 
  // For simplicity here, we'll assume 'allowances' are fixed and 'bonuses' are not for EPF, 
  // but both are taxable.
  // Adjust based on specific company policy if needed. 
  // Standard practice: EPF on Basic + Budgetary Relief Allowance. 
  // We will calculate EPF on Basic Salary only for this implementation unless specified otherwise.
  
  const grossSalary = basicSalary + allowances + bonuses;

  // 2. EPF & ETF Calculation
  // EPF Employee: 8% of Basic
  // EPF Employer: 12% of Basic
  // ETF Employer: 3% of Basic
  // Interns might be exempt depending on contract, but usually liable if they are employees.
  // We'll assume Interns are NOT liable for EPF/ETF for this specific calculator toggle in UI
  // The UI passes "INTERN" if the checkbox is unchecked.

  let employeeEPF = 0;
  let employerEPF = 0;
  let employerETF = 0;

  if (employmentStatus !== "INTERN") {
    employeeEPF = basicSalary * 0.08;
    employerEPF = basicSalary * 0.12;
    employerETF = basicSalary * 0.03;
  }

  // 3. APIT (Advance Personal Income Tax) Calculation
  // Taxable Income = Gross Salary - (Exemptions)
  // We'll assume Gross Salary is fully taxable for simplicity.
  // 2024/2025 Monthly Tax Slabs:
  // 0 - 100,000: 0%
  // 100,001 - 141,667: 6%
  // 141,668 - 183,334: 12%
  // 183,335 - 225,000: 18%
  // 225,001 - 266,667: 24%
  // 266,668 - 308,334: 30%
  // Above 308,334: 36%

  let apit = 0;
  let taxableIncome = grossSalary; // Can deduct relief if applicable, but standard APIT is on gross

  if (taxableIncome > 100000) {
    let remainingIncome = taxableIncome - 100000;
    const slabSize = 41667; // 500,000 / 12

    // Slab 1: 6%
    if (remainingIncome > 0) {
      const taxableAmount = Math.min(remainingIncome, slabSize);
      apit += taxableAmount * 0.06;
      remainingIncome -= taxableAmount;
    }

    // Slab 2: 12%
    if (remainingIncome > 0) {
      const taxableAmount = Math.min(remainingIncome, slabSize);
      apit += taxableAmount * 0.12;
      remainingIncome -= taxableAmount;
    }

    // Slab 3: 18%
    if (remainingIncome > 0) {
      const taxableAmount = Math.min(remainingIncome, slabSize);
      apit += taxableAmount * 0.18;
      remainingIncome -= taxableAmount;
    }

    // Slab 4: 24%
    if (remainingIncome > 0) {
      const taxableAmount = Math.min(remainingIncome, slabSize);
      apit += taxableAmount * 0.24;
      remainingIncome -= taxableAmount;
    }

    // Slab 5: 30%
    if (remainingIncome > 0) {
      const taxableAmount = Math.min(remainingIncome, slabSize);
      apit += taxableAmount * 0.30;
      remainingIncome -= taxableAmount;
    }

    // Slab 6: 36% (Balance)
    if (remainingIncome > 0) {
      apit += remainingIncome * 0.36;
    }
  }

  // 4. Final Totals
  const totalDeductions = employeeEPF + apit;
  const netSalary = grossSalary - totalDeductions;
  const totalEmployerCost = grossSalary + employerEPF + employerETF; // Cost to company

  return {
    grossSalary,
    basicSalary,
    allowances,
    bonuses,
    employeeEPF,
    employerEPF,
    employerETF,
    apit,
    totalDeductions,
    netSalary,
    totalEmployerCost
  };
}

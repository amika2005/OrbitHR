/**
 * Tax Calculation Utilities for OrbitHR Payroll System
 * Supports progressive tax slabs, EPF, ETF, and various deductions
 */

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

export interface SalaryComponents {
  basicSalary: number;
  hra: number;
  transportAllowance: number;
  medicalAllowance: number;
  specialAllowance: number;
  bonus?: number;
  overtime?: number;
}

export interface Deductions {
  epf: number;
  etf: number;
  incomeTax: number;
  professionalTax: number;
  loan?: number;
  advance?: number;
  other?: number;
}

export interface PayrollCalculation {
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  earnings: SalaryComponents;
  deductions: Deductions;
}

// Default tax slabs (configurable per company)
export const DEFAULT_TAX_SLABS: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 0.05 },
  { min: 500001, max: 1000000, rate: 0.10 },
  { min: 1000001, max: 1500000, rate: 0.15 },
  { min: 1500001, max: null, rate: 0.20 },
];

/**
 * Calculate progressive income tax based on annual salary
 */
export function calculateIncomeTax(
  annualSalary: number,
  taxSlabs: TaxSlab[] = DEFAULT_TAX_SLABS
): number {
  let tax = 0;

  for (const slab of taxSlabs) {
    if (annualSalary <= slab.min) break;

    const taxableAmount = slab.max
      ? Math.min(annualSalary, slab.max) - slab.min + 1
      : annualSalary - slab.min;

    tax += taxableAmount * slab.rate;
  }

  return Math.round(tax);
}

/**
 * Calculate EPF (Employee Provident Fund) - 12% of basic salary
 */
export function calculateEPF(basicSalary: number): number {
  return Math.round(basicSalary * 0.12);
}

/**
 * Calculate ETF (Employees' Trust Fund) - 3% of basic salary (employer contribution)
 */
export function calculateETF(basicSalary: number): number {
  return Math.round(basicSalary * 0.03);
}

/**
 * Calculate professional tax (state-specific, using default slab)
 */
export function calculateProfessionalTax(monthlySalary: number): number {
  if (monthlySalary <= 15000) return 0;
  if (monthlySalary <= 20000) return 150;
  if (monthlySalary <= 25000) return 200;
  return 250;
}

/**
 * Calculate HRA (House Rent Allowance) - typically 40-50% of basic
 */
export function calculateHRA(basicSalary: number, percentage: number = 0.4): number {
  return Math.round(basicSalary * percentage);
}

/**
 * Calculate gross salary from components
 */
export function calculateGrossSalary(components: SalaryComponents): number {
  return (
    components.basicSalary +
    components.hra +
    components.transportAllowance +
    components.medicalAllowance +
    components.specialAllowance +
    (components.bonus || 0) +
    (components.overtime || 0)
  );
}

/**
 * Calculate total deductions
 */
export function calculateTotalDeductions(deductions: Deductions): number {
  return (
    deductions.epf +
    deductions.etf +
    deductions.incomeTax +
    deductions.professionalTax +
    (deductions.loan || 0) +
    (deductions.advance || 0) +
    (deductions.other || 0)
  );
}

/**
 * Complete payroll calculation for an employee
 */
export function calculatePayroll(
  components: SalaryComponents,
  options: {
    taxSlabs?: TaxSlab[];
    loanDeduction?: number;
    advanceDeduction?: number;
    otherDeductions?: number;
  } = {}
): PayrollCalculation {
  const grossSalary = calculateGrossSalary(components);
  const annualSalary = components.basicSalary * 12;

  // Calculate deductions
  const epf = calculateEPF(components.basicSalary);
  const etf = calculateETF(components.basicSalary);
  const annualTax = calculateIncomeTax(annualSalary, options.taxSlabs);
  const monthlyTax = Math.round(annualTax / 12);
  const professionalTax = calculateProfessionalTax(grossSalary);

  const deductions: Deductions = {
    epf,
    etf,
    incomeTax: monthlyTax,
    professionalTax,
    loan: options.loanDeduction || 0,
    advance: options.advanceDeduction || 0,
    other: options.otherDeductions || 0,
  };

  const totalDeductions = calculateTotalDeductions(deductions);
  const netSalary = grossSalary - totalDeductions;

  return {
    grossSalary,
    totalEarnings: grossSalary,
    totalDeductions,
    netSalary,
    earnings: components,
    deductions,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  const currencySymbols: Record<string, string> = {
    USD: "$",
    LKR: "Rs.",
    JPY: "¥",
    EUR: "€",
    GBP: "£",
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

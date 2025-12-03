"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Eye, Settings, X } from "lucide-react";
import { generatePayslipPDF } from "@/lib/payslip-generator";

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Step 1: Information
  employeeId: string;
  epfNumber: string;
  fullName: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  companyName: string;
  month: number;
  year: number;
  
  // Step 2: Basic Salary
  basicSalary: number;
  includeEPF: boolean;
  
  // Step 3: Allowances (matching Payroll structure)
  hasAllowances: boolean;
  operational: number;
  wellBeing: number;
  utilityTravel: number;
  salesCommission: number;
  otherAllowance: number;
  
  // Step 4: Deductions (matching Payroll structure)
  hasDeductions: boolean;
  apit: number;
  unpaidLeave: number;
  lateAttendance: number;
  otherDeduction: number;
  
  // Commission
  commission: number;
  
  // Bank Details (optional)
  bankName: string;
  branch: string;
  accountNumber: string;
}

interface CompanySettings {
  logo: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
}

export default function SalarySlipGeneratorPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    logo: "",
    companyName: "OrbitHR Inc.",
    address: "123 Business Rd, Tech City",
    phone: "",
    email: "",
  });
  
  const currentDate = new Date();
  const [formData, setFormData] = useState<FormData>({
    employeeId: "",
    epfNumber: "",
    fullName: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    companyName: "OrbitHR Inc.",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    basicSalary: 0,
    includeEPF: true,
    hasAllowances: false,
    operational: 0,
    wellBeing: 0,
    utilityTravel: 0,
    salesCommission: 0,
    otherAllowance: 0,
    hasDeductions: false,
    apit: 0,
    unpaidLeave: 0,
    lateAttendance: 0,
    otherDeduction: 0,
    commission: 0,
    bankName: "",
    branch: "",
    accountNumber: "",
  });

  // Load company settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('orbithr_company_settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setCompanySettings(settings);
      setFormData(prev => ({ ...prev, companyName: settings.companyName }));
    }
  }, []);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const isStepComplete = (step: Step): boolean => {
    return step < currentStep;
  };

  // Calculate EPF
  const calculateEPF = (basicSalary: number) => {
    return formData.includeEPF ? basicSalary * 0.08 : 0;
  };

  const calculateEPFEmployer = (basicSalary: number) => {
    return formData.includeEPF ? basicSalary * 0.12 : 0;
  };

  const calculateETF = (basicSalary: number) => {
    return formData.includeEPF ? basicSalary * 0.03 : 0;
  };

  // Calculate totals
  const totalAllowances = formData.operational + formData.wellBeing + formData.utilityTravel + formData.salesCommission + formData.otherAllowance;
  const totalDeductions = formData.apit + formData.unpaidLeave + formData.lateAttendance + formData.otherDeduction;
  const epf = calculateEPF(formData.basicSalary);
  const netSalary = formData.basicSalary + totalAllowances + formData.commission - epf - totalDeductions;

  const handleDownload = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    try {
      const pdfDataUrl = generatePayslipPDF({
        employeeName: formData.fullName,
        employeeId: formData.employeeId,
        epfNumber: formData.epfNumber,
        designation: formData.designation,
        department: formData.department,
        dateOfJoining: formData.dateOfJoining,
        payPeriod: `${monthNames[formData.month - 1]} ${formData.year}`,
        workedDays: 30,
        basicSalary: formData.basicSalary,
        allowances: {
          operational: formData.operational,
          wellBeing: formData.wellBeing,
          utilityTravel: formData.utilityTravel,
          salesCommission: formData.salesCommission,
          other: formData.otherAllowance,
        },
        deductions: {
          apit: formData.apit,
          unpaidLeave: formData.unpaidLeave,
          lateAttendance: formData.lateAttendance,
          other: formData.otherDeduction,
        },
        commission: formData.commission,
        epf,
        epfEmployer: calculateEPFEmployer(formData.basicSalary),
        etf: calculateETF(formData.basicSalary),
        netPay: netSalary,
        bankName: formData.bankName,
        branch: formData.branch,
        accountNumber: formData.accountNumber,
        companyName: companySettings.companyName,
        companyAddress: companySettings.address,
        companyLogo: companySettings.logo,
      });

      // Create download link
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `Salary_Slip_${formData.fullName.replace(/\s+/g, '_')}_${monthNames[formData.month - 1]}_${formData.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate salary slip. Please try again.');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newSettings = { ...companySettings, logo: reader.result as string };
      setCompanySettings(newSettings);
      localStorage.setItem('orbithr_company_settings', JSON.stringify(newSettings));
    };
    reader.readAsDataURL(file);
  };

  const saveCompanySettings = () => {
    localStorage.setItem('orbithr_company_settings', JSON.stringify(companySettings));
    setFormData(prev => ({ ...prev, companyName: companySettings.companyName }));
    setShowSettingsModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 p-8">
      {/* Settings Button */}
      <button
        onClick={() => setShowSettingsModal(true)}
        className="fixed top-20 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white shadow-lg transition-all"
      >
        <Settings className="w-5 h-5" />
        <span className="font-medium">Customize</span>
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Salary Slip Generator
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Generate Professional Salary Slips with Deductions
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      isStepComplete(step as Step)
                        ? "bg-zinc-900 dark:bg-zinc-700 text-white"
                        : currentStep === step
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {isStepComplete(step as Step) ? <Check className="w-6 h-6" /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        isStepComplete((step + 1) as Step) ? "bg-zinc-900 dark:bg-zinc-700" : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                    />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep === step ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {step === 1 && "Info"}
                  {step === 2 && "Salary"}
                  {step === 3 && "Allowances"}
                  {step === 4 && "Deductions"}
                  {step === 5 && "Result"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8">
          {/* Step 1: Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white text-center mb-6">
                Employee Information
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    EPF Number
                  </label>
                  <input
                    type="text"
                    value={formData.epfNumber}
                    onChange={(e) => updateFormData("epfNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                    placeholder="EPF-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => updateFormData("employeeId", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                    placeholder="EMP-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => updateFormData("designation", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => updateFormData("department", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                    placeholder="Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => updateFormData("dateOfJoining", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.month}
                    onChange={(e) => updateFormData("month", parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, idx) => (
                      <option key={month} value={idx + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Bank Details (Optional)</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => updateFormData("bankName", e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                      placeholder="Bank of Ceylon"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) => updateFormData("branch", e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                      placeholder="Colombo"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => updateFormData("accountNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Salary */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Basic Salary
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Enter the employee's basic monthly salary
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Basic Salary <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">LKR</span>
                  <input
                    type="number"
                    value={formData.basicSalary || ""}
                    onChange={(e) => updateFormData("basicSalary", parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-800 dark:text-white text-lg"
                    placeholder="50000"
                  />
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeEPF}
                    onChange={(e) => updateFormData("includeEPF", e.target.checked)}
                    className="w-5 h-5 text-orange-500 border-zinc-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-zinc-900 dark:text-white font-medium">Include EPF/ETF Deductions</span>
                </label>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Allowances */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Allowances
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Add any extra payments or allowances
                </p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => updateFormData("hasAllowances", false)}
                  className={`px-12 py-4 rounded-lg font-medium transition-all ${
                    !formData.hasAllowances
                      ? "bg-zinc-900 text-white"
                      : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() => updateFormData("hasAllowances", true)}
                  className={`px-12 py-4 rounded-lg font-medium transition-all ${
                    formData.hasAllowances
                      ? "bg-zinc-900 text-white"
                      : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Yes
                </button>
              </div>

              {formData.hasAllowances && (
                <div className="grid grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Operational
                    </label>
                    <input
                      type="number"
                      value={formData.operational || ""}
                      onChange={(e) => updateFormData("operational", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Well-being
                    </label>
                    <input
                      type="number"
                      value={formData.wellBeing || ""}
                      onChange={(e) => updateFormData("wellBeing", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Utility/Travel
                    </label>
                    <input
                      type="number"
                      value={formData.utilityTravel || ""}
                      onChange={(e) => updateFormData("utilityTravel", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Sales Commission
                    </label>
                    <input
                      type="number"
                      value={formData.salesCommission || ""}
                      onChange={(e) => updateFormData("salesCommission", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Other
                    </label>
                    <input
                      type="number"
                      value={formData.otherAllowance || ""}
                      onChange={(e) => updateFormData("otherAllowance", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Commission
                    </label>
                    <input
                      type="number"
                      value={formData.commission || ""}
                      onChange={(e) => updateFormData("commission", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Deductions */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Manual Deductions
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Add any manual deductions (EPF is auto-calculated)
                </p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => updateFormData("hasDeductions", false)}
                  className={`px-12 py-4 rounded-lg font-medium transition-all ${
                    !formData.hasDeductions
                      ? "bg-zinc-900 text-white"
                      : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  No
                </button>
                <button
                  onClick={() => updateFormData("hasDeductions", true)}
                  className={`px-12 py-4 rounded-lg font-medium transition-all ${
                    formData.hasDeductions
                      ? "bg-zinc-900 text-white"
                      : "bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  Yes
                </button>
              </div>

              {formData.hasDeductions && (
                <div className="grid grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      APIT
                    </label>
                    <input
                      type="number"
                      value={formData.apit || ""}
                      onChange={(e) => updateFormData("apit", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Unpaid Leave
                    </label>
                    <input
                      type="number"
                      value={formData.unpaidLeave || ""}
                      onChange={(e) => updateFormData("unpaidLeave", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Late Attendance
                    </label>
                    <input
                      type="number"
                      value={formData.lateAttendance || ""}
                      onChange={(e) => updateFormData("lateAttendance", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Other Deductions
                    </label>
                    <input
                      type="number"
                      value={formData.otherDeduction || ""}
                      onChange={(e) => updateFormData("otherDeduction", parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-zinc-700 dark:text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Result */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Salary Slip Ready!
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Review the summary and download your salary slip
                </p>
              </div>

              {/* Summary */}
              <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-700 dark:text-zinc-300">Basic Salary:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">LKR {formData.basicSalary.toLocaleString()}</span>
                </div>
                {totalAllowances > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300">Total Allowances:</span>
                    <span className="font-bold text-green-600">+LKR {totalAllowances.toLocaleString()}</span>
                  </div>
                )}
                {formData.commission > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300">Commission:</span>
                    <span className="font-bold text-green-600">+LKR {formData.commission.toLocaleString()}</span>
                  </div>
                )}
                {epf > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300">EPF (8%):</span>
                    <span className="font-bold text-red-600">-LKR {epf.toLocaleString()}</span>
                  </div>
                )}
                {totalDeductions > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300">Manual Deductions:</span>
                    <span className="font-bold text-red-600">-LKR {totalDeductions.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-zinc-300 dark:border-zinc-600 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">Net Salary:</span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">LKR {netSalary.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Salary Slip
                </button>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFormData({
                      employeeId: "",
                      epfNumber: "",
                      fullName: "",
                      designation: "",
                      department: "",
                      dateOfJoining: "",
                      companyName: companySettings.companyName,
                      month: new Date().getMonth() + 1,
                      year: new Date().getFullYear(),
                      basicSalary: 0,
                      includeEPF: true,
                      hasAllowances: false,
                      operational: 0,
                      wellBeing: 0,
                      utilityTravel: 0,
                      salesCommission: 0,
                      otherAllowance: 0,
                      hasDeductions: false,
                      apit: 0,
                      unpaidLeave: 0,
                      lateAttendance: 0,
                      otherDeduction: 0,
                      commission: 0,
                      bankName: "",
                      branch: "",
                      accountNumber: "",
                    });
                  }}
                  className="px-8 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  Create New
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Company Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Company Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg dark:bg-zinc-800 dark:text-white"
                />
                {companySettings.logo && (
                  <img src={companySettings.logo} alt="Logo" className="mt-2 h-16 object-contain" />
                )}
              </div>

              <button
                onClick={saveCompanySettings}
                className="w-full px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

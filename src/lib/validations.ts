import { z } from 'zod';
import { Country, Currency, JobStatus, ApplicationStatus } from '@prisma/client';

// ========================================
// JOB VALIDATION SCHEMAS
// ========================================

export const CreateJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
  country: z.nativeEnum(Country),
  location: z.string().min(2, 'Location is required'),
  salaryMin: z.number().positive('Minimum salary must be positive'),
  salaryMax: z.number().positive('Maximum salary must be positive'),
  currency: z.nativeEnum(Currency),
  department: z.string().min(2, 'Department is required'),
  employmentType: z.string().min(2, 'Employment type is required'),
  keySkills: z.array(z.string()).min(1, 'At least one skill is required').max(20),
  screeningTemplateId: z.string().optional(),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['salaryMax'],
});

export const UpdateJobSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100).optional(),
  description: z.string().min(50, 'Description must be at least 50 characters').optional(),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters').optional(),
  country: z.nativeEnum(Country).optional(),
  location: z.string().min(2, 'Location is required').optional(),
  salaryMin: z.number().positive('Minimum salary must be positive').optional(),
  salaryMax: z.number().positive('Maximum salary must be positive').optional(),
  currency: z.nativeEnum(Currency).optional(),
  department: z.string().min(2, 'Department is required').optional(),
  employmentType: z.string().min(2, 'Employment type is required').optional(),
  keySkills: z.array(z.string()).min(1, 'At least one skill is required').max(20).optional(),
  screeningTemplateId: z.string().optional(),
  status: z.nativeEnum(JobStatus).optional(),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;

// ========================================
// APPLICATION VALIDATION SCHEMAS
// ========================================

export const CreateApplicationSchema = z.object({
  jobId: z.string().cuid('Invalid job ID'),
  candidateId: z.string().cuid('Invalid candidate ID'),
  resumeFile: z.instanceof(File, { message: 'Resume file is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => file.type === 'application/pdf',
      'Only PDF files are allowed'
    ),
  coverLetter: z.string().max(2000, 'Cover letter must be less than 2000 characters').optional(),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
});

export const ScheduleInterviewSchema = z.object({
  applicationId: z.string().cuid(),
  interviewDate: z.date().min(new Date(), 'Interview date must be in the future'),
  interviewNotes: z.string().max(500).optional(),
});

export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type ScheduleInterviewInput = z.infer<typeof ScheduleInterviewSchema>;

// ========================================
// EMPLOYEE VALIDATION SCHEMAS
// ========================================

export const CreateEmployeeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  employeeId: z.string().min(1, 'Employee ID is required').max(20),
  department: z.string().min(2, 'Department is required'),
  position: z.string().min(2, 'Position is required'),
  hireDate: z.date(),
  salary: z.number().positive('Salary must be positive'),
});

export const UpdateEmployeeSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email('Invalid email address').optional(),
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
  employeeId: z.string().min(1, 'Employee ID is required').max(20).optional(),
  department: z.string().min(2, 'Department is required').optional(),
  position: z.string().min(2, 'Position is required').optional(),
  hireDate: z.date().optional(),
  salary: z.number().positive('Salary must be positive').optional(),
});

export const UpdateSalarySchema = z.object({
  employeeId: z.string().cuid(),
  newSalary: z.number().positive('Salary must be positive'),
  effectiveDate: z.date(),
  reason: z.string().max(500).optional(),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;
export type UpdateSalaryInput = z.infer<typeof UpdateSalarySchema>;

// ========================================
// PAYROLL VALIDATION SCHEMAS
// ========================================

export const GeneratePayrollSchema = z.object({
  month: z.number().int().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.number().int().min(2020).max(2100, 'Invalid year'),
  employeeIds: z.array(z.string().cuid()).optional(), // If empty, generate for all employees
});

export const ApprovePayrollSchema = z.object({
  recordId: z.string().cuid(),
  notes: z.string().max(500).optional(),
});

export type GeneratePayrollInput = z.infer<typeof GeneratePayrollSchema>;
export type ApprovePayrollInput = z.infer<typeof ApprovePayrollSchema>;

// ========================================
// COMPANY VALIDATION SCHEMAS
// ========================================

export const UpdateCompanySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').max(100).optional(),
  country: z.nativeEnum(Country).optional(),
  currency: z.nativeEnum(Currency).optional(),
  taxRules: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
});

export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;

// ========================================
// SCREENING TEMPLATE VALIDATION
// ========================================

export const CreateScreeningTemplateSchema = z.object({
  name: z.string().min(3, 'Template name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['TECHNICAL_FIT', 'CULTURAL_FIT', 'BALANCED', 'CUSTOM']),
  systemPrompt: z.string().min(50, 'System prompt must be at least 50 characters'),
  evaluationCriteria: z.record(z.number()),
  culturalValues: z.array(z.string()).max(10),
  requiredSkillsWeight: z.number().min(0).max(1),
  culturalFitWeight: z.number().min(0).max(1),
  minPassingScore: z.number().int().min(0).max(100),
  autoRejectThreshold: z.number().int().min(0).max(100).optional(),
  isDefault: z.boolean().optional(),
}).refine(
  (data) => Math.abs(data.requiredSkillsWeight + data.culturalFitWeight - 1) < 0.01,
  {
    message: 'Skill weight and cultural fit weight must sum to 1.0',
    path: ['culturalFitWeight'],
  }
);

export type CreateScreeningTemplateInput = z.infer<typeof CreateScreeningTemplateSchema>;

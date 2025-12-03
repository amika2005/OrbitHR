"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ScreeningTemplateType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ========================================
// PREDEFINED TEMPLATES
// ========================================

export const DEFAULT_TEMPLATES = {
  JAPANESE_CULTURE: {
    name: "Japanese Culture Fit",
    type: ScreeningTemplateType.CULTURAL_FIT,
    description: "Emphasizes Japanese workplace values: loyalty, humility, teamwork, long-term commitment",
    systemPrompt: `You are an expert HR recruiter specializing in Japanese workplace culture. Analyze candidates with deep understanding of Japanese business values.

**Key Japanese Cultural Values to Assess:**
- **Long-term Commitment** (終身雇用): Look for career stability, low job-hopping
- **Humility** (謙虚): Avoid over-aggressive self-promotion, value team over individual
- **Attention to Detail** (細部への注意): Quality-focused, thorough, meticulous
- **Harmony** (和): Team collaboration, conflict avoidance, indirect communication
- **Loyalty** (忠誠心): Dedication beyond job description, company-first mentality
- **Continuous Improvement** (改善): Growth mindset, learning orientation`,
    culturalValues: ["Loyalty", "Humility", "Teamwork", "Long-term Commitment", "Attention to Detail", "Harmony"],
    evaluationCriteria: {
      technicalSkills: 35,
      culturalFit: 40,
      communication: 15,
      careerStability: 10
    },
    requiredSkillsWeight: 0.35,
    culturalFitWeight: 0.65, // Higher weight for cultural fit
  },

  TECHNICAL_ONLY: {
    name: "Technical Skills Only",
    type: ScreeningTemplateType.TECHNICAL_FIT,
    description: "Pure technical assessment. No cultural fit analysis. Best for remote/contract roles.",
    systemPrompt: `You are a technical recruiter. Focus ONLY on technical skills, experience, and qualifications. Do not assess cultural fit or soft skills.

**Assessment Focus:**
- **Technical Skills Match**: How well do their skills align with requirements?
- **Experience Level**: Years of relevant experience
- **Project Complexity**: Have they worked on similar projects?
- **Technology Stack**: Proficiency in required technologies
- **Problem-Solving**: Evidence of technical problem-solving ability`,
    culturalValues: [],
    evaluationCriteria: {
      technicalSkills: 80,
      experienceLevel: 20,
    },
    requiredSkillsWeight: 1.0,
    culturalFitWeight: 0.0,
  },

  WESTERN_CULTURE: {
    name: "Western Culture Fit",
    type: ScreeningTemplateType.CULTURAL_FIT,
    description: "Emphasizes Western workplace values: innovation, independence, direct communication",
    systemPrompt: `You are an HR recruiter specializing in Western workplace culture. Analyze candidates for fit with modern Western business values.

**Key Western Cultural Values to Assess:**
- **Innovation** (革新): Creative thinking, challenging status quo
- **Independence**: Self-starter, autonomous work style
- **Direct Communication**: Clear, assertive communication style
- **Results-Oriented**: Focus on outcomes over process
- **Work-Life Balance**: Healthy boundaries, sustainable work habits
- **Diversity & Inclusion**: Open-mindedness, collaborative across differences`,
    culturalValues: ["Innovation", "Independence", "Direct Communication", "Results-Oriented", "Work-Life Balance"],
    evaluationCriteria: {
      technicalSkills: 45,
      culturalFit: 30,
      innovation: 15,
      communication: 10
    },
    requiredSkillsWeight: 0.55,
    culturalFitWeight: 0.45,
  },

  BALANCED: {
    name: "Balanced Assessment",
    type: ScreeningTemplateType.BALANCED,
    description: "Equal weight on technical skills and cultural fit. Universal approach.",
    systemPrompt: `You are an experienced HR recruiter. Provide a balanced assessment of technical skills and cultural fit.

**Assessment Focus:**
- **Technical Competency**: Required skills, experience, qualifications
- **Cultural Alignment**: Teamwork, communication, adaptability
- **Professional Growth**: Learning mindset, career progression
- **Work Ethic**: Reliability, commitment, professionalism`,
    culturalValues: ["Teamwork", "Communication", "Adaptability", "Professionalism"],
    evaluationCriteria: {
      technicalSkills: 50,
      culturalFit: 30,
      communication: 10,
      growth: 10
    },
    requiredSkillsWeight: 0.5,
    culturalFitWeight: 0.5,
  },
};

// ========================================
// CRUD OPERATIONS
// ========================================

export async function createScreeningTemplate(data: {
  name: string;
  description?: string;
  type: ScreeningTemplateType;
  systemPrompt: string;
  evaluationCriteria: Record<string, number>;
  culturalValues: string[];
  requiredSkillsWeight: number;
  culturalFitWeight: number;
  minPassingScore?: number;
  autoRejectThreshold?: number | null;
  isDefault?: boolean;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await db.screeningTemplate.updateMany({
        where: { companyId: user.companyId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await db.screeningTemplate.create({
      data: {
        ...data,
        companyId: user.companyId,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: template };
  } catch (error) {
    console.error("Create Template Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateScreeningTemplate(
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    type: ScreeningTemplateType;
    systemPrompt: string;
    evaluationCriteria: Record<string, number>;
    culturalValues: string[];
    requiredSkillsWeight: number;
    culturalFitWeight: number;
    minPassingScore: number;
    autoRejectThreshold: number | null;
    isDefault: boolean;
    isActive: boolean;
  }>
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Verify template belongs to user's company
    const template = await db.screeningTemplate.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!template || template.companyId !== user.companyId) {
      return { success: false, error: "Template not found" };
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await db.screeningTemplate.updateMany({
        where: { companyId: user.companyId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await db.screeningTemplate.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update Template Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteScreeningTemplate(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    const template = await db.screeningTemplate.findUnique({
      where: { id },
      select: { companyId: true, isDefault: true, _count: { select: { jobs: true } } },
    });

    if (!template || template.companyId !== user.companyId) {
      return { success: false, error: "Template not found" };
    }

    if (template.isDefault) {
      return { success: false, error: "Cannot delete default template. Set another template as default first." };
    }

    if (template._count.jobs > 0) {
      return { success: false, error: `Cannot delete template used by ${template._count.jobs} job(s). Reassign jobs first.` };
    }

    await db.screeningTemplate.delete({ where: { id } });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Delete Template Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getScreeningTemplates() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const templates = await db.screeningTemplate.findMany({
      where: { companyId: user.companyId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { jobs: true },
        },
      },
    });

    return { success: true, data: templates };
  } catch (error) {
    console.error("Get Templates Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function initializeDefaultTemplates() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || !["SUPER_ADMIN", "HR_MANAGER"].includes(user.role)) {
      return { success: false, error: "Insufficient permissions" };
    }

    // Check if templates already exist
    const existingCount = await db.screeningTemplate.count({
      where: { companyId: user.companyId },
    });

    if (existingCount > 0) {
      return { success: false, error: "Templates already initialized" };
    }

    // Create all default templates
    const templates = await Promise.all(
      Object.entries(DEFAULT_TEMPLATES).map(([key, template], index) =>
        db.screeningTemplate.create({
          data: {
            ...template,
            companyId: user.companyId,
            isDefault: key === "BALANCED", // Set Balanced as default
            minPassingScore: 60,
            autoRejectThreshold: null, // No auto-reject by default
          },
        })
      )
    );

    revalidatePath("/dashboard/settings");
    return { success: true, data: templates };
  } catch (error) {
    console.error("Initialize Templates Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

"use server";

import { db } from "@/lib/db";
import { openai } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { ApplicationStatus } from "@prisma/client";

interface ScreeningResult {
  score: number;
  cultureFit: number;
  summary: string;
  missingSkills: string[];
  strengths: string[];
  concerns: string[];
}

function buildScreeningPrompt(
  template: {
    systemPrompt: string;
    culturalValues: string[];
    evaluationCriteria: any;
    requiredSkillsWeight: number;
    culturalFitWeight: number;
  },
  jobDescription: string,
  requirements: string,
  requiredSkills: string[],
  resumeText: string
): string {
  const culturalSection = template.culturalValues.length > 0
    ? `\n**Cultural Values to Assess:**\n${template.culturalValues.map(v => `- ${v}`).join('\n')}\n`
    : '';

  const criteriaSection = Object.entries(template.evaluationCriteria)
    .map(([key, weight]) => `- ${key}: ${weight}%`)
    .join('\n');

  return `${template.systemPrompt}

**Job Description:**
${jobDescription}

**Requirements:**
${requirements}

**Required Skills:**
${requiredSkills.join(', ')}
${culturalSection}
**Resume:**
${resumeText}

**Evaluation Criteria (Weights):**
${criteriaSection}

**Scoring Weights:**
- Technical Skills: ${(template.requiredSkillsWeight * 100).toFixed(0)}%
- Cultural Fit: ${(template.culturalFitWeight * 100).toFixed(0)}%

**Analysis Required:**
1. **Technical Fit (0-100):** How well do their skills match the requirements?
2. **Cultural Fit (0-100):** Based on their career history and presentation style, how well would they fit the cultural values above?
3. **Summary:** 2-3 sentence overview of the candidate.
4. **Missing Skills:** List specific skills from the required skills that are NOT found in the resume.
5. **Strengths:** Top 3 strengths relevant to this role.
6. **Concerns:** Any red flags (gaps in employment, frequent job changes, skill mismatches).

**Output Format (JSON only):**
{
  "score": <number>,
  "cultureFit": <number>,
  "summary": "<string>",
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"]
}

Respond ONLY with valid JSON. No markdown, no explanations.`;
}

export async function screenCandidate(
  applicationId: string,
  resumeText: string
): Promise<{ success: boolean; data?: ScreeningResult; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch application with job details and screening template
    const application = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            title: true,
            description: true,
            requirements: true,
            keySkills: true,
            screeningTemplateId: true,
            screeningTemplate: {
              select: {
                systemPrompt: true,
                culturalValues: true,
                evaluationCriteria: true,
                requiredSkillsWeight: true,
                culturalFitWeight: true,
                minPassingScore: true,
                autoRejectThreshold: true,
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            country: true,
          },
        },
      },
    });

    if (!application) {
      return { success: false, error: "Application not found" };
    }

    // Verify user belongs to same company (multi-tenancy check)
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, role: true },
    });

    if (!user || user.companyId !== application.companyId) {
      return { success: false, error: "Access denied" };
    }

    // Get screening template (use job's template or company default)
    let template = application.job.screeningTemplate;
    
    if (!template) {
      // Fallback to company's default template
      const defaultTemplate = await db.screeningTemplate.findFirst({
        where: {
          companyId: user.companyId!,
          isDefault: true,
        },
        select: {
          systemPrompt: true,
          culturalValues: true,
          evaluationCriteria: true,
          requiredSkillsWeight: true,
          culturalFitWeight: true,
          minPassingScore: true,
          autoRejectThreshold: true,
        },
      });

      if (!defaultTemplate) {
        return {
          success: false,
          error: "No screening template configured. Please set up a template in Settings.",
        };
      }

      template = defaultTemplate;
    }

    // Build the AI prompt using the template
    const prompt = buildScreeningPrompt(
      template,
      `${application.job.title}\n\n${application.job.description}`,
      application.job.requirements,
      application.job.keySkills,
      resumeText
    );

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient model
      messages: [
        {
          role: "system",
          content:
            "You are an expert HR recruiter. Respond only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for consistent scoring
      max_tokens: 1000,
      response_format: { type: "json_object" }, // Enforce JSON response
    });

    const aiOutput = response.choices[0].message.content;
    if (!aiOutput) {
      return { success: false, error: "No response from AI" };
    }

    const result: ScreeningResult = JSON.parse(aiOutput);

    // Validate the result
    if (
      typeof result.score !== "number" ||
      typeof result.cultureFit !== "number"
    ) {
      return { success: false, error: "Invalid AI response format" };
    }

    // Update application with AI screening results
    // CRITICAL: Set status to AI_SCREENED, NOT auto-rejecting
    await db.application.update({
      where: { id: applicationId },
      data: {
        aiScore: Math.round(result.score),
        culturalFitScore: Math.round(result.cultureFit),
        aiSummary: `**Summary:** ${result.summary}\n\n**Strengths:**\n${result.strengths.map((s) => `- ${s}`).join("\n")}\n\n**Concerns:**\n${result.concerns.map((c) => `- ${c}`).join("\n")}`,
        missingSkills: result.missingSkills,
        status: ApplicationStatus.AI_SCREENED, // Hybrid control: Wait for human
        aiProcessedAt: new Date(),
      },
    });

    // TODO: Trigger workflow automation if configured
    // e.g., Send email to HR manager, Slack notification, etc.

    return { success: true, data: result };
  } catch (error) {
    console.error("AI Screening Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Batch screening for multiple candidates
export async function batchScreenCandidates(
  jobId: string
): Promise<{ success: boolean; processed: number; failed: number }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Get all NEW applications for this job
    const applications = await db.application.findMany({
      where: {
        jobId,
        status: ApplicationStatus.NEW,
      },
      select: {
        id: true,
        resumeUrl: true,
      },
    });

    let processed = 0;
    let failed = 0;

    // Process in parallel (be mindful of OpenAI rate limits)
    const results = await Promise.allSettled(
      applications.map(async (app) => {
        // In production, fetch resume text from S3/Supabase Storage
        // For now, assume we have the text
        const resumeText = ""; // TODO: Fetch from storage
        return screenCandidate(app.id, resumeText);
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        processed++;
      } else {
        failed++;
      }
    });

    return { success: true, processed, failed };
  } catch (error) {
    console.error("Batch Screening Error:", error);
    return { success: false, processed: 0, failed: 0 };
  }
}

// Manual override: HR can approve/reject despite AI score
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true, companyId: true },
    });

    if (!user || user.role === "CANDIDATE") {
      return { success: false, error: "Insufficient permissions" };
    }

    const application = await db.application.findUnique({
      where: { id: applicationId },
      select: { companyId: true },
    });

    if (!application || application.companyId !== user.companyId) {
      return { success: false, error: "Access denied" };
    }

    await db.application.update({
      where: { id: applicationId },
      data: {
        status,
        manualNotes: notes,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Update Status Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

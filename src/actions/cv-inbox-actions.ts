"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { parseCV } from "@/lib/cv-parser";
import { analyzeWithRetry } from "@/lib/ai/cv-scorer";
import { ApplicationStatus } from "@prisma/client";

export async function processCVInbox(cvInboxId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const cvInbox = await prisma.cVInbox.findUnique({
      where: { id: cvInboxId },
      include: { job: true },
    });

    if (!cvInbox) {
      return { success: false, error: "CV not found" };
    }

    // Download CV file from URL (assuming it's already uploaded)
    const response = await fetch(cvInbox.fileUrl);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Parse CV
    const parsed = await parseCV(buffer, cvInbox.fileType);

    // Analyze with AI
    const jobRequirements = cvInbox.job?.requirements || undefined;
    const analysis = await analyzeWithRetry(parsed.text, jobRequirements);

    // Update CV inbox with parsed data and AI analysis
    const updated = await prisma.cVInbox.update({
      where: { id: cvInboxId },
      data: {
        parsedText: parsed.text,
        candidateName: analysis.extractedData.name || parsed.candidateName,
        candidateEmail: analysis.extractedData.email || parsed.candidateEmail,
        candidatePhone: analysis.extractedData.phone || parsed.candidatePhone,
        skills: analysis.extractedData.skills,
        experience: analysis.extractedData.experience,
        education: analysis.extractedData.education,
        aiScore: analysis.score,
        aiAnalysis: analysis as any,
        status: ApplicationStatus.AI_SCREENED,
        processedAt: new Date(),
      },
    });

    return { success: true, cvInbox: updated, analysis };
  } catch (error) {
    console.error("Error processing CV:", error);
    return { success: false, error: "Failed to process CV" };
  }
}

export async function getCVInboxList() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const cvInboxes = await prisma.cVInbox.findMany({
      orderBy: { receivedAt: "desc" },
      include: {
        job: {
          select: {
            title: true,
          },
        },
      },
      take: 100,
    });

    return { success: true, cvInboxes };
  } catch (error) {
    console.error("Error fetching CV inbox:", error);
    return { success: false, error: "Failed to fetch CV inbox" };
  }
}

export async function routeCVToPipeline(cvInboxId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const cvInbox = await prisma.cVInbox.findUnique({
      where: { id: cvInboxId },
    });

    if (!cvInbox || !cvInbox.jobId) {
      return { success: false, error: "CV or job not found" };
    }

    // Create candidate user if doesn't exist
    let candidate = await prisma.user.findUnique({
      where: { email: cvInbox.candidateEmail! },
    });

    if (!candidate) {
      // Get company from job
      const job = await prisma.job.findUnique({
        where: { id: cvInbox.jobId },
      });

      if (!job) {
        return { success: false, error: "Job not found" };
      }

      candidate = await prisma.user.create({
        data: {
          email: cvInbox.candidateEmail!,
          firstName: cvInbox.candidateName?.split(" ")[0] || "Unknown",
          lastName: cvInbox.candidateName?.split(" ").slice(1).join(" ") || "",
          role: "CANDIDATE",
          companyId: job.companyId,
        },
      });
    }

    // Get job to retrieve companyId
    const job = await prisma.job.findUnique({
      where: { id: cvInbox.jobId },
      select: { companyId: true },
    });

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: cvInbox.jobId,
        resumeUrl: cvInbox.fileUrl,
        aiScore: cvInbox.aiScore,
        aiSummary: JSON.stringify(cvInbox.aiAnalysis),
        status: ApplicationStatus.AI_SCREENED,
        companyId: job.companyId,
      },
    });

    // Update CV inbox
    await prisma.cVInbox.update({
      where: { id: cvInboxId },
      data: {
        routedToPipeline: true,
        applicationId: application.id,
      },
    });

    return { success: true, application };
  } catch (error) {
    console.error("Error routing CV to pipeline:", error);
    return { success: false, error: "Failed to route CV to pipeline" };
  }
}

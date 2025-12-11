import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, JobStatus, Country } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // Get data from N8N
    const data = await request.json();

    console.log("📧 Received CV from N8N:", data);

    // Create candidate user if doesn't exist
    let candidate = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!candidate) {
      // Get first company (or you can make this dynamic)
      const company = await prisma.company.findFirst();
      
      if (!company) {
        return NextResponse.json({ 
          success: false, 
          error: "No company found" 
        });
      }

      candidate = await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.name?.split(" ")[0] || "Unknown",
          lastName: data.name?.split(" ").slice(1).join(" ") || "",
          role: "CANDIDATE",
          companyId: company.id,
          contactNumber: data.phone || null,
        },
      });
    }

    // Find or create job based on department
    let job = await prisma.job.findFirst({
      where: {
        department: data.department || "Other",
        status: JobStatus.OPEN,
      },
    });

    // If no job found, create a general one
    if (!job) {
      const company = await prisma.company.findFirst();
      
      job = await prisma.job.create({
        data: {
          title: `${data.department || "General"} Position`,
          description: "General application",
          requirements: "As per CV",
          country: Country.SRI_LANKA,
          location: "Colombo",
          salaryMin: 0,
          salaryMax: 0,
          currency: "LKR",
          department: data.department || "Other",
          employmentType: "Full-time",
          status: JobStatus.OPEN,
          companyId: company!.id,
          keySkills: data.tech_skills?.split(",").map((s: string) => s.trim()) || [],
        },
      });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: job.id,
        resumeUrl: data.cv_url || "#", // You can add CV URL from N8N
        aiScore: Math.round(parseFloat(data.score) * 10), // Convert 1-10 to 0-100
        aiSummary: data.hr_summary,
        status: ApplicationStatus.AI_SCREENED,
        companyId: job.companyId,
        missingSkills: [],
      },
    });

    // Store in CV inbox for tracking
    await prisma.cVInbox.create({
      data: {
        emailFrom: data.email,
        emailSubject: `Application from ${data.name}`,
        receivedAt: new Date(),
        fileName: "cv.pdf",
        fileUrl: data.cv_url || "#",
        fileType: "pdf",
        fileSize: 0,
        parsedText: data.hr_summary,
        candidateName: data.name,
        candidateEmail: data.email,
        candidatePhone: data.phone,
        skills: data.tech_skills?.split(",").map((s: string) => s.trim()) || [],
        experience: data.experience?.toString() || null,
        education: data.education,
        aiScore: Math.round(parseFloat(data.score) * 10),
        aiAnalysis: data,
        status: ApplicationStatus.AI_SCREENED,
        routedToPipeline: true,
        applicationId: application.id,
        jobId: job.id,
        processedAt: new Date(),
      },
    });

    console.log("✅ Created application:", application.id);

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      candidateId: candidate.id,
      message: "CV processed and added to pipeline",
    });
  } catch (error) {
    console.error("❌ Error processing N8N webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

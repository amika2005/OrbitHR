"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSurvey(data: {
  title: string;
  description?: string;
  questions: any[];
  targetType: string;
  targetValue?: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const survey = await prisma.survey.create({
      data: {
        title: data.title,
        description: data.description,
        questions: data.questions,
        targetType: data.targetType,
        targetValue: data.targetValue,
        status: "draft",
        createdBy: userId,
      },
    });

    revalidatePath("/dashboard/retain/surveys");
    return { success: true, survey };
  } catch (error) {
    console.error("Error creating survey:", error);
    return { success: false, error: "Failed to create survey" };
  }
}

export async function getSurveys() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const surveys = await prisma.survey.findMany({
      where: { createdBy: userId },
      include: {
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, surveys };
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return { success: false, error: "Failed to fetch surveys" };
  }
}

export async function getSurvey(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        responses: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!survey || survey.createdBy !== userId) {
      return { success: false, error: "Survey not found" };
    }

    return { success: true, survey };
  } catch (error) {
    console.error("Error fetching survey:", error);
    return { success: false, error: "Failed to fetch survey" };
  }
}

export async function updateSurvey(
  id: string,
  data: {
    title?: string;
    description?: string;
    questions?: any[];
    targetType?: string;
    targetValue?: string;
  }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
    });

    if (!survey || survey.createdBy !== userId) {
      return { success: false, error: "Survey not found" };
    }

    const updated = await prisma.survey.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/retain/surveys");
    return { success: true, survey: updated };
  } catch (error) {
    console.error("Error updating survey:", error);
    return { success: false, error: "Failed to update survey" };
  }
}

export async function launchSurvey(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
    });

    if (!survey || survey.createdBy !== userId) {
      return { success: false, error: "Survey not found" };
    }

    const updated = await prisma.survey.update({
      where: { id },
      data: { status: "active" },
    });

    revalidatePath("/dashboard/retain/surveys");
    
    // Generate public link
    const publicLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/survey/${updated.shareToken}`;
    
    return { success: true, survey: updated, publicLink };
  } catch (error) {
    console.error("Error launching survey:", error);
    return { success: false, error: "Failed to launch survey" };
  }
}

export async function deleteSurvey(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
    });

    if (!survey || survey.createdBy !== userId) {
      return { success: false, error: "Survey not found" };
    }

    await prisma.survey.delete({
      where: { id },
    });

    revalidatePath("/dashboard/retain/surveys");
    return { success: true };
  } catch (error) {
    console.error("Error deleting survey:", error);
    return { success: false, error: "Failed to delete survey" };
  }
}

// Public survey access (no auth required)
export async function getPublicSurvey(token: string) {
  try {
    const survey = await prisma.survey.findUnique({
      where: { shareToken: token },
      select: {
        id: true,
        title: true,
        description: true,
        questions: true,
        status: true,
        closesAt: true,
      },
    });

    if (!survey) {
      return { success: false, error: "Survey not found" };
    }

    if (survey.status !== "active") {
      return { success: false, error: "Survey is not active" };
    }

    if (survey.closesAt && new Date(survey.closesAt) < new Date()) {
      return { success: false, error: "Survey has closed" };
    }

    return { success: true, survey };
  } catch (error) {
    console.error("Error fetching public survey:", error);
    return { success: false, error: "Failed to fetch survey" };
  }
}

export async function submitSurveyResponse(
  token: string,
  data: {
    answers: any[];
    respondent?: string;
    respondentName?: string;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  try {
    const survey = await prisma.survey.findUnique({
      where: { shareToken: token },
    });

    if (!survey) {
      return { success: false, error: "Survey not found" };
    }

    if (survey.status !== "active") {
      return { success: false, error: "Survey is not active" };
    }

    if (survey.closesAt && new Date(survey.closesAt) < new Date()) {
      return { success: false, error: "Survey has closed" };
    }

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId: survey.id,
        answers: data.answers,
        respondent: data.respondent,
        respondentName: data.respondentName,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });

    return { success: true, response };
  } catch (error) {
    console.error("Error submitting survey response:", error);
    return { success: false, error: "Failed to submit response" };
  }
}

export async function getSurveyAnalytics(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        responses: true,
      },
    });

    if (!survey || survey.createdBy !== userId) {
      return { success: false, error: "Survey not found" };
    }

    // Calculate analytics
    const totalResponses = survey.responses.length;
    const questions = survey.questions as any[];
    
    const analytics = {
      totalResponses,
      responseRate: 0, // Calculate based on target audience
      questionAnalytics: questions.map((q) => {
        const answers = survey.responses.map((r: any) => {
          const answer = (r.answers as any[]).find((a: any) => a.questionId === q.id);
          return answer?.answer;
        }).filter(Boolean);

        return {
          questionId: q.id,
          questionText: q.text,
          questionType: q.type,
          totalAnswers: answers.length,
          answers,
        };
      }),
    };

    return { success: true, analytics };
  } catch (error) {
    console.error("Error fetching survey analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

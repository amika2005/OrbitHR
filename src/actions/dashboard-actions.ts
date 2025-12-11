"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardStats() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, firstName: true },
    });

    if (!user || !user.companyId) {
      return { success: false, error: "User not found or no company assigned" };
    }

    const companyId = user.companyId;

    // Fetch counts
    const [
      candidatesCount,
      activeJobsCount,
      employeesCount,
      recentCandidates
    ] = await Promise.all([
      // Candidates (Applications)
      db.application.count({
        where: { companyId },
      }),
      // Active Jobs
      db.job.count({
        where: { companyId, status: "OPEN" },
      }),
      // Employees
      db.user.count({
        where: { companyId, role: "EMPLOYEE" },
      }),
      // Recent Candidates
      db.application.findMany({
        where: { companyId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          candidate: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              imageUrl: true,
            }
          },
          job: {
            select: {
              title: true,
            }
          }
        }
      })
    ]);

    // Calculate mock growth for now (or implement real historical data comparison later)
    // For fresh dashboard, we'll just show current numbers.

    return {
      success: true,
      data: {
        stats: {
          candidates: candidatesCount,
          activeJobs: activeJobsCount,
          employees: employeesCount,
        },
        recentCandidates: recentCandidates.map(app => ({
          id: app.id,
          name: `${app.candidate.firstName} ${app.candidate.lastName}`,
          email: app.candidate.email,
          position: app.job.title,
          appliedAt: app.createdAt,
          status: app.status,
          avatar: app.candidate.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${app.candidate.firstName}`,
        })),
        userName: user.firstName,
      }
    };

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

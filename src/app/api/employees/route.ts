import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all employees for the current company
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the current user (HR Manager)
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { companyId: true, id: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all users from the same company (exclude candidates)
    const employees = await prisma.user.findMany({
      where: {
        companyId: currentUser.companyId,
        id: {
          not: currentUser.id, // Exclude current user
        },
        role: {
          not: "CANDIDATE", // Fetch all users except candidates
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true,
        department: true,
        imageUrl: true,
        epfNumber: true,
        employeeId: true,
        hireDate: true,
        bankName: true,
        branch: true,
        accountNumber: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

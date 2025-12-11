import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await req.json();

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get leave request
    const leaveRequest = await db.leaveRequest.findUnique({
      where: { id: requestId },
    });

    if (!leaveRequest) {
      return NextResponse.json({ success: false, error: "Leave request not found" }, { status: 404 });
    }

    // Check if user owns this request
    if (leaveRequest.employeeId !== user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // Check if request is pending
    if (leaveRequest.status !== "PENDING") {
      return NextResponse.json(
        { success: false, error: "Only pending requests can be cancelled" },
        { status: 400 }
      );
    }

    // Update status to cancelled
    await db.leaveRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" }, // Using REJECTED as cancelled status
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel leave error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

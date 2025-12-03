import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch note for a specific employee
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID required" }, { status: 400 });
    }

    // Get the current user (HR Manager)
    const hrManager = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!hrManager) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the note
    const note = await prisma.oneOnOneNote.findUnique({
      where: {
        employeeId_hrManagerId: {
          employeeId,
          hrManagerId: hrManager.id,
        },
      },
    });

    if (!note) {
      return NextResponse.json({ notes: "", actionItems: [] });
    }

    return NextResponse.json({
      notes: note.notes,
      actionItems: note.actionItems,
      lastMeetingDate: note.lastMeetingDate,
    });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Save or update note for an employee
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { employeeId, notes, actionItems } = body;

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID required" }, { status: 400 });
    }

    // Get the current user (HR Manager)
    const hrManager = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!hrManager) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert the note (create or update)
    const savedNote = await prisma.oneOnOneNote.upsert({
      where: {
        employeeId_hrManagerId: {
          employeeId,
          hrManagerId: hrManager.id,
        },
      },
      update: {
        notes: notes || "",
        actionItems: actionItems || [],
        lastMeetingDate: new Date(),
      },
      create: {
        employeeId,
        hrManagerId: hrManager.id,
        notes: notes || "",
        actionItems: actionItems || [],
        lastMeetingDate: new Date(),
      },
    });

    return NextResponse.json({ success: true, note: savedNote });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

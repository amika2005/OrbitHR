import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // In a real implementation, you would upload to Supabase Storage or AWS S3
    // For now, we'll create a placeholder URL
    // TODO: Implement actual file upload to storage service
    
    const fileUrl = `/uploads/${Date.now()}-${file.name}`;
    
    // Create document record
    const document = await db.document.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileUrl: fileUrl,
        fileSize: file.size,
        fileType: file.type,
        category: category || "OTHER",
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

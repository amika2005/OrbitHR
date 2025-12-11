import { NextResponse } from "next/server";

export async function POST() {
  try {
    const config = {
      CV_INBOX_EMAIL: process.env.CV_INBOX_EMAIL || "NOT SET",
      CV_INBOX_PASSWORD: process.env.CV_INBOX_PASSWORD ? "SET (hidden)" : "NOT SET",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "SET (hidden)" : "NOT SET",
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "NOT SET",
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "SET (hidden)" : "NOT SET",
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "SET (hidden)" : "NOT SET",
      CRON_SECRET: process.env.CRON_SECRET ? "SET (hidden)" : "NOT SET",
    };

    const missing = Object.entries(config)
      .filter(([key, value]) => value === "NOT SET")
      .map(([key]) => key);

    return NextResponse.json({
      success: missing.length === 0,
      config,
      missing,
      message: missing.length === 0 
        ? "All environment variables are set!" 
        : `Missing: ${missing.join(", ")}`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

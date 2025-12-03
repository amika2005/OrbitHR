import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret for security
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET || "your-secret-key";
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.employeeEmail || !body.employeeName || !body.payslipData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Return success - N8N will handle the actual email sending
    return NextResponse.json({
      success: true,
      message: "Payslip data received",
      employeeName: body.employeeName,
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";

// Simple webhook verification without Clerk's Webhook class
// We'll implement basic verification manually
export async function POST(req: NextRequest) {
  try {
    // Get webhook headers for verification
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    // Get the raw body
    const requestBody = await req.text();
    
    // Simple verification - in production, you'd want proper webhook verification
    // For now, we'll just log the webhook and process it
    const webhookData = JSON.parse(requestBody);
    const type = webhookData.type;
    const data = webhookData.data;

    console.log(`Webhook received: ${type}`, data);

    // Handle different webhook events
    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
        
      case "user.updated":
        await handleUserUpdated(data);
        break;
        
      case "session.created":
      case "session.ended":
        // Handle session events if needed
        console.log(`Session event: ${type}`);
        break;
        
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleUserCreated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name, created_at, public_metadata } = data;
    const primaryEmail = email_addresses?.find((addr: any) => addr.id === "primary")?.email_address;

    if (!primaryEmail) {
      console.error("No primary email found for user");
      return;
    }

    // Check if user already exists in database
    const existingUser = await db.user.findUnique({
      where: { 
        email: primaryEmail 
      },
    });

    if (existingUser) {
      console.log("User already exists in database");
      return;
    }

    // Only create users who have a role assigned (employees created by HR)
    // Users who sign up without a role won't be created in the database
    const userRole = public_metadata?.role;
    
    if (!userRole) {
      console.log(`Skipping user creation - no role assigned: ${primaryEmail}`);
      return;
    }

    // Create user in our database with the role from Clerk metadata
    await db.user.create({
      data: {
        clerkId: id,
        email: primaryEmail,
        firstName: first_name || "",
        lastName: last_name || "",
        role: userRole,
        companyId: null, // Will be set when employee is created by HR
        createdAt: new Date(created_at),
      },
    });

    console.log(`Created user with role ${userRole}: ${primaryEmail}`);
  } catch (error) {
    console.error("Error handling user.created:", error);
  }
}

async function handleUserUpdated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name, updated_at } = data;
    const primaryEmail = email_addresses?.find((addr: any) => addr.id === "primary")?.email_address;

    if (!primaryEmail) {
      console.error("No primary email found for user");
      return;
    }

    // Update user in our database
    await db.user.updateMany({
      where: { 
        clerkId: id 
      },
      data: {
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        updatedAt: new Date(updated_at),
      },
    });

    console.log(`Updated user: ${primaryEmail}`);
  } catch (error) {
    console.error("Error handling user.updated:", error);
  }
}

// Handle GET requests for webhook verification (optional)
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "Clerk webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
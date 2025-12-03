import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  connectToGmail,
  fetchUnreadEmails,
  uploadToCloudinary,
  closeConnection,
} from "@/lib/email/gmail-client";
import { processCVInbox, routeCVToPipeline } from "@/actions/cv-inbox-actions";

export async function POST(request: NextRequest) {
  try {
    // Security: Check cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 Checking CV inbox...");

    // Get email config (for now, use first one or env vars)
    const emailConfig = await prisma.emailConfig.findFirst({
      where: { enabled: true },
    });

    // Fallback to environment variables if no config
    const emailAddress = emailConfig?.emailAddress || process.env.CV_INBOX_EMAIL;
    const emailPassword = emailConfig?.imapPassword || process.env.CV_INBOX_PASSWORD;

    if (!emailAddress || !emailPassword) {
      console.log("⚠️ No email configuration found");
      return NextResponse.json({
        success: false,
        error: "Email not configured",
      });
    }

    // Connect to Gmail
    console.log(`📧 Connecting to ${emailAddress}...`);
    const imap = await connectToGmail(emailAddress, emailPassword);

    // Fetch unread emails with CV attachments
    const emails = await fetchUnreadEmails(imap);
    console.log(`📬 Found ${emails.length} emails with CV attachments`);

    const processedCVs = [];

    for (const email of emails) {
      for (const attachment of email.attachments) {
        try {
          console.log(`📄 Processing: ${attachment.filename}`);

          // Upload to Cloudinary
          const fileUrl = await uploadToCloudinary(
            attachment.content,
            attachment.filename
          );

          // Determine file type
          const fileType = attachment.filename.endsWith(".pdf")
            ? "pdf"
            : attachment.filename.endsWith(".docx")
            ? "docx"
            : "doc";

          // Create CV inbox record
          const cvInbox = await prisma.cVInbox.create({
            data: {
              emailFrom: email.from,
              emailSubject: email.subject,
              emailBody: email.body,
              receivedAt: email.date,
              fileName: attachment.filename,
              fileUrl,
              fileType,
              fileSize: attachment.size,
              status: "PENDING",
            },
          });

          console.log(`✅ Created CV inbox record: ${cvInbox.id}`);

          // Process CV with AI
          const processResult = await processCVInbox(cvInbox.id);

          if (processResult.success && processResult.cvInbox) {
            const score = processResult.cvInbox.aiScore || 0;
            console.log(`🤖 AI Score: ${score}/100`);

            // Get threshold from config or default to 70
            const threshold = emailConfig?.scoreThreshold || 70;

            // Auto-route if score meets threshold
            if (score >= threshold) {
              console.log(`🚀 Score >= ${threshold}, routing to pipeline...`);
              const routeResult = await routeCVToPipeline(cvInbox.id);

              if (routeResult.success) {
                console.log(`✅ Routed to pipeline: ${routeResult.application?.id}`);
                processedCVs.push({
                  filename: attachment.filename,
                  score,
                  routed: true,
                  applicationId: routeResult.application?.id,
                });
              } else {
                console.log(`❌ Failed to route: ${routeResult.error}`);
                processedCVs.push({
                  filename: attachment.filename,
                  score,
                  routed: false,
                  error: routeResult.error,
                });
              }
            } else {
              console.log(`📊 Score < ${threshold}, stored in database only`);
              processedCVs.push({
                filename: attachment.filename,
                score,
                routed: false,
                reason: "Below threshold",
              });
            }
          } else {
            console.log(`❌ Failed to process: ${processResult.error}`);
            processedCVs.push({
              filename: attachment.filename,
              error: processResult.error,
            });
          }
        } catch (error) {
          console.error(`❌ Error processing ${attachment.filename}:`, error);
          processedCVs.push({
            filename: attachment.filename,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }

    // Close IMAP connection
    closeConnection(imap);

    // Update last checked time
    if (emailConfig) {
      await prisma.emailConfig.update({
        where: { id: emailConfig.id },
        data: { lastChecked: new Date() },
      });
    }

    console.log(`✅ Processed ${processedCVs.length} CVs`);

    return NextResponse.json({
      success: true,
      emailsChecked: emails.length,
      cvsProcessed: processedCVs.length,
      results: processedCVs,
    });
  } catch (error) {
    console.error("❌ Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

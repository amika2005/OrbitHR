import { clerkClient } from "@clerk/nextjs/server";
import { db } from "../src/lib/db";

/**
 * Script to update existing users' roles in Clerk metadata
 * Run this to fix users who were created before the role system was implemented
 */
async function updateUserRoles() {
  try {
    console.log("Starting user role update...");

    // Get all users from database
    const users = await db.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        role: true,
      },
    });

    console.log(`Found ${users.length} users in database`);

    const client = await clerkClient();
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        if (!user.clerkId) {
          console.log(`⚠️  Skipping ${user.email} - no Clerk ID`);
          skipped++;
          continue;
        }

        if (!user.role) {
          console.log(`⚠️  Skipping ${user.email} - no role in database`);
          skipped++;
          continue;
        }

        // Update user's public metadata in Clerk
        await client.users.updateUser(user.clerkId, {
          publicMetadata: {
            role: user.role,
          },
        });

        console.log(`✅ Updated ${user.email} with role: ${user.role}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating ${user.email}:`, error);
        errors++;
      }
    }

    console.log("\n=== Update Summary ===");
    console.log(`✅ Updated: ${updated}`);
    console.log(`⚠️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${users.length}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Run the script
updateUserRoles()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });

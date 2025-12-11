import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function syncUser() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user exists in DB
  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });

  if (dbUser) {
    return dbUser;
  }

  // Check if user exists by EMAIL (legacy user or pre-created invite)
  const existingUserByEmail = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: { company: true },
  });

  if (existingUserByEmail) {
    // SPECIAL HANDLER: If the user exists but is part of the shared "OrbitHR Demo" (slug: orbithr),
    // we should MIGRATE them to their own private workspace to satisfy the "Fresh Dashboard" requirement.
    if (existingUserByEmail.company?.slug === 'orbithr') {
       const companyName = `${user.firstName || 'User'}'s Workspace`;
       const companySlug = user.id.toLowerCase();

       // Create new private company
       const newCompany = await db.company.create({
         data: {
           name: companyName,
           slug: companySlug,
           country: "SRI_LANKA",
           currency: "LKR",
           taxRules: {},
           settings: {},
         },
       });

       // Move user to new company and update Clerk ID
       return await db.user.update({
         where: { id: existingUserByEmail.id },
         data: {
           clerkId: user.id,
           companyId: newCompany.id, // <--- TRANSFERRED TO PRIVATE WORKSPACE
           role: "HR_MANAGER", // Ensure they are admin of their new workspace
           imageUrl: user.imageUrl || existingUserByEmail.imageUrl,
           firstName: user.firstName || existingUserByEmail.firstName,
           lastName: user.lastName || existingUserByEmail.lastName,
         },
       });
    }

    // Normal behavior for non-demo matches (e.g. invited employees) -> just link
    return await db.user.update({
      where: { id: existingUserByEmail.id },
      data: {
        clerkId: user.id,
        imageUrl: user.imageUrl || existingUserByEmail.imageUrl,
        firstName: user.firstName || existingUserByEmail.firstName,
        lastName: user.lastName || existingUserByEmail.lastName,
      },
    });
  }

  // If not, create the user
  // 1. Create a UNIQUE company for this user
  // We use the Clerk ID as the slug to ensure global uniqueness and uniqueness per user
  const companyName = `${user.firstName || 'User'}'s Workspace`;
  const companySlug = user.id.toLowerCase(); 

  const newCompany = await db.company.create({
    data: {
      name: companyName,
      slug: companySlug,
      country: "SRI_LANKA", // Default, user can change settings later
      currency: "LKR",
      taxRules: {},
      settings: {},
    },
  });

  // 2. Create the user
  try {
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || "User",
        lastName: user.lastName || "",
        role: "HR_MANAGER", // Default to HR Manager for new workspace owners
        companyId: newCompany.id,
      },
    });
    return newUser;
  } catch (error: any) {
    // Handle Unique Constraint (P2002) on email
    // This happens if the user exists but wasn't found in the initial check (race condition, casing, etc.)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      const existingUser = await db.user.findUnique({
        where: { email: user.emailAddresses[0].emailAddress },
      });
      
      if (existingUser) {
        return await db.user.update({
          where: { id: existingUser.id },
          data: { clerkId: user.id },
        });
      }
    }
    throw error;
  }
}

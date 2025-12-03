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

  // If not, create the user
  // 1. Find the default company (seeded as 'orbithr')
  let company = await db.company.findUnique({
    where: { slug: "orbithr" },
  });

  // Fallback: If seed didn't run or company missing, create it
  if (!company) {
    company = await db.company.create({
      data: {
        name: "OrbitHR Demo",
        slug: "orbithr",
        country: "SRI_LANKA",
        currency: "LKR",
        taxRules: {},
        settings: {},
      },
    });
  }

  // 2. Create the user
  const newUser = await db.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName || "User",
      lastName: user.lastName || "",
      role: "HR_MANAGER", // Default to HR Manager for demo
      companyId: company.id,
    },
  });

  return newUser;
}

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user role
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  // Redirect HR/Admin to dashboard
  if (user?.role === "HR_MANAGER" || user?.role === "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-portal-50">
      {children}
    </div>
  );
}

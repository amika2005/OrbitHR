import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { ProfileEditForm } from "@/components/portal/ProfileEditForm";

async function ProfileContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Get manager info if exists
  const manager = user.managerId
    ? await db.user.findUnique({
        where: { id: user.managerId },
        select: {
          firstName: true,
          lastName: true,
        },
      })
    : null;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your personal information</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="bg-portal-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-portal-primary flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <p className="text-gray-600">{user.position || "Employee"}</p>
              </div>
            </div>
            <ProfileEditForm user={user} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                  <User className="h-5 w-5 text-portal-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-portal-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-portal-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium text-gray-900">
                    {user.employeeId || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Employment Information
              </h3>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-portal-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">
                    {user.department || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-portal-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium text-gray-900">
                    {user.position || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-portal-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="font-medium text-gray-900">
                    {user.hireDate
                      ? new Date(user.hireDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {manager && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-portal-50 flex items-center justify-center">
                    <User className="h-5 w-5 text-portal-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manager</p>
                    <p className="font-medium text-gray-900">
                      {manager.firstName} {manager.lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <div className="flex-1 lg:ml-64">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-portal-primary"></div>
            </div>
          }
        >
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  );
}

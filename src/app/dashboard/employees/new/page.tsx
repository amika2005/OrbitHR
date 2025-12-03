"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEmployee } from "@/actions/employee-actions";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const employeeData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      employeeId: formData.get("employeeId") as string,
      epfNumber: formData.get("epfNumber") as string,
      department: formData.get("department") as string,
      position: formData.get("position") as string,
      hireDate: new Date(formData.get("hireDate") as string),
      salary: parseFloat(formData.get("salary") as string),
    };

    const result = await createEmployee(employeeData);

    if (result.success) {
      toast.success("Employee created successfully!");
      router.push("/dashboard/employees");
    } else {
      toast.error(result.error || "Failed to create employee");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="John"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john.doe@company.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  minLength={8}
                />
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Employment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    required
                    placeholder="EMP001"
                  />
                </div>

                <div>
                  <Label htmlFor="epfNumber">EPF Number</Label>
                  <Input
                    id="epfNumber"
                    name="epfNumber"
                    placeholder="EPF-12345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    name="hireDate"
                    type="date"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="salary">Monthly Salary *</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    required
                    placeholder="500000"
                    step="0.01"
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    required
                    placeholder="Engineering"
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    required
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Add Employee"
                )}
              </Button>
              <Link href="/dashboard/employees" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

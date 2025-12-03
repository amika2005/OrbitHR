"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createJob } from "@/actions/job-actions";
import { Country, Currency } from "@prisma/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const jobData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string,
      country: formData.get("country") as Country,
      location: formData.get("location") as string,
      salaryMin: parseFloat(formData.get("salaryMin") as string),
      salaryMax: parseFloat(formData.get("salaryMax") as string),
      currency: formData.get("currency") as Currency,
      department: formData.get("department") as string,
      employmentType: formData.get("employmentType") as string,
      keySkills: skills,
    };

    const result = await createJob(jobData);

    if (result.success) {
      toast.success("Job created successfully!");
      router.push("/dashboard/jobs");
    } else {
      toast.error(result.error || "Failed to create job");
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  required
                  rows={5}
                  placeholder="List the required qualifications, experience, and skills..."
                />
              </div>
            </div>

            {/* Location & Compensation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Compensation</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    name="country"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select country</option>
                    <option value="JAPAN">Japan</option>
                    <option value="SRI_LANKA">Sri Lanka</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="location">City/Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    required
                    placeholder="e.g. Tokyo, Colombo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Min Salary *</Label>
                  <Input
                    id="salaryMin"
                    name="salaryMin"
                    type="number"
                    required
                    placeholder="300000"
                  />
                </div>

                <div>
                  <Label htmlFor="salaryMax">Max Salary *</Label>
                  <Input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    required
                    placeholder="500000"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <select
                    id="currency"
                    name="currency"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="LKR">LKR (Rs)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    required
                    placeholder="e.g. Engineering, Sales"
                  />
                </div>

                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Required Skills *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {skills.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Add at least one required skill
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || skills.length === 0}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
              <Link href="/dashboard/jobs" className="flex-1">
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

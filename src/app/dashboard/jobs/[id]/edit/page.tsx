"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { updateJob, getJob } from "@/actions/job-actions";
import { Country, Currency } from "@prisma/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [jobData, setJobData] = useState<any>(null);

  useEffect(() => {
    async function loadJob() {
      const result = await getJob(params.id);
      if (result.success && result.data) {
        setJobData(result.data);
        setSkills(result.data.keySkills || []);
      } else {
        toast.error("Failed to load job");
        router.push("/dashboard/jobs");
      }
      setIsLoading(false);
    }
    loadJob();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const updateData = {
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

    const result = await updateJob(params.id, updateData);

    if (result.success) {
      toast.success("Job updated successfully!");
      router.push(`/dashboard/jobs/${params.id}`);
    } else {
      toast.error(result.error || "Failed to update job");
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

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return null;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/dashboard/jobs/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Job</CardTitle>
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
                  defaultValue={jobData.title}
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
                  defaultValue={jobData.description}
                  placeholder="Describe the role..."
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  required
                  rows={5}
                  defaultValue={jobData.requirements}
                  placeholder="List the requirements..."
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
                    defaultValue={jobData.country}
                    className="w-full px-3 py-2 border rounded-md"
                  >
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
                    defaultValue={jobData.location}
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
                    defaultValue={jobData.salaryMin}
                  />
                </div>

                <div>
                  <Label htmlFor="salaryMax">Max Salary *</Label>
                  <Input
                    id="salaryMax"
                    name="salaryMax"
                    type="number"
                    required
                    defaultValue={jobData.salaryMax}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <select
                    id="currency"
                    name="currency"
                    required
                    defaultValue={jobData.currency}
                    className="w-full px-3 py-2 border rounded-md"
                  >
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
                    defaultValue={jobData.department}
                  />
                </div>

                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    required
                    defaultValue={jobData.employmentType}
                    className="w-full px-3 py-2 border rounded-md"
                  >
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Link href={`/dashboard/jobs/${params.id}`} className="flex-1">
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

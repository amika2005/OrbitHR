"use client";

import { useState, useEffect } from "react";
import { PipelineBoard } from "@/components/candidates/PipelineBoard";
import { CandidateModal } from "@/components/candidates/CandidateModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Define ApplicationStatus enum locally since import is failing
enum ApplicationStatus {
  NEW = "NEW",
  AI_SCREENED = "AI_SCREENED",
  HR_APPROVED = "HR_APPROVED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
}
import {
  Filter,
  Plus,
  Download,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { updateApplicationStatus } from "@/actions/screen-candidate";

// Define type for application
interface Application {
  id: string;
  status: ApplicationStatus;
  aiScore: number | null;
  culturalFitScore: number | null;
  resumeUrl: string;
  aiSummary: string | null;
  missingSkills: string[];
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
  };
  job: {
    title: string;
    description: string;
  };
  createdAt: Date;
  interviewDate: Date | null;
}

// Mock data - in real app, this would come from API
const mockApplications: Application[] = [
  {
    id: "1",
    status: ApplicationStatus.NEW,
    aiScore: null,
    culturalFitScore: null,
    resumeUrl: "/resumes/sarah-chen.pdf",
    aiSummary: null,
    missingSkills: [],
    candidate: {
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@email.com",
    },
    job: {
      title: "Senior Frontend Developer",
      description: "Lead our frontend development team",
    },
    createdAt: new Date("2024-01-15"),
    interviewDate: null,
  },
  {
    id: "2",
    status: ApplicationStatus.AI_SCREENED,
    aiScore: 85,
    culturalFitScore: 78,
    resumeUrl: "/resumes/michael-johnson.pdf",
    aiSummary: `**Summary:** Strong backend developer with 5+ years of experience.

**Strengths:**
- Expert in Node.js and Python
- Database optimization skills
- System design experience

**Concerns:**
- Limited cloud experience
- No team leadership experience`,
    missingSkills: ["AWS", "Kubernetes"],
    candidate: {
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.j@email.com",
    },
    job: {
      title: "Backend Engineer",
      description: "Build scalable backend systems",
    },
    createdAt: new Date("2024-01-14"),
    interviewDate: null,
  },
  {
    id: "3",
    status: ApplicationStatus.HR_APPROVED,
    aiScore: 92,
    culturalFitScore: 88,
    resumeUrl: "/resumes/yuki-tanaka.pdf",
    aiSummary: `**Summary:** Excellent candidate with strong product management background.

**Strengths:**
- 8+ years in product management
- Bilingual (English/Japanese)
- Strong leadership skills
- Technical background

**Concerns:**
- Limited startup experience`,
    missingSkills: ["Agile methodologies"],
    candidate: {
      firstName: "Yuki",
      lastName: "Tanaka",
      email: "yuki.t@email.com",
    },
    job: {
      title: "Product Manager",
      description: "Drive product strategy and execution",
    },
    createdAt: new Date("2024-01-13"),
    interviewDate: new Date("2024-01-20"),
  },
  // Add more mock applications for different stages
  {
    id: "4",
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    aiScore: 88,
    culturalFitScore: 85,
    resumeUrl: "/resumes/emma-wilson.pdf",
    aiSummary: `**Summary:** Creative UX designer with strong portfolio.

**Strengths:**
- Expert in Figma and Adobe Creative Suite
- User research experience
- Mobile-first design approach

**Concerns:**
- Limited enterprise experience`,
    missingSkills: ["Design systems"],
    candidate: {
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma.w@email.com",
    },
    job: {
      title: "UX Designer",
      description: "Create amazing user experiences",
    },
    createdAt: new Date("2024-01-12"),
    interviewDate: new Date("2024-01-18"),
  },
  {
    id: "5",
    status: ApplicationStatus.HIRED,
    aiScore: 95,
    culturalFitScore: 92,
    resumeUrl: "/resumes/david-lee.pdf",
    aiSummary: `**Summary:** Outstanding DevOps engineer with extensive experience.

**Strengths:**
- Expert in CI/CD pipelines
- Strong automation skills
- Cloud architecture experience
- Team leadership

**Concerns:**
- None identified`,
    missingSkills: [],
    candidate: {
      firstName: "David",
      lastName: "Lee",
      email: "david.lee@email.com",
    },
    job: {
      title: "DevOps Engineer",
      description: "Maintain and improve our infrastructure",
    },
    createdAt: new Date("2024-01-10"),
    interviewDate: new Date("2024-01-15"),
  },
];

export default function CandidatesPage() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    setLoading(true);
    try {
      // In real app, this would call the server action
      // await updateApplicationStatus(applicationId, newStatus);
      
      // Optimistic update
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (notes?: string) => {
    if (!selectedApplication) return;
    await handleStatusChange(selectedApplication.id, ApplicationStatus.HR_APPROVED);
  };

  const handleReject = async (notes?: string) => {
    if (!selectedApplication) return;
    await handleStatusChange(selectedApplication.id, ApplicationStatus.REJECTED);
  };

  const handleScheduleInterview = async (date: Date, notes?: string) => {
    if (!selectedApplication) return;
    await handleStatusChange(selectedApplication.id, ApplicationStatus.INTERVIEW_SCHEDULED);
  };

  const openCandidateModal = (application: any) => {
    setSelectedApplication({
      ...application,
      resumeUrl: "/resumes/sample.pdf", // Mock URL
      aiSummary: `**Summary:** Strong technical background with 5+ years of experience in frontend development.

**Strengths:**
- Expert in React and TypeScript
- Excellent portfolio of projects
- Strong communication skills
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
          <p className="text-gray-600 dark:text-zinc-400">Manage your applicant pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" disabled={loading} className="border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-gray-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-gray-800 dark:hover:bg-zinc-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">New</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications.filter(a => a.status === ApplicationStatus.NEW).length}
                </p>
              </div>
              <Badge className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-300">NEW</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">AI Screened</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications.filter(a => a.status === ApplicationStatus.AI_SCREENED).length}
                </p>
              </div>
              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">AI</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">Interview</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications.filter(a => a.status === ApplicationStatus.INTERVIEW_SCHEDULED).length}
                </p>
              </div>
              <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">INTERVIEW</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">Hired</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applications.filter(a => a.status === ApplicationStatus.HIRED).length}
                </p>
              </div>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">HIRED</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <Card className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">Application Pipeline</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[calc(100vh-300px)]">
            <PipelineBoard
              applications={applications}
              onStatusChange={handleStatusChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Candidate Modal */}
      {selectedApplication && (
        <CandidateModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onScheduleInterview={handleScheduleInterview}
        />
      )}
    </div>
  );
}
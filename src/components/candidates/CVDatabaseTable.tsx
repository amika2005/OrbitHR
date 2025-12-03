"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";

// --- Types ---

type Department = "IT Engineering" | "Marketing" | "Finance" | "Operations";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  avatar: string;
  degree: string;
  university: string;
  experience: string;
  techSkills: string[];
  softSkills: string[];
  executiveSummary: string;
  aiScore: number;
  department: Department;
}

// --- Mock Data ---

const mockCandidates: Candidate[] = [
  // IT Engineering
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+94 77 123 4567",
    date: "2024-03-15",
    avatar: "SC",
    degree: "BSc Computer Science",
    university: "University of Colombo",
    experience: "5 Yrs",
    techSkills: ["React", "Node.js", "TypeScript", "AWS"],
    softSkills: ["Leadership", "Problem Solving"],
    executiveSummary: "Highly motivated Senior Frontend Engineer with 5 years of experience in building scalable web applications. Proven track record of leading teams and delivering high-quality code. Strong expertise in React ecosystem and cloud infrastructure.",
    aiScore: 92,
    department: "IT Engineering",
  },
  {
    id: "2",
    name: "Michael Ross",
    email: "m.ross@example.com",
    phone: "+94 71 987 6543",
    date: "2024-03-14",
    avatar: "MR",
    degree: "BEng Software Engineering",
    university: "SLIIT",
    experience: "7 Yrs",
    techSkills: ["Python", "Django", "PostgreSQL", "Docker"],
    softSkills: ["Teamwork", "Mentoring"],
    executiveSummary: "Full Stack Developer with a focus on backend technologies. Experienced in designing RESTful APIs and microservices architecture. Passionate about code quality and automated testing.",
    aiScore: 88,
    department: "IT Engineering",
  },
  {
    id: "3",
    name: "David Kim",
    email: "d.kim@example.com",
    phone: "+94 76 111 2222",
    date: "2024-03-12",
    avatar: "DK",
    degree: "MSc Data Science",
    university: "Moratuwa University",
    experience: "4 Yrs",
    techSkills: ["Python", "TensorFlow", "SQL", "Tableau"],
    softSkills: ["Analytical", "Communication"],
    executiveSummary: "Data Scientist with a strong background in machine learning and statistical analysis. Skilled in translating complex data into actionable business insights. Experience with predictive modeling and data visualization.",
    aiScore: 95,
    department: "IT Engineering",
  },

  // Marketing
  {
    id: "4",
    name: "Jessica Wu",
    email: "j.wu@example.com",
    phone: "+94 70 333 4444",
    date: "2024-03-10",
    avatar: "JW",
    degree: "BA Marketing",
    university: "NSBM",
    experience: "3 Yrs",
    techSkills: ["SEO", "Google Analytics", "HubSpot"],
    softSkills: ["Creativity", "Adaptability"],
    executiveSummary: "Creative Marketing Specialist with expertise in digital marketing strategies and content creation. Proven ability to increase brand awareness and drive engagement through targeted campaigns.",
    aiScore: 85,
    department: "Marketing",
  },
];

// --- Components ---

export function CVDatabaseTable() {
  const [activeTab, setActiveTab] = useState<Department>("IT Engineering");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = mockCandidates.filter(
    (c) =>
      c.department === activeTab &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-white dark:bg-black font-sans overflow-hidden -m-6">
      {/* Header Section */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex-none">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
              CV Database
            </h1>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Master list of all candidates and their AI tracking data.
            </p>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 w-48 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-200 dark:border-zinc-800 px-2">
              <Filter className="h-3 w-3 mr-1.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-200 dark:border-zinc-800 px-2">
              <Download className="h-3 w-3 mr-1.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Department Tabs */}
        <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-md w-fit">
          {(["IT Engineering", "Marketing", "Finance", "Operations"] as Department[]).map(
            (dept) => (
              <button
                key={dept}
                onClick={() => setActiveTab(dept)}
                className={`px-3 py-1 text-[10px] font-medium rounded-sm transition-all ${
                  activeTab === dept
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {dept}
              </button>
            )
          )}
        </div>
      </div>

      {/* Master Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[220px]">
                Candidate Info
              </th>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[180px]">
                Tech Stack
              </th>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[180px]">
                Soft Skills
              </th>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[140px]">
                Exp & Edu
              </th>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                AI Executive Summary
              </th>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[100px]">
                AI Score
              </th>
              <th className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 w-[80px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-black">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group"
                >
                  {/* Candidate Info */}
                  <td className="px-3 py-2 align-top relative">
                    <div className="flex items-start">
                      <Avatar className="h-7 w-7 mr-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold border border-zinc-200 dark:border-zinc-700">
                        <AvatarFallback className="text-[10px]">{candidate.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                          {candidate.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">
                          {candidate.email}
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                          {candidate.phone}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-3 text-[9px] text-zinc-400">
                      {candidate.date}
                    </div>
                  </td>

                  {/* Tech Stack */}
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {candidate.techSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Soft Skills */}
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {candidate.softSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border border-zinc-200 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Exp & Edu */}
                  <td className="px-3 py-2 align-top">
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
                      {candidate.experience}
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[120px]" title={candidate.degree + " - " + candidate.university}>
                      {candidate.degree}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-[120px]">
                      {candidate.university}
                    </div>
                  </td>

                  {/* AI Executive Summary */}
                  <td className="px-3 py-2 align-top">
                    <Tooltip content={candidate.executiveSummary}>
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400 italic line-clamp-2 cursor-help leading-relaxed">
                        {candidate.executiveSummary}
                      </p>
                    </Tooltip>
                  </td>

                  {/* AI Score */}
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {candidate.aiScore}
                          <span className="text-zinc-400 font-normal text-[10px]">
                            /100
                          </span>
                        </span>
                      </div>
                      <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            candidate.aiScore >= 90
                              ? "bg-emerald-500"
                              : candidate.aiScore >= 75
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${candidate.aiScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2 align-top text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
                    <FileText className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300">
                      No candidates found
                    </p>
                    <p className="text-xs">
                      There are no candidates in the {activeTab} department yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  Book, 
  Users, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Search,
  FileText,
  Calculator,
  UserPlus,
  Network
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Help Content Data
const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    description: "Overview of OrbitHR and dashboard navigation",
    articles: [
      {
        title: "Dashboard Overview",
        content: (
          <div className="space-y-4">
            <p>
              Welcome to OrbitHR! The dashboard is your central hub for managing all HR activities. 
              Here's a quick breakdown of what you can do:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Quick Stats:</strong> View total employees, open jobs, and pending leave requests at a glance.</li>
              <li><strong>Recent Activity:</strong> See the latest actions taken within the system.</li>
              <li><strong>Navigation:</strong> Use the sidebar to access different modules like Hire, Manage, and Payroll.</li>
            </ul>
          </div>
        )
      },
      {
        title: "Navigation Guide",
        content: (
          <div className="space-y-4">
            <p>The sidebar is organized into three main sections:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Hire:</strong> Manage job postings and candidate pipelines.</li>
              <li><strong>Manage:</strong> Handle employee records, organization charts, and leave requests.</li>
              <li><strong>Payroll:</strong> Process salaries, generate slips, and calculate taxes.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "recruitment",
    title: "Recruitment & Hiring",
    icon: Briefcase,
    description: "Managing jobs, candidates, and the hiring pipeline",
    articles: [
      {
        title: "Posting a New Job",
        content: (
          <div className="space-y-4">
            <p>To post a new job opening:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Navigate to <strong>Hire &gt; Jobs</strong>.</li>
              <li>Click the <strong>"Post Job"</strong> button.</li>
              <li>Fill in the job details, including title, description, requirements, and salary range.</li>
              <li>Select a <strong>Screening Template</strong> for AI candidate analysis.</li>
              <li>Click <strong>"Publish"</strong> to make the job live.</li>
            </ol>
          </div>
        )
      },
      {
        title: "Managing the Pipeline",
        content: (
          <div className="space-y-4">
            <p>Track candidates through the hiring process:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Go to <strong>Hire &gt; Pipeline</strong>.</li>
              <li>Drag and drop candidates between stages (e.g., New, Screening, Interview, Hired).</li>
              <li>Click on a candidate card to view their profile, resume, and AI scores.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "org-chart",
    title: "Organization Management",
    icon: Network,
    description: "Managing the organizational structure and employees",
    articles: [
      {
        title: "Using the Org Chart",
        content: (
          <div className="space-y-4">
            <p>Visualize your company structure:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Navigate to <strong>Manage &gt; Org Chart</strong>.</li>
              <li>Switch between <strong>Chart View</strong> and <strong>List View</strong> using the toggle buttons.</li>
              <li><strong>Drag and Drop</strong> nodes in Chart View to restructure reporting lines.</li>
              <li>Click <strong>"Edit Hierarchy"</strong> to enable drag-and-drop mode.</li>
            </ul>
          </div>
        )
      },
      {
        title: "Adding Employees",
        content: (
          <div className="space-y-4">
            <p>To add a new team member:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Go to <strong>Manage &gt; Employees</strong> or <strong>Org Chart</strong>.</li>
              <li>Click <strong>"Add Member"</strong>.</li>
              <li>Enter their personal details, role, and assign a manager.</li>
              <li>The system will automatically create a user account for them.</li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    id: "payroll",
    title: "Payroll System",
    icon: DollarSign,
    description: "Processing payroll, salary slips, and tax calculations",
    articles: [
      {
        title: "Generating Payroll",
        content: (
          <div className="space-y-4">
            <p>Process monthly payroll for employees:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Go to <strong>Payroll &gt; Payroll Management</strong>.</li>
              <li>Click <strong>"New Payroll"</strong>.</li>
              <li>Select the month and year.</li>
              <li>Review the calculated amounts (Base Salary, EPF, ETF).</li>
              <li>Click <strong>"Process"</strong> to finalize and generate records.</li>
            </ol>
          </div>
        )
      },
      {
        title: "Salary Slips",
        content: (
          <div className="space-y-4">
            <p>View and download salary slips:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Navigate to <strong>Payroll &gt; Salary Slip Generator</strong>.</li>
              <li>Select an employee and the payroll period.</li>
              <li>Click <strong>"Generate Slip"</strong> to view the detailed breakdown.</li>
              <li>Use the <strong>"Download PDF"</strong> button to save a copy.</li>
            </ul>
          </div>
        )
      },
      {
        title: "EPF/ETF Calculation",
        content: (
          <div className="space-y-4">
            <p>Understanding statutory deductions (Sri Lanka):</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>EPF (Employee):</strong> 8% deducted from gross salary.</li>
              <li><strong>EPF (Employer):</strong> 12% contributed by the company.</li>
              <li><strong>ETF (Employer):</strong> 3% contributed by the company.</li>
              <li>Use the <strong>EPF/ETF Calculator</strong> tool for quick estimations.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: "leave",
    title: "Leave Management",
    icon: Calendar,
    description: "Handling leave requests and balances",
    articles: [
      {
        title: "Applying for Leave",
        content: (
          <div className="space-y-4">
            <p>Employees can request leave easily:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Go to <strong>Manage &gt; Leave</strong>.</li>
              <li>Click <strong>"New Request"</strong>.</li>
              <li>Select the leave type (Annual, Casual, Sick, etc.).</li>
              <li>Choose the dates and provide a reason.</li>
              <li>Submit for manager approval.</li>
            </ol>
          </div>
        )
      },
      {
        title: "Approving Leave",
        content: (
          <div className="space-y-4">
            <p>Managers can review requests:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Navigate to the <strong>Leave</strong> dashboard.</li>
              <li>View "Pending Requests".</li>
              <li>Click <strong>Approve</strong> or <strong>Reject</strong>.</li>
              <li>Approved leave is automatically deducted from the employee's balance.</li>
            </ul>
          </div>
        )
      }
    ]
  }
];

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState<string>(helpCategories[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);

  const toggleArticle = (title: string) => {
    setExpandedArticles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const filteredCategories = helpCategories.map(cat => ({
    ...cat,
    articles: cat.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.articles.length > 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Help Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Guides, tutorials, and support for using OrbitHR
          </p>
          
          <div className="relative max-w-2xl group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-olive-500 to-teal-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <Search className="ml-3 text-gray-400 w-5 h-5 group-focus-within:text-olive-600 transition-colors" />
              <input 
                type="text"
                placeholder="Search for help articles..." 
                className="w-full h-10 px-3 text-lg bg-transparent border-none focus:ring-0 placeholder:text-gray-400 text-gray-900 dark:text-white outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="hidden sm:flex items-center gap-1 pr-3">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  ⌘ K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto h-full flex gap-6 p-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0 hidden md:block">
            <div className="space-y-1">
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeCategory === category.id
                      ? "bg-olive-50 text-olive-700 dark:bg-olive-900/20 dark:text-olive-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <category.icon className="w-5 h-5" />
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <ScrollArea className="flex-1 h-full pr-4">
            <div className="space-y-8 pb-12">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  id={category.id}
                  className={cn(
                    "scroll-mt-6",
                    searchQuery ? "block" : (activeCategory === category.id ? "block" : "hidden md:hidden")
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-olive-100 dark:bg-olive-900/30 rounded-lg">
                      <category.icon className="w-6 h-6 text-olive-600 dark:text-olive-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {category.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {category.articles.map((article, index) => (
                      <Card key={index} className="overflow-hidden border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => toggleArticle(article.title)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 dark:text-white">
                            {article.title}
                          </span>
                          {expandedArticles.includes(article.title) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedArticles.includes(article.title) && (
                          <div className="px-4 pb-4 pt-0 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
                            <div className="pt-4">
                              {article.content}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No help articles found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

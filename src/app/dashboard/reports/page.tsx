"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Users, Briefcase, TrendingUp, DollarSign, Calendar, Download,
  Filter, BarChart3, PieChart as PieChartIcon, TrendingDown, Award
} from "lucide-react";

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Mock data for charts
  const hiringData = [
    { month: "Jan", applications: 45, interviews: 28, hires: 8 },
    { month: "Feb", applications: 52, interviews: 32, hires: 10 },
    { month: "Mar", applications: 48, interviews: 30, hires: 9 },
    { month: "Apr", applications: 65, interviews: 38, hires: 12 },
    { month: "May", applications: 58, interviews: 35, hires: 11 },
    { month: "Jun", applications: 72, interviews: 42, hires: 15 },
  ];

  const departmentData = [
    { name: "Engineering", value: 45, color: "#6B46C1" },
    { name: "Sales", value: 28, color: "#F97316" },
    { name: "Marketing", value: 18, color: "#10B981" },
    { name: "HR", value: 12, color: "#8B5CF6" },
    { name: "Finance", value: 15, color: "#FB923C" },
  ];

  const payrollData = [
    { month: "Jan", total: 450000, tax: 90000, net: 360000 },
    { month: "Feb", total: 465000, tax: 93000, net: 372000 },
    { month: "Mar", total: 470000, tax: 94000, net: 376000 },
    { month: "Apr", total: 485000, tax: 97000, net: 388000 },
    { month: "May", total: 490000, tax: 98000, net: 392000 },
    { month: "Jun", total: 505000, tax: 101000, net: 404000 },
  ];

  const performanceData = [
    { month: "Jan", avgScore: 7.2, reviews: 35 },
    { month: "Feb", avgScore: 7.5, reviews: 38 },
    { month: "Mar", avgScore: 7.8, reviews: 42 },
    { month: "Apr", avgScore: 8.1, reviews: 40 },
    { month: "May", avgScore: 8.3, reviews: 45 },
    { month: "Jun", avgScore: 8.5, reviews: 48 },
  ];

  const stats = [
    {
      title: "Total Employees",
      value: "248",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "brand",
      bgColor: "bg-brand-100 dark:bg-brand-900/30",
      textColor: "text-brand-600 dark:text-brand-400",
      borderColor: "border-brand-600 dark:border-brand-500"
    },
    {
      title: "Active Jobs",
      value: "18",
      change: "+3",
      trend: "up",
      icon: Briefcase,
      color: "coral",
      bgColor: "bg-coral-100 dark:bg-coral-900/30",
      textColor: "text-coral-600 dark:text-coral-400",
      borderColor: "border-coral-500 dark:border-coral-500"
    },
    {
      title: "Avg Time to Hire",
      value: "12 days",
      change: "-2 days",
      trend: "up",
      icon: Calendar,
      color: "teal",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      textColor: "text-teal-600 dark:text-teal-400",
      borderColor: "border-teal-500 dark:border-teal-500"
    },
    {
      title: "Monthly Payroll",
      value: "$505K",
      change: "+3.1%",
      trend: "up",
      icon: DollarSign,
      color: "brand",
      bgColor: "bg-brand-100 dark:bg-brand-900/30",
      textColor: "text-brand-600 dark:text-brand-400",
      borderColor: "border-brand-600 dark:border-brand-500"
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive insights and analytics for your HR operations</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <Button className="bg-brand-600 hover:bg-brand-700 text-white dark:bg-brand-700 dark:hover:bg-brand-600">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`border-l-4 ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className={`text-xs font-medium mt-1 flex items-center ${stat.trend === 'up' ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "hiring", label: "Hiring Pipeline" },
            { id: "employees", label: "Employee Analytics" },
            { id: "payroll", label: "Payroll" },
            { id: "performance", label: "Performance" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                selectedReport === tab.id
                  ? 'text-brand-600 border-b-2 border-brand-600 dark:text-brand-400 dark:border-brand-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Charts Section */}
        {selectedReport === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiring Funnel */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <BarChart3 className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
                  Hiring Funnel (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hiringData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="applications" fill="#6B46C1" name="Applications" />
                    <Bar dataKey="interviews" fill="#F97316" name="Interviews" />
                    <Bar dataKey="hires" fill="#10B981" name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <PieChartIcon className="h-5 w-5 mr-2 text-coral-600 dark:text-coral-400" />
                  Department Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payroll Trends */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <DollarSign className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Payroll Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#6B46C1" strokeWidth={2} name="Total" />
                    <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={2} name="Net Pay" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Award className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="avgScore" stroke="#F97316" strokeWidth={2} name="Avg Score" />
                    <Line type="monotone" dataKey="reviews" stroke="#6B46C1" strokeWidth={2} name="Reviews" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedReport === "hiring" && (
          <div className="space-y-6">
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Hiring Pipeline Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={hiringData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Bar dataKey="applications" fill="#6B46C1" name="Applications" />
                    <Bar dataKey="interviews" fill="#F97316" name="Interviews" />
                    <Bar dataKey="hires" fill="#10B981" name="Hires" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-sm border-l-4 border-brand-600 dark:bg-gray-800 dark:border-brand-500">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Conversion Rate</div>
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">21.4%</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 mt-2">+2.3% from last month</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-coral-500 dark:bg-gray-800 dark:border-coral-500">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Interview to Hire</div>
                  <div className="text-3xl font-bold text-coral-600 dark:text-coral-400">35.7%</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 mt-2">+1.8% from last month</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-teal-500 dark:bg-gray-800 dark:border-teal-500">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Offer Acceptance</div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">92.3%</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 mt-2">+4.1% from last month</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedReport === "employees" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: '#F3F4F6' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">Employee Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={hiringData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                      <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                      <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        itemStyle={{ color: '#F3F4F6' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="hires" stroke="#6B46C1" strokeWidth={3} name="New Hires" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Headcount", value: "248", color: "brand" },
                { label: "Turnover Rate", value: "8.2%", color: "coral" },
                { label: "Avg Tenure", value: "3.2 yrs", color: "teal" },
                { label: "Remote Workers", value: "42%", color: "brand" }
              ].map((metric, i) => (
                <Card key={i} className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.label}</div>
                    <div className={`text-3xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedReport === "payroll" && (
          <div className="space-y-6">
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Payroll Trends (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={payrollData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis stroke="#6B7280" className="dark:stroke-gray-400" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#6B46C1" strokeWidth={2} name="Total Payroll" />
                    <Line type="monotone" dataKey="tax" stroke="#F97316" strokeWidth={2} name="Tax Deductions" />
                    <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={2} name="Net Pay" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-sm border-l-4 border-brand-600 dark:bg-gray-800 dark:border-brand-500">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Payroll (June)</div>
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">$505,000</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 mt-2">+3.1% from May</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-coral-500 dark:bg-gray-800 dark:border-coral-500">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tax Deductions</div>
                  <div className="text-3xl font-bold text-coral-600 dark:text-coral-400">$101,000</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">20% of total</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-l-4 border-teal-500 dark:bg-gray-800 dark:border-teal-500">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Net Pay</div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">$404,000</div>
                  <div className="text-xs text-teal-600 dark:text-teal-400 mt-2">+3.1% from May</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedReport === "performance" && (
          <div className="space-y-6">
            <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
                    <XAxis dataKey="month" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis yAxisId="left" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" className="dark:stroke-gray-400" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                      itemStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="avgScore" stroke="#F97316" strokeWidth={3} name="Average Score" />
                    <Line yAxisId="right" type="monotone" dataKey="reviews" stroke="#6B46C1" strokeWidth={3} name="Reviews Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Avg Performance Score", value: "8.5/10", color: "brand" },
                { label: "Reviews Completed", value: "48", color: "coral" },
                { label: "Goals Achieved", value: "87%", color: "teal" },
                { label: "Top Performers", value: "32", color: "brand" }
              ].map((metric, i) => (
                <Card key={i} className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.label}</div>
                    <div className={`text-3xl font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>{metric.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Edit2, Filter, User, Heart, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { getLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from "@/actions/leave-actions";
import { LeaveRequestModal } from "@/components/leave/LeaveRequestModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type LeaveRequest = {
  id: string;
  leaveType: string;
  casualSubType?: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  isShortLeave?: boolean;
  status: string;
  reason?: string;
  employee: {
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
  };
};

export default function LeavePage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"my" | "all">("my");
  const [filterMonth, setFilterMonth] = useState("current");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock balances - in production, fetch from API
  const [balances, setBalances] = useState({
    annual: { total: 14, used: 0, remaining: 14 },
    casual: { total: 7, used: 0, remaining: 7 },
    shortLeave: { used: 0, limit: 2 },
  });

  useEffect(() => {
    loadLeaveRequests();
  }, [activeTab]);

  const loadLeaveRequests = async () => {
    setLoading(true);
    try {
      const result = await getLeaveRequests();
      if (result && result.success && result.data) {
        setLeaveRequests(result.data as any);
        calculateBalances(result.data as any);
      } else {
        console.error("Failed to load leave requests:", result?.error);
        setLeaveRequests([]);
      }
    } catch (error) {
      console.error("Error loading leave requests:", error);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalances = (requests: LeaveRequest[]) => {
    let annualUsed = 0;
    let casualUsed = 0;
    let shortLeaveCount = 0;

    requests
      .filter((r) => r.status === "APPROVED")
      .forEach((leave) => {
        if (leave.leaveType === "ANNUAL_LEAVE") {
          annualUsed += leave.totalDays;
        } else if (leave.leaveType === "CASUAL_LEAVE") {
          if (leave.isShortLeave) {
            shortLeaveCount += 1;
          } else {
            casualUsed += leave.totalDays;
          }
        }
      });

    setBalances({
      annual: { total: 14, used: annualUsed, remaining: 14 - annualUsed },
      casual: { total: 7, used: casualUsed, remaining: 7 - casualUsed },
      shortLeave: { used: shortLeaveCount, limit: 2 },
    });
  };

  const handleApprove = async (id: string) => {
    const result = await approveLeaveRequest(id);
    if (result.success) {
      toast.success("Leave request approved");
      loadLeaveRequests();
    } else {
      toast.error(result.error || "Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    const result = await rejectLeaveRequest(id, "Not approved");
    if (result.success) {
      toast.success("Leave request rejected");
      loadLeaveRequests();
    } else {
      toast.error(result.error || "Failed to reject");
    }
  };

  const getLeaveTypeBadge = (type: string, subType?: string) => {
    if (type === "ANNUAL_LEAVE") {
      return <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">Annual</span>;
    }
    return <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">Casual</span>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 gap-1">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getDetailText = (leave: LeaveRequest) => {
    if (leave.isShortLeave) return "Short Leave";
    if (leave.casualSubType) {
      return leave.casualSubType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }
    return "-";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Leave Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Request and manage your time off
          </p>
        </div>
        <Button size="sm" onClick={() => setShowRequestModal(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Request Time Off
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Annual Leave */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Annual Leave
              </span>
            </div>
            <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-zinc-900 dark:text-white">
                {balances.annual.remaining}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Available
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(balances.annual.remaining / balances.annual.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {balances.annual.used} days used
            </p>
          </div>
        </div>

        {/* Casual Leave */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Casual Leave
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-zinc-900 dark:text-white">
                {balances.casual.remaining}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Available
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-orange-600 dark:bg-orange-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(balances.casual.remaining / balances.casual.total) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {balances.casual.used} days used
            </p>
          </div>
        </div>

        {/* Short Leave */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Short Leave
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-zinc-900 dark:text-white">
                {balances.shortLeave.used}/{balances.shortLeave.limit}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Used this Month
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {balances.shortLeave.limit - balances.shortLeave.used} remaining
            </p>
          </div>
        </div>
      </div>

      {/* Master Table */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Tabs & Filters */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("my")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                  activeTab === "my"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Heart className="h-4 w-4" />
                My Requests
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                  activeTab === "all"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <FileText className="h-4 w-4" />
                All Requests
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-3">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800"
            >
              <option value="current">Current Month</option>
              <option value="last">Last Month</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800"
            >
              <option value="all">All Types</option>
              <option value="annual">Annual</option>
              <option value="casual">Casual</option>
              <option value="short">Short Leave</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {activeTab === "all" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                    Employee
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Detail
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={activeTab === "all" ? 7 : 6} className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Loading...
                  </td>
                </tr>
              ) : leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === "all" ? 7 : 6} className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    {activeTab === "all" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                            <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-zinc-900 dark:text-white">
                              {request.employee.firstName} {request.employee.lastName}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {request.employee.department || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      {getLeaveTypeBadge(request.leaveType, request.casualSubType)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                      {getDetailText(request)}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                      {request.isShortLeave ? "Short Leave" : `${request.totalDays} Day${request.totalDays !== 1 ? "s" : ""}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">
                      {new Date(request.startDate).toLocaleDateString()}
                      {request.totalDays > 1 && ` - ${new Date(request.endDate).toLocaleDateString()}`}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {request.status === "PENDING" && activeTab === "all" && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleApprove(request.id)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <LeaveRequestModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={loadLeaveRequests}
          balances={balances}
        />
      )}
    </div>
  );
}

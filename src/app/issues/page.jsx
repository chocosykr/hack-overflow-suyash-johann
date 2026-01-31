"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Filter, Loader2, Building2,
  ExternalLink, Clock, ArrowLeft, ArrowUpDown,
  ChevronLeft, ChevronRight
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [error, setError] = useState(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryObj = {
        search,
        sort: sortOrder,
        page: pagination.page.toString(),
        limit: "15",
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        ...(visibilityFilter !== "ALL" && { visibility: visibilityFilter.toLowerCase() }),
      };

      const query = new URLSearchParams(queryObj).toString();
      const res = await fetch(`/api/issues?${query}`);
      const json = await res.json();

      if (json.data) {
        setIssues(json.data);
        setPagination(prev => ({
          ...prev,
          totalPages: json.meta?.totalPages || 1
        }));
      } else {
        setIssues([]);
        setError(json.error || "Failed to load issues");
      }
    } catch (err) {
      setIssues([]);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
    // FIXED: Added visibilityFilter to dependencies
  }, [search, statusFilter, sortOrder, pagination.page, visibilityFilter]);

  // FIXED: Reset page to 1 whenever ANY filter changes
  useEffect(() => {
    setPagination(p => ({ ...p, page: 1 }));
  }, [search, statusFilter, sortOrder, visibilityFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchIssues, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchIssues]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors w-fit group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issue Management</h1>
            <p className="text-gray-500 text-sm italic">
              Displaying {issues.length} records on this page
            </p>
          </div>
        </header>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Title or Hostel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none bg-gray-50 font-medium cursor-pointer"
          >
            <option value="ALL">All Visibility</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none bg-gray-50 font-medium cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none bg-gray-50 font-medium cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Issue Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Logged</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{issue.title || "No Title"}</div>
                      <div className="text-[10px] font-mono text-gray-400 mt-1">#{issue.id.slice(-8).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs">
                          {issue.hostel?.name || "N/A"} — {issue.block?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${issue.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                        issue.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-50 border-gray-100'
                        }`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${issue.visibility === 'PUBLIC'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : 'bg-purple-50 text-purple-600 border-purple-100'
                        }`}>
                        {issue.visibility}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/issues/${issue.id}`} className="text-gray-400 hover:text-blue-600 p-2 inline-block transition-transform hover:scale-110">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-32 text-center text-gray-400 italic">
                      No issues match these criteria.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page === 1 || loading}
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


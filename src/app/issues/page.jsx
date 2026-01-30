"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Search, Filter, Loader2, Building2, 
  ExternalLink, AlertCircle, Clock, ArrowLeft, ArrowUpDown 
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
 
export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest"); // New state for sorting
  const [error, setError] = useState(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        search: search,
        sort: sortOrder, // Pass sort order to API
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        unresolved: statusFilter === "ALL" ? "false" : "true" 
      });
      
      const res = await fetch(`/api/issues?${query.toString()}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setIssues(data);
      } else {
        setIssues([]);
        setError(data.error || "Failed to load issues");
      }
    } catch (err) {
      setIssues([]);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortOrder]); // Add sortOrder to dependencies

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
            <p className="text-gray-500 text-sm">Reviewing {issues.length} total reports</p>
          </div>
        </header>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ID, Title, or Hostel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Date Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="newest">Latest First</option>
              <option value="oldest">Earliest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-100 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b">
              <tr>
                <th className="px-6 py-4">Issue Details</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Logged</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(issues) && issues.length > 0 ? (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{issue.title || "No Title"}</div>
                      <div className="text-[10px] font-mono text-gray-400 mt-1 uppercase">#{issue.id.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2 italic">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {issue.hostelName} - {issue.blockName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                        issue.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                        issue.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100'
                      }`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-32 text-center text-gray-400 italic">
                      No issues match these criteria.
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
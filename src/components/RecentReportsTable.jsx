"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Building2, MoreHorizontal, ChevronDown, Loader2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import Link from "next/link";

export default function RecentReportsTable() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  // The Fetch function
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      // Calling the API route we updated earlier
      const response = await fetch(`/api/issues?sort=${sortOrder}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch issues");

      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  // Re-run fetch whenever sortOrder changes
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden" aria-labelledby="recent-reports">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-4">
          <h3 id="recent-reports" className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Recent Reports
          </h3>

          {/* Sorting Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={loading}
              className="appearance-none bg-white pl-2 pr-8 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer disabled:opacity-50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 pointer-events-none text-gray-400" />
          </div>
        </div>

        <Link
          href="/issues"
          className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
        >
          View All Issues
        </Link>
      </div>

      <div className="overflow-x-auto min-h-50 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}

        <table className="w-full text-sm text-left" role="table">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-200">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Logged</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">
                    {issue.id.substring(0, 8)}...
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">{issue.category || "General"}</td>
                  <td className="px-5 py-3 text-gray-600 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    {issue.hostelName} {issue.blockName}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold ${issue.priority === "HIGH"
                          ? "text-red-600"
                          : issue.priority === "MEDIUM"
                            ? "text-amber-600"
                            : "text-gray-500"
                        }`}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-900 transition">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-gray-400 italic">
                    No reports found.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
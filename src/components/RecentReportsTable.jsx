"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Building2, 
  MoreHorizontal, 
  ChevronDown, 
  History, 
  ArrowUpRight,
  MapPin,
  Clock
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import Link from "next/link";

// --- Sub-components ---

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td colSpan={7} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
        </td>
      </tr>
    ))}
  </>
);

const ReportRow = ({ issue }) => {
  const priorityStyles = {
    HIGH: "text-red-600 bg-red-50 border-red-100",
    MEDIUM: "text-amber-600 bg-amber-50 border-amber-100",
    LOW: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <tr className="hover:bg-blue-50/30 transition-colors group">
      <td className="px-6 py-4">
        <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase">
          #{issue.id.substring(0, 6)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          {/* UPDATED: Accessing nested relational data */}
          <span className="text-sm font-semibold text-gray-900">
            {issue.category?.name || "Maintenance"}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Issue Type</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="p-1.5 bg-gray-100 rounded-md">
            <MapPin size={12} className="text-gray-400" />
          </div>
          {/* UPDATED: Accessing nested relational data */}
          <span className="text-sm">
            {issue.hostel?.name || "N/A"} 
            <span className="text-gray-300 mx-1">•</span> 
            {issue.block?.name || "N/A"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${priorityStyles[issue.priority] || "text-gray-500 bg-gray-50 border-gray-100"}`}>
          {issue.priority}
        </span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={issue.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={12} />
          <span className="text-xs font-medium">{new Date(issue.createdAt).toLocaleDateString()}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-blue-600 border border-transparent hover:border-gray-200 transition-all">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  );
};

// --- Main Component ---

export default function RecentReportsTable() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // Limit set to 10 for dashboard view
      const response = await fetch(`/api/issues?sort=${sortOrder}&limit=10`);
      if (!response.ok) throw new Error("Fetch failed");
      
      const json = await response.json();
      
      // FIXED: Access the 'data' property of the paginated response
      setReports(json.data || []);
      
    } catch (error) {
      console.error("Dashboard Table Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <header className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <History size={14} className="text-blue-500" />
              Live Activity
            </h3>
          </div>

          <div className="h-4 w-px bg-gray-200 mx-2" />

          <div className="relative group">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-gray-50 pl-3 pr-8 py-1.5 text-[11px] font-bold text-gray-500 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer uppercase transition-all hover:bg-gray-100"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        <Link
          href="/issues"
          className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider group"
        >
          Detailed Log
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Reference</th>
              <th className="px-6 py-4">Inquiry</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Urgency</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <TableSkeleton />
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <ReportRow key={report.id} issue={report} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <History size={32} className="text-gray-200" />
                    <p className="text-sm text-gray-400 italic font-medium">Clear history: No reports found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
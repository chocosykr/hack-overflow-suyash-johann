"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Building2, 
  MoreHorizontal, 
  ChevronDown, 
  History, 
  ArrowUpRight,
  MapPin,
  Clock,
  Circle
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import Link from "next/link";

// --- Sub-components ---

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td colSpan={7} className="px-6 py-6">
          <div className="h-4 bg-slate-50 rounded-lg w-full"></div>
        </td>
      </tr>
    ))}
  </>
);

const ReportRow = ({ issue }) => {
  const priorityStyles = {
    HIGH: "text-rose-600 bg-rose-50 border-rose-100",
    MEDIUM: "text-amber-600 bg-amber-50 border-amber-100",
    LOW: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-all group border-b border-slate-50 last:border-0">
      <td className="px-6 py-4">
        <span className="font-mono text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 uppercase shadow-sm group-hover:border-blue-200 transition-colors">
          #{issue.id.substring(0, 6)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
            {issue.category?.name || "Maintenance"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Category</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
            <MapPin size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">
                {issue.hostel?.name || "N/A"}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {issue.block?.name || "N/A"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${priorityStyles[issue.priority] || "text-slate-500 bg-slate-50 border-slate-100"}`}>
          {issue.priority}
        </span>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={issue.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-slate-600">
                <Clock size={12} className="text-slate-300" />
                <span className="text-[11px] font-bold">
                    {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
            </div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter ml-4">
                {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 hover:bg-white hover:shadow-md rounded-xl text-slate-300 hover:text-blue-600 border border-transparent hover:border-slate-100 transition-all active:scale-90">
          <MoreHorizontal size={18} />
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
      const response = await fetch(`/api/issues?sort=${sortOrder}&limit=10`);
      if (!response.ok) throw new Error("Fetch failed");
      const json = await response.json();
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
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <header className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2.5">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <History size={16} className="text-blue-600" />
              </div>
              Live Activity
            </h3>
          </div>

          <div className="h-6 w-px bg-slate-100" />

          <div className="relative group">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-slate-50 pl-4 pr-10 py-2 text-[10px] font-black text-slate-500 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50/50 cursor-pointer uppercase transition-all hover:bg-slate-100/50"
            >
              <option value="newest">Latest Feed</option>
              <option value="oldest">Archive Sort</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        <Link
          href="/issues"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black text-blue-600 hover:bg-blue-600 hover:text-white uppercase tracking-widest transition-all group"
        >
          Detailed Log
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50/30 text-slate-400 uppercase text-[9px] font-black tracking-[0.15em] border-b border-slate-50">
            <tr>
              <th className="px-8 py-5">Ref ID</th>
              <th className="px-6 py-5">Inquiry Type</th>
              <th className="px-6 py-5">Node / Location</th>
              <th className="px-6 py-5">Urgency</th>
              <th className="px-6 py-5">State</th>
              <th className="px-6 py-5">Timestamp</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <TableSkeleton />
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <ReportRow key={report.id} issue={report} />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-50 rounded-[2rem]">
                        <History size={40} className="text-slate-200" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Clear: No Logs Detected</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer Status Bar */}
      <footer className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Gateway Connected</span>
        </div>
        <span className="text-[9px] font-black text-slate-300 uppercase italic">Showing {reports.length} of 10 results</span>
      </footer>
    </section>
  );
}
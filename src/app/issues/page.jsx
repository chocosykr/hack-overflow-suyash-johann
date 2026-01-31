"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, Filter, Loader2, Building2,
  ExternalLink, Clock, ArrowLeft,
  ChevronLeft, ChevronRight, Hash,
  Eye, EyeOff, ListFilter, Activity
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
  }, [search, statusFilter, sortOrder, pagination.page, visibilityFilter]);

  useEffect(() => {
    setPagination(p => ({ ...p, page: 1 }));
  }, [search, statusFilter, sortOrder, visibilityFilter]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchIssues, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchIssues]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan-600 transition-all w-fit group bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Return to Command
        </Link>

        <header className="flex justify-between items-end">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Issue Registry</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Centralized Audit Log — {issues.length} Nodes Loaded
              </p>
            </div>
          </div>
        </header>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="SEARCH REGISTRY..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-cyan-50 outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-2xl border border-slate-100">
            <ListFilter size={14} className="text-slate-400 ml-2" />
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest px-2 py-1 outline-none cursor-pointer text-slate-600"
            >
              <option value="ALL">All Visibility</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest px-4 py-2.5 outline-none text-slate-600 cursor-pointer shadow-sm"
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
            className="bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest px-4 py-2.5 outline-none text-white cursor-pointer shadow-lg shadow-slate-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto relative min-h-100">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-4 text-slate-400">Syncing Registry...</span>
            </div>
          )}

          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-8 py-5">Issue Metadata</th>
                <th className="px-8 py-5">Node Origin</th>
                <th className="px-8 py-5">Urgency</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Access</th>
                <th className="px-8 py-5 text-right">Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issues.length > 0 ? (
                issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition-all group cursor-default">
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-800 uppercase tracking-tight text-xs group-hover:text-cyan-700 transition-colors">
                        {issue.title || "Untitled Node"}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Hash size={10} className="text-slate-300" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          ID-{issue.id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                            {issue.hostel?.name || "N/A"}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase ml-5 tracking-widest">
                          {issue.block?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${
                        issue.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-100 shadow-sm shadow-rose-500/10' :
                        issue.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border uppercase text-[9px] font-black tracking-widest ${
                          issue.visibility === 'PUBLIC'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                          : 'bg-slate-900 text-white border-slate-800 shadow-md'
                        }`}>
                        {issue.visibility === 'PUBLIC' ? <Eye size={10} /> : <EyeOff size={10} />}
                        {issue.visibility}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link href={`/issues/${issue.id}`} className="inline-flex p-2.5 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-cyan-600 hover:border-cyan-100 hover:shadow-md transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-40 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-5 bg-slate-50 rounded-full">
                          <Search size={32} className="text-slate-200" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                          No records match active filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Sequence {pagination.page} <span className="mx-2 opacity-30">/</span> {pagination.totalPages}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page === 1 || loading}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm flex items-center gap-2"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.totalPages, p.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm flex items-center gap-2"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
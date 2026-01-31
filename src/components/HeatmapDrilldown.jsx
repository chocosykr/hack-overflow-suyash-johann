'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { BarChart3, ListFilter, AlertCircle, ChevronRight, Activity, Hash, Layers } from 'lucide-react';

export default function HeatmapDrilldown({ hostel, block }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hName = typeof hostel === 'object' ? hostel.name : hostel;
  const bName = typeof block === 'object' ? block.name : block;

  useEffect(() => {
    if (!hName || !bName) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/analytics/hostel-heatmap?hostel=${encodeURIComponent(hName)}&block=${encodeURIComponent(bName)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch drilldown data");
        const payload = await res.json();
        setIssues(payload.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hName, bName]);

  const categoryStats = useMemo(() => {
    const counts = {};
    issues.forEach(issue => {
      const cat = issue.category?.name || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [issues]);

  if (!hName || !bName) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
          <Layers className="w-8 h-8 text-gray-200" />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed max-w-40">
          Select a block to visualize density
        </p>
      </div>
    );
  }

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing Node...</span>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-rose-500" />
      <span className="text-[10px] font-black text-rose-600 uppercase tracking-tight">{error}</span>
    </div>
  );

  return (
    <div className="p-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Card */}
      <div className="relative p-6 bg-slate-900 rounded-2xl overflow-y-auto shadow">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-16 h-16 text-cyan-400" />
        </div>
        <div className="relative z-10">
          <h4 className="text-base font-black text-white uppercase tracking-tight mb-2">
            {hName} — {bName.startsWith('Block') ? bName : `Block ${bName}`}
          </h4>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500 rounded-xl text-[10px] font-black text-white uppercase shadow-lg shadow-cyan-500/20">
              {issues.length} Issues
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drilldown Active</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ListFilter className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Frequency Graph</span>
          </div>
          <span className="text-[9px] font-bold text-slate-300 uppercase italic">Updated Live</span>
        </div>

        {categoryStats.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase italic">No active reports found</p>
          </div>
        ) : (
          <div className="space-y-5 px-1">
            {categoryStats.map((item) => {
              const percentage = (item.count / issues.length) * 100;
              return (
                <div key={item.name} className="group">
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-tight">{item.name}</span>
                    <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-100">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-cyan-400 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Feed Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Hash className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</span>
        </div>
        <div className="space-y-3">
          {issues.slice(0, 4).map(issue => (
            <div
              key={issue.id}
              className="group p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
              onClick={() => window.location.href = `/issues/${issue.id}`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-700 truncate max-w-45 group-hover:text-slate-900 transition-colors tracking-tight">
                  {issue.title}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">View Details</span>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { BarChart3, ListFilter, AlertCircle, ChevronRight } from 'lucide-react';

export default function HeatmapDrilldown({ hostel, block }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize inputs
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

  // Transform data for the bar graph
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
      <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
        <BarChart3 className="w-8 h-8 opacity-20" />
        <p className="text-sm italic">Select a block to analyze</p>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-sm text-gray-500 animate-pulse">Analyzing {hName} Block {bName}...</div>;
  if (error) return <div className="p-4 text-red-500 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header Info */}
      <div className="border-b pb-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">
          {hName} — Block {bName}
        </h4>
        <p className="text-[11px] text-gray-500 uppercase font-bold">{issues.length} Active Complaints</p>
      </div>

      {/* Bar Chart Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-400">
          <ListFilter className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase">Issues by Category</span>
        </div>
        
        {categoryStats.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-4">No data available for this section.</p>
        ) : (
          <div className="space-y-3">
            {categoryStats.map((item) => {
              const percentage = (item.count / issues.length) * 100;
              return (
                <div key={item.name} className="group">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-gray-700">{item.name}</span>
                    <span className="text-gray-400">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-red-500 h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Glance List */}
      <div className="pt-4 border-t">
        <span className="text-[10px] font-bold text-gray-400 uppercase mb-3 block">Recent Reports</span>
        <div className="space-y-2">
          {issues.slice(0, 3).map(issue => (
            <div key={issue.id} className="p-2 bg-gray-50 rounded border border-gray-100 flex items-center justify-between group hover:border-red-200 transition-colors cursor-default">
              <span className="text-xs text-gray-700 truncate max-w-[150px]">{issue.title}</span>
              <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-red-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
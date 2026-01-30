"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function ResolutionStatusPie() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/status-distribution")
      .then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(json => {
        // Ensure we are setting an array even if API returns something else
        setData(Array.isArray(json) ? json : []);
      })
      .catch(err => {
        console.error("Failed to fetch resolution data:", err);
        setError(true);
      });
  }, []);

  // Defensive reduce: Check if data is an array first
  const total = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((acc, cur) => acc + (cur.value || 0), 0);
  }, [data]);

  if (error) {
    return <div className="bg-white p-5 rounded-lg border border-red-200 text-red-500 text-sm">Failed to load chart data.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm animate-pulse">Loading Chart...</div>;
  }

  return (
    <aside className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-75" aria-label="Resolution status">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Resolution Status</h3>
      <div className="flex-1 relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="50%" 
              innerRadius={55} 
              outerRadius={75} 
              paddingAngle={2} 
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][index % 4]} 
                  strokeWidth={0} 
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "4px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
            <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function ResolutionStatusPie() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/analytics/status-distribution")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Failed to fetch resolution data:", err));
  }, []);

  const total = useMemo(() => data.reduce((acc, cur) => acc + (cur.value || 0), 0), [data]);

  if (data.length === 0) {
    return <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">Loading...</div>;
  }

  return (
    <aside className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col" aria-label="Resolution status">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Resolution Status</h3>
      <div className="flex-1 min-h-50 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "4px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
            <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-6">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">{total}</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

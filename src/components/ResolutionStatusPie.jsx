"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PieChart as PieIcon } from "lucide-react";

export default function ResolutionStatusPie() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/status-distribution")
      .then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(json => {
        setData(Array.isArray(json) ? json : []);
      })
      .catch(err => {
        console.error("Failed to fetch resolution data:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(() => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((acc, cur) => acc + (cur.value || 0), 0);
  }, [data]);

  if (error) {
    return (
      <aside className="bg-white p-6 rounded-3xl border border-rose-100 flex items-center justify-center min-h-100">
        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Failed to load status data</p>
      </aside>
    );
  }

  return (
    <aside className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md flex flex-col min-h-100" aria-label="Resolution status">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <PieIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Resolution Status</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Real-time distribution</p>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data} 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={65} 
                  outerRadius={85} 
                  paddingAngle={5} 
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || ["#6366f1", "#f43f5e", "#10b981", "#f59e0b"][index % 4]} 
                      strokeWidth={0} 
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconType="circle"
                  iconSize={6} 
                  wrapperStyle={{ 
                    fontSize: "10px", 
                    fontWeight: "800", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.05em",
                    paddingTop: "20px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Counter */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-14">
              <div className="text-center">
                <span className="text-3xl font-black text-gray-900 block leading-none">{total}</span>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Issues</p>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
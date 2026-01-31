"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Layers } from "lucide-react";

export default function IssueDensityChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch("/api/analytics/categories")
      .then(res => res.json())
      .then(json => {
        if (!isMounted) return;
        setData(Array.isArray(json) ? json : []);
      })
      .catch(() => {
        if (isMounted) setData([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Issue Density
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Distribution by Category</p>
          </div>
        </div>
        
        {!loading && data.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Live Analysis</span>
          </div>
        )}
      </div>

      <div className="h-72 w-full">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calculating Density...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-center opacity-50">
            <p className="text-xs font-bold text-gray-400 uppercase">No categorical data found</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={40} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc", radius: 8 }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              />
              <Bar 
                dataKey="issues" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
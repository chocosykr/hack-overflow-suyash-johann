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
} from "recharts";

export default function IssueDensityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/analytics/categories")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch(() => {
        if (isMounted) setData([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Issue Density by Category
        </h3>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                boxShadow: "none",
              }}
            />
            <Bar dataKey="issues" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

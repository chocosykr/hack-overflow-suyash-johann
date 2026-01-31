"use client";

import React from "react";
import PropTypes from "prop-types";
import { ArrowUpRight } from "lucide-react";
 
const StatCard = React.memo(function StatCard({ title, value, subtext, Icon, trend }) {
  const isUp = trend === "up";
  const trendBg = isUp ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100";

  return (
    <div 
      className="relative overflow-hidden bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200 group" 
      role="group" 
      aria-label={`${title} stat`}
    >
      {/* Decorative Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full transition-transform group-hover:scale-150 duration-500 opacity-50" />

      <div className="relative flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
          <Icon className="w-5 h-5 text-gray-500 transition-colors" aria-hidden="true" />
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-bold ${trendBg}`}>
          <ArrowUpRight className={`w-3 h-3 transition-transform ${!isUp ? "rotate-180" : ""}`} aria-hidden="true" />
          <span>{subtext}</span>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">vs last week</span>
      </div>
    </div>
  );
});

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtext: PropTypes.string,
  Icon: PropTypes.elementType.isRequired,
  trend: PropTypes.oneOf(["up", "down"]),
};

export default StatCard;
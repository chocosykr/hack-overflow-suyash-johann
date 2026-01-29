"use client";

import React from "react";
import PropTypes from "prop-types";
import { ArrowUpRight } from "lucide-react";

const StatCard = React.memo(function StatCard({ title, value, subtext, Icon, trend }) {
  const trendClass = trend === "up" ? "text-green-600" : "text-red-600";
  return (
    <div className="bg-white p-5 hover:bg-gray-100" role="group" aria-label={`${title} stat`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
          <Icon className="w-5 h-5 text-gray-600" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span className={`font-medium ${trendClass} flex items-center`}>
          <span className="sr-only">Trend</span>
          <ArrowUpRight className={`w-3 h-3 ml-1 transform ${trend === "down" ? "rotate-180" : ""}`} aria-hidden="true" />
          <span className="ml-2">{subtext}</span>
        </span>
        <span className="text-gray-400 ml-2">vs last week</span>
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

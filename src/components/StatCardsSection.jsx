"use client";

import React from "react";
import PropTypes from "prop-types";
import StatCard from "./StatCard";
import { AlertCircle, Clock, CheckCircle2, Users, BarChart3 } from "lucide-react";

export default function StatCardsSection({ summary }) {
  // Logic to determine subtext based on trend/data could go here
  // For now, using placeholders that match your StatCard props
  
  return (
    <section aria-labelledby="metrics-title" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <BarChart3 className="w-4 h-4 text-gray-500" />
          </div>
          <h2 id="metrics-title" className="text-sm font-black uppercase tracking-widest text-gray-400">
            System Metrics
          </h2>
        </div>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
          Real-time Data
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Issues"
          value={summary?.activeIssues ?? "0"}
          subtext="+12%"
          Icon={AlertCircle}
          trend="up"
        />
        <StatCard
          title="Avg. Resolution"
          value={summary?.avgResolution ? `${summary.avgResolution}h` : "--"}
          subtext="-4h"
          Icon={Clock}
          trend="down"
        />
        <StatCard
          title="Resolved (Mo)"
          value={summary?.resolvedThisMonth ?? "0"}
          subtext="+18%"
          Icon={CheckCircle2}
          trend="up"
        />
        <StatCard
          title="Total Occupancy"
          value={summary?.occupancy ? `${summary.occupancy}%` : "0%"}
          subtext="+2%"
          Icon={Users}
          trend="up"
        />
      </div>
    </section>
  );
}

StatCardsSection.propTypes = { 
  summary: PropTypes.shape({
    activeIssues: PropTypes.number,
    avgResolution: PropTypes.number,
    resolvedThisMonth: PropTypes.number,
    occupancy: PropTypes.number,
  }) 
};
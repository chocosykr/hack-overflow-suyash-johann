"use client";

import React from "react";
import PropTypes from "prop-types";
import StatCard from "./StatCard"; // extract StatCard from your current file
import { AlertCircle, Clock, CheckCircle2, Users } from "lucide-react";

export default function StatCardsSection({ summary }) {
  return (
    <section aria-labelledby="metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Issues"
        value={summary?.activeIssues ?? "-"}
        Icon={AlertCircle}
        trend="up"
      />
      <StatCard
        title="Avg. Resolution"
        value={summary?.avgResolution ?? "-"}
        Icon={Clock}
        trend="down"
      />
      <StatCard
        title="Resolved (Mo)"
        value={summary?.resolvedThisMonth ?? "-"}
        Icon={CheckCircle2}
        trend="up"
      />
      <StatCard
        title="Occupancy"
        value={summary?.occupancy ?? "-"}
        Icon={Users}
        trend="up"
      />
    </section>
  );
}
 
StatCardsSection.propTypes = { summary: PropTypes.object };

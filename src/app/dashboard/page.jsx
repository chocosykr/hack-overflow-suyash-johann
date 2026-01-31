"use client";

import React from "react";
import StatCardsSection from "../../components/StatCardsSection";
import IssueDensityChart from "../../components/IssueDensityChart";
import ResolutionStatusPie from "../../components/ResolutionStatusPie";
import RecentReportsTable from "../../components/RecentReportsTable";
import HostelHeatmap from "../../components/HostelHeatmap";
import LostAndFoundSection from "../../components/LostAndFoundSection";
import AnnouncementCreator from "../../components/AnnouncementCreator";
import DashboardHeader from "../../components/DashboardHeader";

// 🔹 IMPORT THE NEW COMPONENT
import HeatmapDrilldown from "../../components/HeatmapDrilldown";

// mock data imports
import { categoryData, statusData, recentIssues, lostFoundItems } from "../../components/mockData";

export default function Page() {
  const [summary, setSummary] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [showAnnouncementForm, setShowAnnouncementForm] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/analytics/summary")
      .then(res => res.json())
      .then(setSummary);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6 font-sans">
      {/* STATUS BAR / HEADER */}
      <DashboardHeader />

      {/* THE DROPDOWN COMPONENT */}
      {showAnnouncementForm && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <AnnouncementCreator onClose={() => setShowAnnouncementForm(false)} />
        </div>
      )}

      {/* KPI cards */}
      <StatCardsSection summary={summary} />

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <IssueDensityChart data={categoryData} />
        <ResolutionStatusPie data={statusData} />
      </section>

      {/* Heatmap + Drilldown */}
      <HostelHeatmap
        onCellClick={({ hostel, block }) => setSelected({ hostel, block })}
        rightPane={
          /* 🔹 REPLACED LOCAL DRILLDOWN WITH THE NEW STANDALONE COMPONENT */
          <HeatmapDrilldown 
            hostel={selected?.hostel} 
            block={selected?.block} 
          />
        }
      />

      {/* Recent issues */}
      <RecentReportsTable issues={recentIssues} />

      <LostAndFoundSection items={lostFoundItems} />
    </main>
  );
}
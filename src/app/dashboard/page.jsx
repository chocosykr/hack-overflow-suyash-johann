"use client";

import React from "react";
import StatCardsSection from "../../components/StatCardsSection";
import IssueDensityChart from "../../components/IssueDensityChart";
import ResolutionStatusPie from "../../components/ResolutionStatusPie";
import RecentReportsTable from "../../components/RecentReportsTable";
import HostelHeatmap from "../../components/HostelHeatmap";
import { Filter, Download } from "lucide-react";
import LostAndFoundSection from "../../components/LostAndFoundSection";

// mock data imports
import { categoryData, statusData, recentIssues, lostFoundItems } from "../../components/mockData";

/* Simple drill-down placeholder */
function DrilldownIssues({ hostel, block }) {
  const [issues, setIssues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Normalize inputs: extract the name if they are objects
  const hostelName = typeof hostel === 'object' ? hostel.name : hostel;
  const blockName = typeof block === 'object' ? block.name : block;

  React.useEffect(() => {
    // Use the normalized strings for the check and the fetch
    if (!hostelName || !blockName) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // 1. EXTRACT THE NAMES: Ensure we are sending strings, not objects
        const hName = typeof hostel === 'object' ? hostel.name : hostel;
        const bName = typeof block === 'object' ? block.name : block;

        // 2. BUILD THE URL: Using the strings
        // Add &unresolved=true to the URL to match the Heatmap's likely logic
        // Add unresolved=false to ensure the list shows EVERYTHING the heatmap counted
        const url = `/api/issues?hostel=${encodeURIComponent(hName)}&block=${encodeURIComponent(bName)}&unresolved=false`;
        const res = await fetch(url, { signal });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`API error: ${res.status} ${txt}`);
        }

        // Inside DrilldownIssues load() function
        const payload = await res.json();
        setIssues(payload.data || []); // matches the new API return key

      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load issues");
          setIssues([]);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [hostelName, blockName]); // Depend on strings, not objects

  if (!hostelName || !blockName) {
    return <div className="text-sm text-gray-500">Select a block to view issues</div>;
  }

  if (loading) return <div className="text-sm text-gray-500">Loading issues…</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div>
      <h4 className="text-sm font-bold text-gray-900 mb-3">
        {/* FIXED: Rendering strings instead of objects */}
        Issues · {hostelName} / Block {blockName}
      </h4>

      {issues.length === 0 ? (
        <p className="text-sm text-gray-500">No issues found</p>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue) => (
            <li key={issue.id} className="p-3 border rounded-md text-sm hover:bg-gray-50">
              <div className="font-medium">{issue.title ?? issue.id}</div>
              <div className="text-xs text-gray-500">
                {/* Updated to handle nested category object */}
                {issue.category?.name || issue.category || "General"} · {issue.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default function Page() {
  const [summary, setSummary] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/analytics/summary")
      .then(res => res.json())
      .then(setSummary);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage infrastructure, track issues, and monitor resolution times.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
            + New announcement
          </button>
        </div>
      </header>

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
          selected ? (
            <DrilldownIssues hostel={selected.hostel} block={selected.block} />
          ) : null
        }
      />

      {/* Recent issues */}
      <RecentReportsTable issues={recentIssues} />

      <LostAndFoundSection items={lostFoundItems} />


    </main>
  );
}

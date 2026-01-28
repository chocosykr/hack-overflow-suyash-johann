"use client";

import React from "react";
import StatCardsSection from "../../components/StatCardsSection";
import IssueDensityChart from "../../components/IssueDensityChart";
import ResolutionStatusPie from "../../components/ResolutionStatusPie";
import RecentReportsTable from "../../components/RecentReportsTable";
import HostelHeatmap from "../../components/HostelHeatmap";
import { Filter, Download } from "lucide-react";

// mock data imports
import { categoryData, statusData, recentIssues } from "../../components/mockData";

/* Simple drill-down placeholder */
function DrilldownIssues({ hostel, block }) {
  const [issues, setIssues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!hostel || !block) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/issues?hostel=${encodeURIComponent(hostel)}&block=${encodeURIComponent(block)}`;
        const res = await fetch(url, { signal });

        // handle non-2xx
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`API error: ${res.status} ${txt}`);
        }

        const payload = await res.json();

        // normalize common shapes: array, {data: array}, {issues: array}
        let list = [];
        if (Array.isArray(payload)) {
          list = payload;
        } else if (payload?.data && Array.isArray(payload.data)) {
          list = payload.data;
        } else if (payload?.issues && Array.isArray(payload.issues)) {
          list = payload.issues;
        } else {
          // defensive fallback: try to extract plausible array from top-level fields
          const candidates = Object.values(payload).filter(v => Array.isArray(v));
          list = candidates[0] ?? [];
        }

        setIssues(list);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Drilldown load error:", err);
          setError(err.message || "Failed to load issues");
          setIssues([]); // ensure array
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [hostel, block]);

  if (!hostel || !block) {
    return <div className="text-sm text-gray-500">Select a block to view issues</div>;
  }

  if (loading) return <div className="text-sm text-gray-500">Loading issues…</div>;
  if (error) return <div className="text-sm text-red-600">Error: {error}</div>;

  return (
    <div>
      <h4 className="text-sm font-bold text-gray-900 mb-3">
        Issues · {hostel} / Block {block}
      </h4>

      {issues.length === 0 ? (
        <p className="text-sm text-gray-500">No issues found</p>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue) => (
            <li key={issue.id} className="p-3 border rounded-md text-sm hover:bg-gray-50">
              <div className="font-medium">{issue.title ?? issue.id}</div>
              <div className="text-xs text-gray-500">
                {issue.category ?? "—"} · {issue.status ?? "—"}
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
          <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
            + New Issue
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
    </main>
  );
}

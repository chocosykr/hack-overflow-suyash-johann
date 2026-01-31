"use client";

import React from "react";
import PropTypes from "prop-types";
import { Map, Info, ChevronRight, Activity } from "lucide-react";

export default function HostelHeatmap({ since, until, onCellClick, rightPane }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (since) params.set("since", since);
    if (until) params.set("until", until);

    fetch(`/api/analytics/hostel-heatmap?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load heatmap");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [since, until]);

  const { hostels, blocks, grid, maxCount } = React.useMemo(() => {
    const hostels = [...new Set(data.map(d =>
      typeof d.hostel === 'object' ? d.hostel.name : d.hostel
    ))].sort();

    const blocks = [...new Set(data.map(d =>
      typeof d.block === 'object' ? d.block.name : d.block
    ))].sort();

    const map = {};
    data.forEach(d => {
      const h = typeof d.hostel === 'object' ? d.hostel.name : d.hostel;
      const b = typeof d.block === 'object' ? d.block.name : d.block;
      map[h] ??= {};
      map[h][b] = d;
    });

    const grid = hostels.map(h =>
      blocks.map(b =>
        map[h]?.[b] ?? { hostel: h, block: b, count: 0 }
      )
    );

    const maxCount = Math.max(1, ...data.map(d => d.count ?? 0));
    return { hostels, blocks, grid, maxCount };
  }, [data]);

  function cellColor(count) {
    if (count === 0) return '#f9fafb';
    const t = Math.min(1, count / maxCount);
    // Using a sophisticated Indigo-to-Rose scale for high-end feel
    return `rgba(79, 70, 229, ${0.1 + t * 0.9})`;
  }

  if (loading) return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
      <div className="w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating Heatmap...</span>
    </div>
  );

  if (error) return (
    <div className="bg-white p-8 rounded-3xl border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest text-center">
      {error}
    </div>
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: HEATMAP */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Hostel Density</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight font-mono">Intensity by Block</p>
            </div>
          </div>
          <Info className="w-4 h-4 text-gray-300" />
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-100">
          <table className="w-full border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="p-1"></th>
                {blocks.map(b => (
                  <th key={b} className="p-1 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hostels.map((h, i) => (
                <tr key={h}>
                  <td className="pr-4 py-2 text-xs font-black text-gray-700 uppercase tracking-tight whitespace-nowrap">
                    {h}
                  </td>
                  {grid[i].map(cell => (
                    <td key={cell.block} className="p-0">
                      <button
                        className={`w-full aspect-square md:aspect-auto md:h-12 rounded-xl text-xs font-black transition-all hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center ${cell.count > 0 ? 'text-white' : 'text-gray-300 border border-dashed border-gray-100'
                          }`}
                        style={{ backgroundColor: cellColor(cell.count) }}
                        onClick={() => onCellClick?.({ hostel: cell.hostel, block: cell.block })}
                      >
                        {cell.count > 0 ? cell.count : ''}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT: DRILLDOWN PANEL */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col min-h-100 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Inspection</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {rightPane ?? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest max-w-37.5">
                Select a heatmap cell to drill down
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

HostelHeatmap.propTypes = {
  since: PropTypes.string,
  until: PropTypes.string,
  onCellClick: PropTypes.func,
  rightPane: PropTypes.node,
};
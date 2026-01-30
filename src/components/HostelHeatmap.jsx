"use client";

import React from "react";
import PropTypes from "prop-types"; 

/**
 * Layout:
 * | Heatmap (50%) | Drilldown Panel (50%) |
 *
 * Props:
 * - since, until (optional)
 * - onCellClick({ hostel, block })
 * - rightPane (ReactNode) -> drilldown results UI
 */
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
    const hostels = [...new Set(data.map(d => d.hostel))].sort();
    const blocks = [...new Set(data.map(d => d.block))].sort();

    const map = {};
    data.forEach(d => {
      map[d.hostel] ??= {};
      map[d.hostel][d.block] = d;
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
    const t = Math.min(1, count / maxCount);
    return `rgba(220,38,38,${0.15 + t * 0.75})`;
  }

  if (loading) return <div className="bg-white p-4 rounded border">Loading heatmap…</div>;
  if (error) return <div className="bg-white p-4 rounded border text-red-600">{error}</div>;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* LEFT: HEATMAP */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
          Hostel / Block Heatmap
        </h3>

        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th className="px-2 py-2 text-xs text-left text-gray-600">Hostel</th>
              {blocks.map(b => (
                <th key={b} className="px-2 py-2 text-xs text-center text-gray-600">
                  {b}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {hostels.map((h, i) => (
              <tr key={h}>
                <td className="px-2 py-2 text-sm font-medium text-gray-800 whitespace-nowrap">
                  {h}
                </td>
                {grid[i].map(cell => (
                  <td key={cell.block} className="px-2 py-2">
                    <button
                      className="w-full p-3 rounded-md text-sm font-semibold border transition hover:scale-[1.02]"
                      style={{ backgroundColor: cellColor(cell.count) }}
                      onClick={() => onCellClick?.({ hostel: cell.hostel, block: cell.block })}
                      title={`${cell.count} issues`}
                    >
                      {cell.count}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT: DRILLDOWN PANEL */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm min-h-75 max-h-75 overflow-y-auto">
        {rightPane ?? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">
            Select a block to view issues
          </div>
        )}
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

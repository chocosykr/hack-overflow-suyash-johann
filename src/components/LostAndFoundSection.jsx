"use client";

import React from "react";
import PropTypes from "prop-types";
import { PackageSearch, MapPin, Calendar, MoreHorizontal } from "lucide-react";

const StatusBadge = React.memo(function StatusBadge({ status }) {
  const styles = {
    LOST: "bg-red-50 text-red-700 border-red-200",
    FOUND: "bg-amber-50 text-amber-700 border-amber-200",
    RETURNED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
        styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
});

export default function LostAndFoundSection({ items }) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <header className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          Lost & Found
        </h3>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
          View All
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b">
            <tr>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900 flex items-center gap-2">
                  <PackageSearch className="w-4 h-4 text-gray-400" />
                  {item.title}
                </td>

                <td className="px-5 py-3 text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {item.location}
                </td>

                <td className="px-5 py-3 text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {item.date}
                </td>

                <td className="px-5 py-3">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-5 py-3 text-right">
                  <button className="p-1 rounded hover:bg-gray-200 text-gray-500">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

LostAndFoundSection.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["LOST", "FOUND", "RETURNED"]).isRequired,
    })
  ).isRequired,
};

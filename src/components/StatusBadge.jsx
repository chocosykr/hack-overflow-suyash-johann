// src/components/StatusBadge.jsx
import React from "react";
import PropTypes from "prop-types";

export default function StatusBadge({ status }) {
  const styles = {
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${styles[status] || "bg-gray-50 text-gray-700 border-gray-100"}`}
    >
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

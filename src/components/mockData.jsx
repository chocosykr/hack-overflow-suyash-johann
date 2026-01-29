export const categoryData = [
  { name: "Plumbing", issues: 45 },
  { name: "Electrical", issues: 30 },
  { name: "Internet", issues: 65 },
  { name: "Furniture", issues: 20 },
  { name: "Cleaning", issues: 50 },
];

export const statusData = [
  { name: "Resolved", value: 120, color: "#10b981" }, // Emerald-500
  { name: "In Progress", value: 45, color: "#f59e0b" }, // Amber-500
  { name: "Pending", value: 30, color: "#ef4444" }, // Red-500
];

export const recentIssues = [
  { id: "ISS-101", category: "Plumbing", location: "Block A - 302", status: "Pending", priority: "High", time: "2 hrs ago" },
  { id: "ISS-102", category: "Internet", location: "Block C - Library", status: "In Progress", priority: "Medium", time: "5 hrs ago" },
  { id: "ISS-103", category: "Electrical", location: "Block B - 101", status: "Resolved", priority: "Low", time: "1 day ago" },
  { id: "ISS-104", category: "Cleaning", location: "Block A - Corridor", status: "Pending", priority: "Medium", time: "1 day ago" },
  { id: "ISS-105", category: "Furniture", location: "Block D - Common", status: "In Progress", priority: "Low", time: "2 days ago" },
];

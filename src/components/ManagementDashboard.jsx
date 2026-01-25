"use client";

import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Building2,
  MoreHorizontal,
  ArrowUpRight,
  Filter,
  Download
} from "lucide-react";

// --- Mock Data ---
const categoryData = [
  { name: "Plumbing", issues: 45 },
  { name: "Electrical", issues: 30 },
  { name: "Internet", issues: 65 },
  { name: "Furniture", issues: 20 },
  { name: "Cleaning", issues: 50 },
];

const statusData = [
  { name: "Resolved", value: 120, color: "#10b981" }, // Emerald-500
  { name: "In Progress", value: 45, color: "#f59e0b" }, // Amber-500
  { name: "Pending", value: 30, color: "#ef4444" }, // Red-500
];

const recentIssues = [
  { id: "ISS-101", category: "Plumbing", location: "Block A - 302", status: "Pending", priority: "High", time: "2 hrs ago" },
  { id: "ISS-102", category: "Internet", location: "Block C - Library", status: "In Progress", priority: "Medium", time: "5 hrs ago" },
  { id: "ISS-103", category: "Electrical", location: "Block B - 101", status: "Resolved", priority: "Low", time: "1 day ago" },
  { id: "ISS-104", category: "Cleaning", location: "Block A - Corridor", status: "Pending", priority: "Medium", time: "1 day ago" },
  { id: "ISS-105", category: "Furniture", location: "Block D - Common", status: "In Progress", priority: "Low", time: "2 days ago" },
];

// --- Helper Components ---

const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs">
      <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
        {subtext} <ArrowUpRight className="w-3 h-3 ml-1" />
      </span>
      <span className="text-gray-400 ml-2">vs last week</span>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function ManagementDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-6 font-sans">
      
      {/* 1. Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Manage infrastructure, track issues, and monitor resolution times.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 font-medium transition shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 font-medium transition shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition shadow-sm">
            + New Issue
          </button>
        </div>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Issues" value="75" subtext="12%" icon={AlertCircle} trend="up" />
        <StatCard title="Avg. Resolution" value="24h 15m" subtext="8%" icon={Clock} trend="down" />
        <StatCard title="Resolved (Mo)" value="340" subtext="5%" icon={CheckCircle2} trend="up" />
        <StatCard title="Occupancy" value="1,250" subtext="2%" icon={Users} trend="up" />
      </div>

      {/* 3. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Issue Density by Category</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}} 
                  contentStyle={{borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: 'none'}} 
                />
                <Bar dataKey="issues" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Resolution Status</h3>
          <div className="flex-1 min-h-50 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '12px'}} />
                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-6">
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900">195</span>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Dense Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Reports</h3>
          <button className="text-xs font-medium text-blue-600 hover:text-blue-800">View All Issues</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Logged</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3 font-mono text-xs text-gray-600">{issue.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{issue.category}</td>
                  <td className="px-5 py-3 text-gray-600 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    {issue.location}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold ${
                      issue.priority === 'High' ? 'text-red-600' : 
                      issue.priority === 'Medium' ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{issue.time}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-900 transition">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
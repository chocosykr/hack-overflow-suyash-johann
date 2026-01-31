'use client'

import React, { useState } from "react";
import { Megaphone, Eye, History } from "lucide-react";
import AnnouncementCreator from "./AnnouncementCreator";
import AnnouncementList from "./AnnouncementList";
import StatusHistoryList from "./StatusHistoryList";

export default function DashboardHeader() {
  const [activeView, setActiveView] = useState(null); // 'create', 'view', 'history'

  const toggleView = (view) => setActiveView(activeView === view ? null : view);

  return (
    <div className="space-y-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Management Portal</h1>
          <p className="text-sm text-gray-500">Hostel Administration & Oversight</p>
        </div>

        <div className="flex gap-2">
          {/* STATUS HISTORY BUTTON */}
          <button
            onClick={() => toggleView('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${
              activeView === 'history' ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>

          {/* VIEW ALL BUTTON */}
          <button
            onClick={() => toggleView('view')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${
              activeView === 'view' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <Eye className="w-4 h-4" />
            View Notices
          </button>

          {/* NEW ANNOUNCEMENT BUTTON */}
          <button
            onClick={() => toggleView('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeView === 'create' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            New Announcement
          </button>
        </div>
      </header>

      {/* Conditional Rendering */}
      {activeView === 'create' && <AnnouncementCreator onClose={() => setActiveView(null)} />}
      {activeView === 'view' && <AnnouncementList />}
      {activeView === 'history' && <StatusHistoryList />}
    </div>
  );
}
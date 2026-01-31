'use client'

import React, { useState } from "react";
import { Megaphone, Eye, History, LayoutDashboard } from "lucide-react";
import AnnouncementCreator from "./AnnouncementCreator";
import AnnouncementList from "./AnnouncementList";
import StatusHistoryList from "./StatusHistoryList";

export default function DashboardHeader() {
  const [activeView, setActiveView] = useState(null); 

  const toggleView = (view) => setActiveView(activeView === view ? null : view);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Management Portal</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Hostel Administration & Oversight</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => toggleView('history')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              activeView === 'history' 
              ? "bg-purple-600 text-white border-purple-600 shadow-md" 
              : "bg-white text-gray-500 border-gray-100 hover:border-purple-200 hover:text-purple-600 shadow-sm"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>

          <button
            onClick={() => toggleView('view')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              activeView === 'view' 
              ? "bg-blue-600 text-white border-blue-600 shadow-md" 
              : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600 shadow-sm"
            }`}
          >
            <Eye className="w-4 h-4" />
            Live Notices
          </button>

          <button
            onClick={() => toggleView('create')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeView === 'create' 
              ? "bg-amber-100 text-amber-700 border border-amber-200" 
              : "bg-amber-600 text-white hover:bg-amber-700 shadow-md active:scale-95"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            New Broadcast
          </button>
        </div>
      </header>

      {/* Content Area - No more arrow here */}
      <div className="transition-all duration-300">
          {activeView === 'create' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <AnnouncementCreator onClose={() => setActiveView(null)} />
            </div>
          )}
          
          {activeView === 'view' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <AnnouncementList />
            </div>
          )}
          
          {activeView === 'history' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <StatusHistoryList />
            </div>
          )}
      </div>
    </div>
  );
}
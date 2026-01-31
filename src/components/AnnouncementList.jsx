'use client'
import React, { useEffect, useState } from 'react';
import { Bell, Pin, Clock, Megaphone, ChevronRight } from 'lucide-react';

export default function AnnouncementList() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then(res => res.json())
      .then(data => {
        setNotices(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-gray-400">Syncing feed...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-linear-to-r from-gray-50 to-white px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 rounded-lg">
            <Megaphone className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Notice Board</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md uppercase tracking-wider">
          {notices.length} Updates
        </span>
      </div>
      
      {/* Feed Area */}
      <div className="max-h-125 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {notices.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-6">
            <Bell className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-900">All caught up!</p>
            <p className="text-xs text-gray-400 mt-1">New announcements will appear here as they are published.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notices.map((notice) => (
              <div 
                key={notice.id} 
                className={`relative p-5 transition-all hover:bg-gray-50/80 group cursor-default ${
                  notice.isPinned ? 'bg-amber-50/20' : ''
                }`}
              >
                {/* Priority Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  notice.priority === 'HIGH' ? 'bg-red-500' : 
                  notice.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-400'
                }`} />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {notice.isPinned && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 rounded text-[9px] font-bold text-amber-700 uppercase tracking-tight">
                          <Pin className="w-2.5 h-2.5 fill-amber-700" />
                          Pinned
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900 text-[15px] truncate group-hover:text-amber-600 transition-colors">
                        {notice.title}
                      </h4>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                      {notice.content}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${notice.targetHostelId ? 'bg-purple-400' : 'bg-emerald-400'}`} />
                        {notice.targetHostelId ? "Targeted" : "Global Broadcast"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-black tracking-widest uppercase border ${
                      notice.priority === 'HIGH' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : notice.priority === 'MEDIUM'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {notice.priority}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
        <button className="text-[10px] font-bold text-gray-400 hover:text-amber-600 uppercase tracking-widest transition-colors">
          View All Archives
        </button>
      </div>
    </div>
  );
}
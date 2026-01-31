// src/components/AnnouncementList.jsx
'use client'
import React, { useEffect, useState } from 'react';
import { Bell, Pin, Clock } from 'lucide-react';

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

  if (loading) return <div className="p-4 text-center text-sm text-gray-500">Loading notices...</div>;

  return (
    <div className="w-full border rounded-xl bg-white shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Feed</span>
        <span className="text-xs text-gray-400">{notices.length} Updates</span>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notices.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No announcements found.</div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${notice.isPinned ? 'bg-amber-50/30' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 mb-1">
                  {notice.isPinned && <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />}
                  <h4 className="font-semibold text-gray-900">{notice.title}</h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  notice.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {notice.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notice.content}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{notice.targetHostelId ? "Targeted" : "Global"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
'use client'
import React, { useEffect, useState } from 'react';
import { History, ChevronRight, ArrowLeft, Clock, User, Tag, MessageSquare } from 'lucide-react';

export default function StatusHistoryList() {
  const [issuesWithLogs, setIssuesWithLogs] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null); // Stores the full issue history when clicked
  const [loading, setLoading] = useState(true);

  // Fetch unique issues that have history
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      const res = await fetch("/api/analytics/status-history");
      const data = await res.json();
      
      // Group logs by issueId for the "Master List"
      const grouped = data.reduce((acc, log) => {
        if (!acc[log.issueId]) {
          acc[log.issueId] = { 
            id: log.issueId, 
            title: log.issue?.title, 
            lastUpdate: log.createdAt,
            logs: [] 
          };
        }
        acc[log.issueId].logs.push(log);
        return acc;
      }, {});

      setIssuesWithLogs(Object.values(grouped));
      setLoading(false);
    }
    loadInitialData();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-purple-600">Accessing Audit Vault...</div>;

  // --- DETAIL VIEW: Timeline for one issue ---
  if (selectedIssue) {
    return (
      <div className="w-full border rounded-xl bg-white shadow-lg overflow-hidden animate-in slide-in-from-right-4 duration-300">
        <div className="bg-purple-700 p-4 flex items-center gap-4">
          <button onClick={() => setSelectedIssue(null)} className="p-1 hover:bg-purple-600 rounded-full text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-white">
            <h3 className="font-bold text-sm uppercase">History for #{selectedIssue.id.slice(-6)}</h3>
            <p className="text-xs text-purple-200">{selectedIssue.title}</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 max-h-[450px] overflow-y-auto">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-purple-200">
            {selectedIssue.logs.map((log) => (
              <div key={log.id} className="relative pl-12">
                <span className="absolute left-0 w-10 h-10 rounded-full border-4 border-white bg-purple-600 flex items-center justify-center shadow-sm">
                  <Clock className="w-4 h-4 text-white" />
                </span>
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      {log.toStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  {log.note && <p className="text-sm text-slate-600 italic mb-2">"{log.note}"</p>}
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> Changed by {log.changedBy?.name || "Admin"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- MASTER VIEW: List of Issues ---
  return (
    <div className="w-full border rounded-xl bg-white shadow-lg overflow-hidden animate-in fade-in duration-300">
      <div className="bg-slate-900 p-4 flex items-center gap-2 text-white">
        <History className="w-5 h-5" />
        <h3 className="font-bold text-sm uppercase tracking-widest">Select Issue to View Audit</h3>
      </div>
      
      <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
        {issuesWithLogs.map((item) => (
          <button 
            key={item.id}
            onClick={() => setSelectedIssue(item)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                #{item.id.slice(-3)}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500">Last activity: {new Date(item.lastUpdate).toLocaleDateString()}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
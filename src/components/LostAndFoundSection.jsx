"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  PackageSearch, 
  MapPin, 
  ChevronRight, 
  Clock, 
  User,
  RefreshCcw,
  Activity,
  Image as ImageIcon,
  ShieldCheck,
  X
} from "lucide-react";

// --- Sub-components ---

const Badge = ({ status }) => {
  const variants = {
    LOST: "bg-rose-50 text-rose-700 border-rose-100",
    FOUND: "bg-amber-50 text-amber-700 border-amber-100",
    RETURNED: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-500/10",
    APPROVED: "bg-cyan-50 text-cyan-700 border-cyan-100",
    PENDING: "bg-slate-50 text-slate-500 border-slate-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${variants[status] || variants.PENDING}`}>
      {status}
    </span>
  );
};

const ClaimCard = ({ claim, onApprove, isApproving }) => (
  <article className="group p-5 bg-white rounded-2xl border border-slate-100 transition-all hover:border-cyan-200 hover:shadow-md">
    <div className="flex justify-between items-start gap-6">
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-cyan-50 transition-colors">
            <User size={14} className="text-slate-400 group-hover:text-cyan-600" />
          </div>
          <div>
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight block leading-none">
                {claim.claimant?.name || "Anonymous User"}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Claimant Identity</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-50">
            {claim.description}
        </p>
        
        {claim.proofUrls?.length > 0 && (
          <div className="flex gap-2 mt-4">
            {claim.proofUrls.map((url, idx) => (
              <div key={idx} className="relative group/img overflow-hidden rounded-xl border border-slate-200">
                <img src={url} alt="Proof" className="w-16 h-16 object-cover transition-transform group-hover/img:scale-110" />
                <div className="absolute inset-0 bg-cyan-600/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ImageIcon size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-4">
        <Badge status={claim.status} />
        <button
          onClick={() => onApprove(claim.id)}
          disabled={claim.status === "APPROVED" || isApproving}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/10
            enabled:bg-cyan-600 enabled:text-white enabled:hover:bg-cyan-700 enabled:hover:-translate-y-0.5
            disabled:bg-slate-100 disabled:text-slate-400"
        >
          {isApproving ? "Validating..." : claim.status === "APPROVED" ? "Verified" : "Authorize"}
        </button>
      </div>
    </div>
  </article>
);

// --- Main Page Component ---

export default function LostAndFoundPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());

  const fetchLostItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/analytics/lost-items");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("L&F Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLostItems(); }, [fetchLostItems]);

  const handleApprove = async (itemId, claimId) => {
    if (approvingIds.has(claimId)) return;
    setApprovingIds(prev => new Set(prev).add(claimId));
    try {
      const res = await fetch(`/api/analytics/lost-items/${itemId}/claims/${claimId}/approve`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Approval failed");
      const updatedClaim = await res.json();

      setItems(prev => prev.map(item => item.id === itemId ? {
        ...item,
        status: updatedClaim.status === "APPROVED" ? "RETURNED" : item.status,
        claims: item.claims.map(c => c.id === claimId ? updatedClaim : c)
      } : item));

      setActiveItem(prev => prev?.id === itemId ? {
        ...prev,
        claims: prev.claims.map(c => c.id === claimId ? updatedClaim : c)
      } : prev);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setApprovingIds(prev => {
        const next = new Set(prev);
        next.delete(claimId);
        return next;
      });
    }
  };

  return (
    <main className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <header className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-cyan-50 rounded-2xl text-cyan-600">
                <PackageSearch size={22} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Inventory Tracker</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Asset & Claims Registry</p>
            </div>
        </div>
        <button 
          onClick={fetchLostItems}
          className="p-3 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-2xl transition-all border border-transparent hover:border-cyan-100"
        >
          <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-50">
            <tr>
              <th className="px-8 py-5">Asset Detail</th>
              <th className="px-8 py-5">Logged Origin</th>
              <th className="px-8 py-5">Timestamp</th>
              <th className="px-8 py-5">Current State</th>
              <th className="px-8 py-5 text-right">Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-6 bg-slate-50/10" />
                </tr>
              ))
            ) : items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => setActiveItem(item)}
                className="group hover:bg-slate-50/80 cursor-pointer transition-all"
              >
                <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-cyan-700">{item.title}</span>
                    </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <MapPin size={14} className="opacity-50" />
                    <span className="text-[11px] font-extrabold uppercase tracking-tight">{item.location}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Clock size={14} className="opacity-50" />
                    <span className="text-[10px] font-bold uppercase">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <Badge status={item.status} />
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="inline-flex p-2 bg-white rounded-xl border border-slate-100 text-slate-300 group-hover:text-cyan-600 group-hover:border-cyan-100 shadow-sm transition-all">
                    <ChevronRight size={18} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ItemDetailModal 
        item={activeItem} 
        onClose={() => setActiveItem(null)} 
        onApprove={handleApprove}
        approvingIds={approvingIds}
      />
    </main>
  );
}

function ItemDetailModal({ item, onClose, onApprove, approvingIds }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <section className="relative bg-slate-50 w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20">
        
        <header className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-slate-900 rounded-2xl text-white">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Registry Verification</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Log ID: {item.id.substring(0, 8)}</p>
            </div>
            <div className="ml-4">
                <Badge status={item.status} />
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors border border-transparent hover:border-slate-100">
            <X size={20} />
          </button>
        </header>

        <div className="p-10 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-12 custom-scrollbar">
          {/* Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest block mb-4">Core Identification</span>
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6">{item.title}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                  <span className="text-xs font-black text-slate-700 uppercase">{item.location}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Reported By</span>
                  <span className="text-xs font-black text-slate-700 uppercase">{item.reporter?.name || "Admin"}</span>
                </div>
              </div>
              <p className="mt-8 text-xs font-medium text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-4">
                "{item.description}"
              </p>
            </div>

            {item.imageUrls?.length > 0 && (
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Evidence Gallery</span>
                <div className="grid grid-cols-2 gap-3">
                  {item.imageUrls.map((u, i) => (
                    <img key={i} src={u} className="w-full h-40 object-cover rounded-2xl border border-white shadow-sm" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Claims Feed */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-cyan-500" />
                <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active Claims</h5>
              </div>
              <span className="px-3 py-1 bg-cyan-500 text-white text-[9px] font-black rounded-full uppercase tracking-tighter">
                {item.claims?.length || 0} Processing
              </span>
            </div>
            
            <div className="space-y-4">
              {item.claims?.length > 0 ? (
                item.claims.map((claim) => (
                  <ClaimCard 
                    key={claim.id} 
                    claim={claim} 
                    onApprove={(cid) => onApprove(item.id, cid)} 
                    isApproving={approvingIds.has(claim.id)}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <PackageSearch className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No verified claims logged</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
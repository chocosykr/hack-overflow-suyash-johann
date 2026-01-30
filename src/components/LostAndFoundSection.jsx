"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  PackageSearch, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  User,
  RefreshCcw
} from "lucide-react";

// --- Sub-components (Can be moved to separate files later) ---

const Badge = ({ status }) => {
  const variants = {
    LOST: "bg-red-50 text-red-700 border-red-100",
    FOUND: "bg-amber-50 text-amber-700 border-amber-100",
    RETURNED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    APPROVED: "bg-blue-50 text-blue-700 border-blue-100",
    PENDING: "bg-gray-50 text-gray-600 border-gray-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${variants[status] || variants.PENDING}`}>
      {status}
    </span>
  );
};

const ClaimCard = ({ claim, onApprove, isApproving }) => (
  <article className="group p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all hover:border-blue-200">
    <div className="flex justify-between items-start gap-4">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={12} className="text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{claim.claimant?.name || "Anonymous"}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{claim.description}</p>
        
        {claim.proofUrls?.length > 0 && (
          <div className="flex gap-2 mt-3">
            {claim.proofUrls.map((url, idx) => (
              <img key={idx} src={url} alt="Proof" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-3">
        <Badge status={claim.status} />
        <button
          onClick={() => onApprove(claim.id)}
          disabled={claim.status === "APPROVED" || isApproving}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all
            enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700 
            disabled:bg-gray-200 disabled:text-gray-400"
        >
          {isApproving ? "Processing..." : claim.status === "APPROVED" ? "Verified" : "Approve"}
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

      // Modern state update using functional map
      setItems(prev => prev.map(item => item.id === itemId ? {
        ...item,
        status: updatedClaim.status === "APPROVED" ? "RETURNED" : item.status,
        claims: item.claims.map(c => c.id === claimId ? updatedClaim : c)
      } : item));

      // Refresh modal view
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
    <main className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <header className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <div>
          <h3 className="text-base font-bold text-gray-900">Inventory Tracker</h3>
          <p className="text-xs text-gray-500 mt-0.5">Manage lost items and student claims</p>
        </div>
        <button 
          onClick={fetchLostItems}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
        >
          <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </header>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Item Detail</th>
              <th className="px-6 py-4">Origin</th>
              <th className="px-6 py-4">Reported</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-6 bg-gray-50/20" />
                </tr>
              ))
            ) : items.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => setActiveItem(item)}
                className="group hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-gray-800">
                  <div className="flex items-center gap-3">
                    <PackageSearch size={16} className="text-blue-500" />
                    {item.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 italic">
                  <time className="flex items-center gap-2">
                    <Clock size={14} />
                    {new Date(item.date).toLocaleDateString()}
                  </time>
                </td>
                <td className="px-6 py-4">
                  <Badge status={item.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal Component */}
      <ItemDetailModal 
        item={activeItem} 
        onClose={() => setActiveItem(null)} 
        onApprove={handleApprove}
        approvingIds={approvingIds}
      />
    </main>
  );
}

// Separate Modal Component for better performance and readability
function ItemDetailModal({ item, onClose, onApprove, approvingIds }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <section className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <header className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h4 className="text-xl font-bold text-gray-900">Item Registry</h4>
            <Badge status={item.status} />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">✕</button>
        </header>

        <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Item Info Column */}
          <div className="lg:col-span-2 space-y-6 border-r border-gray-100 pr-4">
            <div>
              <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Basic Info</h5>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{item.title}</h2>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                "{item.description}"
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-400">Reporter</span>
                <span className="font-semibold text-gray-900">{item.reporter?.name || "Hostel Admin"}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                <span className="text-gray-400">Location</span>
                <span className="font-semibold text-gray-900">{item.location}</span>
              </div>
            </div>

            {item.imageUrls?.length > 0 && (
              <div>
                <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Attachments</h5>
                <div className="grid grid-cols-2 gap-2">
                  {item.imageUrls.map((u, i) => (
                    <img key={i} src={u} className="w-full h-32 object-cover rounded-xl border hover:scale-[1.02] transition-transform" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Claims Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Student Claims</h5>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">
                {item.claims?.length || 0} Total
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
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                  <PackageSearch className="mx-auto text-gray-200 mb-3" size={40} />
                  <p className="text-sm text-gray-400">No verification claims yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
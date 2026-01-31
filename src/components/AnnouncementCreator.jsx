'use client'

import React, { useState, useEffect } from 'react'
import { Send, X, Megaphone, BellRing, Calendar, AlertTriangle, Pin } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function AnnouncementCreator({ onClose }) {
    const [loading, setLoading] = useState(false);
    const [hostels, setHostels] = useState([]);

    useEffect(() => {
        async function loadHostels() {
            try {
                const res = await fetch("/api/hostels");
                if (res.ok) {
                    const data = await res.json();
                    setHostels(data);
                }
            } catch (err) {
                console.error("Error loading hostels:", err);
            }
        }
        loadHostels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const payload = {
            title: formData.get("title"),
            content: formData.get("content"),
            targetHostelId: formData.get("targetHostelId") === "all" ? null : formData.get("targetHostelId"),
            priority: formData.get("priority"), // LOW, MEDIUM, HIGH
            isPinned: formData.get("isPinned") === "on", // Checkbox logic
            expiresAt: formData.get("expiresAt") || null,
        };

        try {
            const response = await fetch("/api/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create announcement");
            }

            onClose();
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-xl shadow-amber-900/5 mb-10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-400 to-orange-500" />
            
            <button 
                onClick={onClose} 
                className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-amber-100 rounded-xl">
                        <Megaphone className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Broadcast New Update</h3>
                        <p className="text-sm text-gray-500">Reach residents across specific hostels or globally.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Title */}
                    <div className="md:col-span-8 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Update Title</Label>
                        <Input 
                            name="title" 
                            placeholder="e.g. Emergency Water Maintenance" 
                            required 
                            className="h-11 border-gray-200 focus:ring-amber-500 focus:border-amber-500 rounded-xl shadow-sm"
                        />
                    </div>

                    {/* Target Hostel Dropdown */}
                    <div className="md:col-span-4 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Audience</Label>
                        <select
                            name="targetHostelId"
                            defaultValue="all"
                            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm font-medium"
                        >
                            <option value="all">All Hostels (Global)</option>
                            {hostels.map((hostel) => (
                                <option key={hostel.id} value={hostel.id}>
                                    {hostel.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Priority */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Priority Level</Label>
                        <select
                            name="priority"
                            defaultValue="MEDIUM"
                            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm font-medium"
                        >
                            <option value="LOW">Low / Info Only</option>
                            <option value="MEDIUM">Medium / Standard</option>
                            <option value="HIGH">High / Urgent Action</option>
                        </select>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Auto-Hide Date</Label>
                        <div className="relative">
                            <Input 
                                name="expiresAt" 
                                type="date" 
                                className="h-11 border-gray-200 rounded-xl focus:ring-amber-500 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Pinning */}
                    <div className="flex items-center space-x-3 pt-6 md:pt-8 group">
                        <div className="relative flex items-center justify-center">
                            <input 
                                type="checkbox" 
                                name="isPinned" 
                                id="isPinned" 
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 checked:bg-amber-600 checked:border-amber-600 transition-all" 
                            />
                            <Pin className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                        </div>
                        <Label htmlFor="isPinned" className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
                            Keep pinned to top
                        </Label>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Announcement Content</Label>
                    <textarea
                        name="content"
                        required
                        rows={4}
                        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm min-h-30"
                        placeholder="Provide the full details here. You can mention timings, locations, or contact persons..."
                    />
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-50">
                    <p className="text-[11px] text-gray-400 font-medium italic">
                        * Once sent, this update will be visible on the student dashboard.
                    </p>
                    <div className="flex gap-3">
                        <Button 
                            variant="ghost" 
                            type="button" 
                            onClick={onClose}
                            className="rounded-xl font-bold text-gray-500 hover:bg-gray-100 px-6 h-11"
                        >
                            Discard
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-11 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {loading ? "Publishing..." : "Send Announcement"}
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
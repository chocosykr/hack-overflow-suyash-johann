'use client'

import React, { useState, useEffect } from 'react'
import { Send, X, Megaphone, BellRing, Calendar } from 'lucide-react'
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
        <div className="w-full border-2 border-amber-200 rounded-xl bg-amber-50/50 p-6 mb-8 relative animate-in fade-in slide-in-from-top-4">
            <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-amber-200 rounded-full text-amber-600">
                <X className="w-4 h-4" />
            </button>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-bold text-amber-900">Broadcast New Update</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-2">
                        <Label>Title</Label>
                        <Input name="title" placeholder="e.g. Emergency Water Maintenance" required />
                    </div>

                    {/* Target Hostel Dropdown */}
                    <div className="space-y-2">
                        <Label>Target Hostel</Label>
                        <select
                            name="targetHostelId"
                            defaultValue="all"
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Priority */}
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        {/* Move "MEDIUM" here as the defaultValue */}
                        <select
                            name="priority"
                            defaultValue="MEDIUM"
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High / Urgent</option>
                        </select>
                    </div>

                    {/* Expiry Date */}
                    <div className="space-y-2">
                        <Label>Auto-Hide Date (Optional)</Label>
                        <Input name="expiresAt" type="date" />
                    </div>

                    {/* Pinning */}
                    <div className="flex items-center space-x-2 pt-8">
                        <input type="checkbox" name="isPinned" id="isPinned" className="w-4 h-4 accent-amber-600" />
                        <Label htmlFor="isPinned" className="cursor-pointer font-medium">Pin to top of feed</Label>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Announcement Message</Label>
                    <textarea
                        name="content"
                        required
                        rows={4}
                        className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="Provide full details here..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" type="button" onClick={onClose}>Discard</Button>
                    <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white min-w-[140px]">
                        {loading ? "Publishing..." : "Send Announcement"}
                        <Send className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
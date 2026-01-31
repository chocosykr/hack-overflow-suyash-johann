"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    User,
    MapPin,
    AlertCircle,
    Clock,
    Shield,
    Tag
} from "lucide-react";
import StatusBadge from "../../../components/StatusBadge";

export default function IssueDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchIssue() {
            // 🔹 Use the ID directly from useParams()
            if (!id) return;

            setLoading(true);
            try {
                // 🔹 Double check this path matches your folder structure
                const res = await fetch(`/api/issues/${id}`);
                const data = await res.json();

                if (data.success && data.issue) {
                    setIssue(data.issue);
                } else {
                    // This is what is currently triggering your "Not Found" UI
                    console.error("Backend reported failure:", data.error);
                    setIssue(null);
                }
            } catch (err) {
                console.error("Network error fetching issue:", err);
                setIssue(null);
            } finally {
                setLoading(false);
            }
        }
        fetchIssue();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">Loading issue details...</p>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
                <div className="bg-red-50 p-4 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Issue Not Found</h2>
                    <p className="text-gray-500 max-w-xs mx-auto mt-2">
                        The record you are looking for doesn't exist or has been removed.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/issues')}
                    className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                    Return to Management
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8">
            {/* Navigation & Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to List
                </button>

                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase border ${issue.visibility === 'PRIVATE'
                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                        <Shield className="w-3 h-3" /> {issue.visibility}
                    </span>
                    <StatusBadge status={issue.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Primary Details */}
                <div className="lg:col-span-2 space-y-8">
                    <header className="space-y-2">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {issue.title}
                        </h1>
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">ID: {issue.id}</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(issue.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </span>
                        </div>
                    </header>

                    <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            Detailed Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {issue.description || "No description provided by the reporter."}
                        </p>
                    </section>

                    {/* Activity Timeline */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activity Audit Log</h3>
                        <div className="relative border-l-2 border-gray-100 ml-4 pl-8 space-y-8 pb-4">
                            <div className="relative">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white shadow-sm" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Issue Created</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Status: {issue.status}
                                    </p>

                                    <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(issue.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Metadata Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6">
                        <div className="space-y-4">
                            {/* Priority */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Priority Level</label>
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${issue.priority === 'HIGH' || issue.priority === 'EMERGENCY'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                                    }`}>
                                    {issue.priority}
                                </span>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-bold text-gray-900">{issue.hostel?.name}</p>
                                    <p className="text-xs text-gray-500">Block {issue.block?.name}</p>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                                    <Tag className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                                    <p className="text-sm font-bold text-gray-900">{issue.category?.name || 'General'}</p>
                                </div>
                            </div>

                            {/* Author */}
                            <div className="flex items-start gap-4">
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                                    <User className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reporter</p>
                                    <p className="text-sm font-bold text-gray-900">{issue.reporter?.name || "Anonymous Student"}</p>
                                    <p className="text-xs text-gray-500 truncate w-32">{issue.reporter?.email}</p>

                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                        Generate Report PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
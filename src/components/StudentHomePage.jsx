'use client'

import ClientDashboard from './ClientDashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import HostelPulse from './HostelPulse'
import { useState } from 'react'
import IssueFilterBar from './IssueFilterBar'
import { Building2, User } from 'lucide-react'

export default function StudentHomePage({user}) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [sort, setSort] = useState("newest")

  // Construct the dynamic URL
  let fetchUrl = `/api/issues?sort=${sort}`
  if (search) fetchUrl += `&search=${search}`
  if (category !== "All Categories") fetchUrl += `&category=${category}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Header Section - Enhanced */}
        <div className="mb-8">
          {/* Welcome Card with Gradient */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                {/* Hostel Badge */}
                {user.hostelName && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 mb-3">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">{user.hostelName}</span>
                  </div>
                )}
                
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Student Dashboard
                </h1>
                
                {/* Welcome Message */}
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <p className="text-sm md:text-base font-medium">
                    Welcome back, <span className="text-blue-600 font-semibold">{user.name}</span>
                  </p>
                </div>
              </div>

              {/* User Avatar - Optional decorative element */}
              <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                {user.name?.charAt(0).toUpperCase() || 'S'}
              </div>
            </div>
          </div>
        </div>

        {/* HostelPulse Component */}
        <HostelPulse />

        {/* Filter Bar */}
        <div className="mb-6">
          <IssueFilterBar 
            searchQuery={search} 
            setSearchQuery={setSearch}
            selectedCategory={category} 
            setSelectedCategory={setCategory}
            selectedSort={sort} 
            setSelectedSort={setSort}
          />
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 h-auto">
            <TabsTrigger 
              value="feed" 
              className="
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-600 
                data-[state=active]:to-indigo-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-lg
                data-[state=active]:shadow-blue-500/30
                rounded-lg
                py-3
                font-semibold
                transition-all
                duration-200
              "
            >
              🔴 Live Feed
            </TabsTrigger>
            <TabsTrigger 
              value="mine"
              className="
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-purple-600 
                data-[state=active]:to-pink-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-lg
                data-[state=active]:shadow-purple-500/30
                rounded-lg
                py-3
                font-semibold
                transition-all
                duration-200
              "
            >
              📋 My Reports
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Public Feed */}
          <TabsContent value="feed" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <ClientDashboard 
                userId={user.id} 
                fetchUrl={fetchUrl} 
                emptyMessage="No recent issues in your hostel."
              />
            </div>
          </TabsContent>

          {/* TAB 2: My Issues */}
          <TabsContent value="mine" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <ClientDashboard 
                userId={user.id} 
                fetchUrl={`/api/issues?reporterId=${user.id}`}
                emptyMessage="You haven't reported any issues yet."
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
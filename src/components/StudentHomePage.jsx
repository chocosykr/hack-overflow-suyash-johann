'use client'


import ClientDashboard from './ClientDashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import HostelPulse from './HostelPulse'
import { useState } from 'react'
import IssueFilterBar from './IssueFilterBar'

export default function StudentHomePage({user}) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All Categories")
  const [sort, setSort] = useState("newest")

    // Construct the dynamic URL
  let fetchUrl = `/api/issues?sort=${sort}`
  if (search) fetchUrl += `&search=${search}`
  if (category !== "All Categories") fetchUrl += `&category=${category}`

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
           {user.hostelName || "Student Dashboard"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {user.name}
        </p>
      </div>

      <HostelPulse />

      <IssueFilterBar 
          searchQuery={search} setSearchQuery={setSearch}
          selectedCategory={category} setSelectedCategory={setCategory}
          selectedSort={sort} setSelectedSort={setSort}
       />

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="feed">Live Feed</TabsTrigger>
          <TabsTrigger value="mine">My Reports</TabsTrigger>
        </TabsList>

        {/* TAB 1: Public Feed (Hides Closed & Duplicates by default) */}
        <TabsContent value="feed">
          <ClientDashboard 
            userId={user.id} 
            fetchUrl={fetchUrl} 
            emptyMessage="No recent issues in your hostel."
          />
        </TabsContent>

        {/* TAB 2: My Issues (Shows Everything via filter) */}
        <TabsContent value="mine">
          <ClientDashboard 
            userId={user.id} 
            fetchUrl={`/api/issues?reporterId=${user.id}`}
            emptyMessage="You haven't reported any issues yet."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
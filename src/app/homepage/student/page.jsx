import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import ClientDashboard from '../../../components/ClientDashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"

export default async function DashboardFeed() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
           {session.user.hostelName || "Student Dashboard"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {session.user.name}
        </p>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="feed">Live Feed</TabsTrigger>
          <TabsTrigger value="mine">My Reports</TabsTrigger>
        </TabsList>

        {/* TAB 1: Public Feed (Hides Closed & Duplicates by default) */}
        <TabsContent value="feed">
          <ClientDashboard 
            userId={session.user.id} 
            fetchUrl="/api/issues" 
            emptyMessage="No recent issues in your hostel."
          />
        </TabsContent>

        {/* TAB 2: My Issues (Shows Everything via filter) */}
        <TabsContent value="mine">
          <ClientDashboard 
            userId={session.user.id} 
            fetchUrl={`/api/issues?reporterId=${session.user.id}`}
            emptyMessage="You haven't reported any issues yet."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
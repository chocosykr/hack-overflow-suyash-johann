import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import StaffIssueList from './StaffIssueList' // We'll make this component below

export default async function StaffDashboard() {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') redirect('/login')

  const mySpec = session.user.specialization

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Staff Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Specialization: <span className="font-semibold">{mySpec}</span>
      </p>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Jobs</TabsTrigger>
          <TabsTrigger value="active">My Active Jobs</TabsTrigger>
        </TabsList>

        {/* TAB 1: Unassigned issues matching my specialization */}
        <TabsContent value="available">
          <StaffIssueList 
            fetchUrl={`/api/issues?status=REPORTED&specialization=${mySpec}`} 
            type="available"
          />
        </TabsContent>

        {/* TAB 2: Issues assigned to me */}
        <TabsContent value="active">
          <StaffIssueList 
            fetchUrl={`/api/issues?assigneeId=${session.user.id}`} 
            type="active"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
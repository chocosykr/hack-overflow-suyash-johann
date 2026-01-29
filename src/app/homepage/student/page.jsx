import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import ClientDashboard from '../../../components/ClientDashboard'
export default async function DashboardFeed() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Live Feed: {session.user.hostelName || "Your Hostel"}
      </h1>
      
      {/* Pass the session data to the client-side part */}
      <ClientDashboard userId={session.user.id} />
    </div>
  )
}
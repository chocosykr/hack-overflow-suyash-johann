import DashboardNav from '../../components/DashboardNav'
import { auth } from '../auth' // Your auth helper
export default async function Layout({ children }) {
  const session = await auth()
  
  // Optional: protect the route if needed
  if (!session?.user) redirect('/login')
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Component (Handles Sidebar & Bottom Bar) */}
      <DashboardNav
      role={session.user.role} 
      userId={session.user.id}
      />

      {/* Main Content Area */}
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  )
}
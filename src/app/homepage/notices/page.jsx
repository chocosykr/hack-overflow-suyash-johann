import { auth } from '../../auth'
import { Bell } from "lucide-react"
import NoticeList from "../../../components/NoticeList"; // The client component

export default async function NoticesPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground text-sm">Official updates for {session.user.hostelName}</p>
        </div>
      </div>

      {/* This component handles the actual fetching */}
      <NoticeList />
    </div>
  );
}
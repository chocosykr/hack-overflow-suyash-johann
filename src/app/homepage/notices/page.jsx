import { auth } from '../../auth'
import { Bell, Megaphone } from "lucide-react"
import NoticeList from "../../../components/NoticeList"

export default async function NoticesPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-white pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        
        {/* Header Card - Enhanced */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-2xl ring-2 ring-orange-200 ring-offset-2 shadow-lg shadow-orange-200/50">
                    <Bell className="w-7 h-7 text-orange-600" />
                  </div>
                  {/* Pulse indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Notice Board
                </h1>
                
                {/* Hostel Badge */}
                {session.user.hostelName && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <Megaphone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">
                        {session.user.hostelName}
                      </span>
                    </div>
                  </div>
                )}
                
                <p className="text-gray-600 font-medium">
                  Stay updated with official announcements and important notices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-6 flex items-start gap-3">
          <div className="bg-blue-500 rounded-full p-1.5 mt-0.5">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-0.5">
              Official Announcements
            </p>
            <p className="text-xs text-blue-700">
              All notices are posted by authorized hostel management. Check regularly for updates.
            </p>
          </div>
        </div>

        {/* Notice List Component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <NoticeList />
        </div>
      </div>
    </div>
  );
}
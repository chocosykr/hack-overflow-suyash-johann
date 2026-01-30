import { getUserProfile } from '../../actions/profile'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Mail, Phone, MapPin, Briefcase, Award, CheckCircle, AlertCircle } from "lucide-react"

export default async function ProfilePage() {
  const user = await getUserProfile()

  if (!user) redirect('/login')

  // Helper to get initials for Avatar fallback
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isStaff = user.role === 'STAFF' || user.role === 'ADMIN'

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      
      {/* 1. HEADER CARD */}
      <Card className="overflow-hidden border-t-4 border-t-blue-600 shadow-md">
        <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
        <div className="px-6 pb-6 relative">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-4 gap-4">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-sm">
            <img 
              // If user has a real avatar, use it. Otherwise, auto-generate one!
              src={user.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.name}`} 
              alt={user.name} 
              className="h-full w-full object-cover" 
             />
            </div>
            
            {/* Name & Role */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Badge variant={isStaff ? "default" : "secondary"}>
                  {user.role}
                </Badge>
                {isStaff && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {user.specialization}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{user.phoneNumber || "No phone number linked"}</span>
            </div>
            
            {/* Student Location */}
            {!isStaff && (
              <div className="flex items-center gap-3 text-sm text-gray-600 col-span-1 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {user.hostel?.name || "No Hostel"}, {user.block?.name || "No Block"}, Room {user.room?.number || "N/A"}
                </span>
              </div>
            )}
            
            {/* Staff Department */}
            {isStaff && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>{user.specialization || "General Staff"}</span>
              </div>
            )}
          </div>

        </div>
      </Card>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Card A: Activity Volume */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-blue-50 rounded-full mb-3">
              {isStaff ? <CheckCircle className="w-6 h-6 text-blue-600" /> : <AlertCircle className="w-6 h-6 text-blue-600" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isStaff ? user.resolvedCount : user._count.reportedIssues}
            </h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
              {isStaff ? "Issues Resolved" : "Issues Reported"}
            </p>
          </CardContent>
        </Card>

        {/* Card B: Impact / Workload */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="p-3 bg-orange-50 rounded-full mb-3">
              {isStaff ? <Briefcase className="w-6 h-6 text-orange-600" /> : <Award className="w-6 h-6 text-orange-600" />}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isStaff ? user._count.assignedIssues : user.impactScore}
            </h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
              {isStaff ? "Total Assigned" : "Community Impact (Upvotes)"}
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
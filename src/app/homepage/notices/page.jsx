import { auth } from '../../auth'
import { prisma } from '../../../lib/prisma'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Bell, Calendar, Building2 } from "lucide-react"

export default async function NoticesPage() {
  const session = await auth()
  if (!session?.user) return null

  // THE SMART QUERY
  // We fetch announcements that are EITHER:
  // 1. Global (targetHostel is null)
  // 2. Targeted to this user's specific hostel
  const notices = await prisma.announcement.findMany({
    where: {
      OR: [
        { targetHostel: null }, // Global announcements
        { targetHostel: session.user.hostelName } // Targeted announcements
      ]
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground text-sm">Official updates for {session.user.hostelName}</p>
        </div>
      </div>

      {/* Empty State */}
      {notices.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
          <p className="text-gray-500">No new announcements at this time.</p>
        </div>
      )}

      {/* Notices List */}
      <div className="grid gap-4">
        {notices.map((notice) => {
          const isTargeted = notice.targetHostel !== null // Is this specific to my hostel?

          return (
            <Card key={notice.id} className={`transition-all hover:shadow-md ${isTargeted ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold leading-none">
                      {notice.title}
                    </CardTitle>
                    {isTargeted && (
                      <Badge variant="secondary" className="mt-2 text-xs font-normal">
                        <Building2 className="w-3 h-3 mr-1" />
                        Hostel Specific
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center bg-gray-100 px-2 py-1 rounded">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>
              </CardContent>
              
              <CardFooter className="pt-0 pb-4">
                <p className="text-xs text-muted-foreground italic">
                  Posted by Administration
                </p>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
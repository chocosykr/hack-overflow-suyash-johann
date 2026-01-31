import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import StaffIssueList from './StaffIssueList'
import { Wrench, Briefcase, User, Award, ClipboardList } from 'lucide-react'

// Specialization icon mapping
const specializationIcons = {
  'Plumbing': Wrench,
  'Electrical': '⚡',
  'Cleanliness': '✨',
  'Internet': '📶',
  'Furniture': '🪑',
  'Infrastructure': '🏗️',
}

export default async function StaffDashboard() {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') redirect('/login')

  const mySpec = session.user.specialization
  const SpecIcon = specializationIcons[mySpec] || Wrench

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-white pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Header Section - Enhanced */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                {/* Staff Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 mb-3">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-bold text-yellow-700 uppercase tracking-wide">
                    Staff Member
                  </span>
                </div>
                
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Staff Dashboard
                </h1>
                
                {/* Specialization Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    {typeof SpecIcon === 'string' ? (
                      <span className="text-lg">{SpecIcon}</span>
                    ) : (
                      <SpecIcon className="w-5 h-5 text-green-600" />
                    )}
                    <div>
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
                        Specialization
                      </p>
                      <p className="text-sm font-bold text-green-700">
                        {mySpec}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Avatar */}
              <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white text-2xl font-bold shadow-lg shadow-green-500/30">
                {session.user.name?.charAt(0).toUpperCase() || 'S'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Optional but nice */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                  Available
                </p>
                <p className="text-2xl font-bold text-blue-700">Jobs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-700">Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 h-auto">
            <TabsTrigger 
              value="available" 
              className="
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-blue-600 
                data-[state=active]:to-indigo-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-lg
                data-[state=active]:shadow-blue-500/30
                data-[state=inactive]:text-gray-600
                data-[state=inactive]:hover:bg-blue-50
                data-[state=inactive]:hover:text-blue-700
                rounded-lg
                py-3
                font-semibold
                transition-all
                duration-200
              "
            >
              📋 Available Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-green-600 
                data-[state=active]:to-emerald-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-lg
                data-[state=active]:shadow-green-500/30
                data-[state=inactive]:text-gray-600
                data-[state=inactive]:hover:bg-green-50
                data-[state=inactive]:hover:text-green-700
                rounded-lg
                py-3
                font-semibold
                transition-all
                duration-200
              "
            >
              ✓ My Active Jobs
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Available Jobs */}
          <TabsContent value="available" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Available Jobs in Your Specialization
                  </h3>
                  <p className="text-sm text-gray-600">
                    Unassigned issues matching <span className="font-semibold text-green-600">{mySpec}</span>. 
                    Click to accept and start working.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <StaffIssueList 
                fetchUrl={`/api/issues?status=REPORTED&specialization=${mySpec}`} 
                type="available"
              />
            </div>
          </TabsContent>

          {/* TAB 2: My Active Jobs */}
          <TabsContent value="active" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Your Active Tasks
                  </h3>
                  <p className="text-sm text-gray-600">
                    Issues currently assigned to you. Update status as you make progress.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <StaffIssueList 
                fetchUrl={`/api/issues?assigneeId=${session.user.id}`} 
                type="active"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
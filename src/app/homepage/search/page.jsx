import { auth } from '../../auth'
import { prisma } from '../../../lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import LostFoundCard from '../../../components/LostFoundCard'
import { Button } from '../../../components/ui/button'
import { Plus, Search, Package } from 'lucide-react'
import Link from 'next/link'

export default async function LostFoundPage() {
  const session = await auth()
  if (!session) return null

  const lostItems = await prisma.lostItem.findMany({
    where: { 
      status: 'LOST', 
    },
    orderBy: { createdAt: 'desc' },
    include: { 
      reporter: { select: { name: true } }
    }
  })

  const foundItems = await prisma.lostItem.findMany({
    where: { 
      status: 'FOUND', 
    },
    orderBy: { createdAt: 'desc' },
    include: { 
      reporter: { select: { name: true } },
      claims: { 
        where: { id: session.user.id },
        select: { id: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-white pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        
        {/* Header Section - Enhanced */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                    <Search className="w-6 h-6 text-purple-600" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Lost & Found
                  </h1>
                </div>
                <p className="text-gray-600 ml-14">
                  Help reunite lost items with their owners
                </p>
              </div>
              
              <Link href="/homepage/search/report">
                <Button 
                  size="lg" 
                  className="
                    bg-gradient-to-r from-purple-600 to-pink-600 
                    text-white font-semibold 
                    shadow-lg shadow-purple-500/30 
                    hover:shadow-xl hover:shadow-purple-500/40
                    hover:scale-105
                    transition-all
                    gap-2
                    whitespace-nowrap
                  "
                >
                  <Plus className="w-5 h-5" /> 
                  Report Item
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards - Optional but nice to have */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{foundItems.length}</p>
                <p className="text-sm text-green-600 font-medium">Items Found</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{lostItems.length}</p>
                <p className="text-sm text-orange-600 font-medium">Items Lost</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="found" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 h-auto">
            <TabsTrigger 
              value="found" 
              className="
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-green-600 
                data-[state=active]:to-emerald-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-lg
                data-[state=active]:shadow-green-500/30
                rounded-lg
                py-3
                font-semibold
                transition-all
                duration-200
              "
            >
              ✓ Items Found ({foundItems.length})
            </TabsTrigger>
            <TabsTrigger 
              value="lost"
              className="
                data-[state=active]:bg-gradient-to-r 
                data-[state=active]:from-orange-600 
                data-[state=active]:to-red-600 
                data-[state=active]:text-white 
                data-[state=active]:shadow-lg
                data-[state=active]:shadow-orange-500/30
                rounded-lg
                py-3
                font-semibold
                transition-all
                duration-200
              "
            >
              🔍 Items Lost ({lostItems.length})
            </TabsTrigger>
          </TabsList>
          
          {/* TAB 1: ITEMS FOUND */}
          <TabsContent value="found" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Items Found by Others</h3>
                  <p className="text-sm text-gray-600">
                    Browse items that have been found. If you recognize something as yours, claim it!
                  </p>
                </div>
              </div>
            </div>

            {foundItems.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Found Items Yet</h3>
                <p className="text-gray-500">Check back later for items that have been found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {foundItems.map((item) => (
                  <LostFoundCard 
                    key={item.id} 
                    item={item} 
                    currentUserId={session.user.id}
                    canClaim={true} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: ITEMS LOST */}
          <TabsContent value="lost" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg mt-0.5">
                  <Search className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Items Reported Lost</h3>
                  <p className="text-sm text-gray-600">
                    Students are looking for these items. If you find any, please report them!
                  </p>
                </div>
              </div>
            </div>

            {lostItems.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Lost Items Reported</h3>
                <p className="text-gray-500">Great news! No one has reported missing items</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lostItems.map((item) => (
                  <LostFoundCard 
                    key={item.id} 
                    item={item} 
                    currentUserId={session.user.id}
                    canClaim={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
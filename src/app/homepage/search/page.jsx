import { auth } from '../../auth'
import { prisma } from '../../../lib/prisma'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import LostFoundCard from '../../../components/LostFoundCard'
import { Button } from '../../../components/ui/button'
import { Plus } from 'lucide-react'
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
    // We DO NOT include 'claims' here because you can't claim a lost report.
  }
})

// app/dashboard/search/page.tsx

const foundItems = await prisma.lostItem.findMany({
  where: { 
    status: 'FOUND', 
  },
  orderBy: { createdAt: 'desc' },
  include: { 
    reporter: { select: { name: true } },
    // Include claims to check if CURRENT user has already claimed it
    claims: { 
      where: { id: session.user.id },
      select: { id: true }
    }
  }
})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lost & Found</h1>
        <Link href="/homepage/search/report">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> Report Item
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="found" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="found">Items Found</TabsTrigger>
          <TabsTrigger value="lost">Items Lost</TabsTrigger>
        </TabsList>
        
        {/* TAB 1: ITEMS FOUND (Where users claim things) */}
        <TabsContent value="found" className="mt-6 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Items found by others. Is one of these yours?
          </p>
          {foundItems.map((item) => (
            <LostFoundCard 
              key={item.id} 
              item={item} 
              currentUserId={session.user.id}
              canClaim={true} 
            />
          ))}
        </TabsContent>

        {/* TAB 2: ITEMS LOST (Just a list) */}
        <TabsContent value="lost" className="mt-6 space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Items reported lost by students. Keep an eye out!
          </p>
          {lostItems.map((item) => (
            <LostFoundCard 
              key={item.id} 
              item={item} 
              currentUserId={session.user.id}
              canClaim={false} // You can't claim something that is lost
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
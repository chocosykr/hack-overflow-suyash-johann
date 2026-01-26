// src/app/api/issues/route.js
//import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 1. Verify Authentication
    // const session = await auth()
    
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' }, 
    //     { status: 401 }
    //   )
    // }

    // 2. Fetch Issues (Same logic as before)
    const issues = await prisma.issue.findMany({
      where: {
        hostelName: 'Boys Hostel A', // Still filtering by user's hostel
        visibility: 'PUBLIC',
        isDuplicate: false,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { upvotes: true }
        },
        // Check if current user upvoted
        upvotes: {
          where: { userId: 'abc' },
          select: { userId: true }
        }
      }
    })

    // 3. Return Data as JSON
    return NextResponse.json(issues)

  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}
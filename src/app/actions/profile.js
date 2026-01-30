'use server'

import { prisma } from '../../lib/prisma'
import { auth } from '../auth'

export async function getUserProfile() {
  const session = await auth()
  if (!session?.user) return null

  const userId = session.user.id

  // 1. Fetch Basic Info & Relations
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      hostel: { select: { name: true } },
      block: { select: { name: true } },
      room: { select: { number: true } },
      _count: {
        select: {
          reportedIssues: true, // For Students
          assignedIssues: true, // For Staff
        }
      }
    }
  })

  // 2. Calculate "Impact Score" (Total upvotes received on my issues)
  // Only relevant for Students
  let impactScore = 0
  if (user.role === 'STUDENT') {
    const aggregate = await prisma.upvote.count({
      where: {
        issue: {
          reporterId: userId
        }
      }
    })
    impactScore = aggregate
  }

  // 3. Calculate "Resolved Count"
  // Only relevant for Staff
  let resolvedCount = 0
  if (user.role === 'STAFF') {
    resolvedCount = await prisma.issue.count({
      where: {
        assigneeId: userId,
        status: 'RESOLVED'
      }
    })
  }

  return { ...user, impactScore, resolvedCount }
}
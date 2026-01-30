'use server'

import { prisma } from '../../lib/prisma'
import { auth } from '../auth'
import { revalidatePath } from 'next/cache'

export async function claimIssue(issueId) {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') throw new Error("Unauthorized")

  await prisma.issue.update({
    where: { id: issueId },
    data: {
      status: 'IN_PROGRESS',
      assignee: { connect: { id: session.user.id } }, // Assign to ME
      assignedAt: new Date(),
    }
  })

  revalidatePath('/homepage/staff')
}

export async function resolveIssue(issueId, resolutionNote = null) {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') throw new Error("Unauthorized")

  const staffId = session.user.id

  // Use a transaction to ensure data integrity
  await prisma.$transaction(async (tx) => {
    
    // 1. Fetch current status BEFORE updating
    const currentIssue = await tx.issue.findUnique({
      where: { id: issueId },
      select: { status: true }
    })

    if (!currentIssue) throw new Error("Issue not found")

    // 2. Update the Issue
    await tx.issue.update({
      where: { id: issueId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        // Optional: You could save the resolution note in the description or a new field if you wanted
      }
    })

    // 3. Create the History Record
    await tx.issueStatusHistory.create({
      data: {
        issueId: issueId,
        fromStatus: currentIssue.status, // e.g., IN_PROGRESS
        toStatus: 'RESOLVED',
        changedById: staffId,
        note: resolutionNote || "Marked as resolved by staff"
      }
    })
  })

  revalidatePath('/homepage/staff')
  revalidatePath('/homepage/student') // Update student view too
}
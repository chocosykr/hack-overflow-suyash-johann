'use server'

import { prisma } from '../../lib/prisma'
import { auth } from '../auth'
import { revalidatePath } from 'next/cache'


// Add to src/app/actions/staffActions.js

export async function mergeIssues(originalId, duplicateId) {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') throw new Error("Unauthorized")

  if (originalId === duplicateId) throw new Error("Cannot merge issue with itself")

  await prisma.$transaction(async (tx) => {
    // 1. Verify both exist
    const original = await tx.issue.findUnique({ where: { id: originalId } })
    const duplicate = await tx.issue.findUnique({ where: { id: duplicateId } })

    if (!original || !duplicate) throw new Error("Issue not found")

    // 2. Update the DUPLICATE issue
    await tx.issue.update({
      where: { id: duplicateId },
      data: {
        isDuplicate: true,
        mergedWith: { connect: { id: originalId } },
        status: 'CLOSED', // Terminate the duplicate itself
        
        // Optional: Append duplicate's description to original's history or comments 
        // so staff doesn't lose context (e.g. "Room 102 also reported this")
      }
    })

    // 3. Add History Record for Duplicate
    await tx.issueStatusHistory.create({
      data: {
        issueId: duplicateId,
        fromStatus: duplicate.status,
        toStatus: 'CLOSED',
        changedById: session.user.id,
        note: `Merged with issue #${originalId.slice(-4)}`
      }
    })

    // 4. (Optional) Add a system comment to the ORIGINAL issue
    await tx.comment.create({
      data: {
        content: `System: Issue #${duplicateId.slice(-4)} was merged into this.`,
        issueId: originalId,
        userId: session.user.id,
        type: 'INTERNAL_NOTE' // If you have this enum value
      }
    })
  })

  revalidatePath('/homepage/staff')
}

// 1. CLAIM: REPORTED -> ASSIGNED
export async function claimIssue(issueId) {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') throw new Error("Unauthorized")

  const staffId = session.user.id

  await prisma.$transaction(async (tx) => {
    // Check current status
    const issue = await tx.issue.findUnique({ where: { id: issueId } })
    if (!issue) throw new Error("Issue not found")

    // Update Issue
    await tx.issue.update({
      where: { id: issueId },
      data: {
        status: 'ASSIGNED', // Changed from IN_PROGRESS
        assignee: { connect: { id: staffId } },
        assignedAt: new Date(),
      }
    })

    // Add History
    await tx.issueStatusHistory.create({
      data: {
        issueId: issueId,
        fromStatus: issue.status,
        toStatus: 'ASSIGNED',
        changedById: staffId,
        note: "Staff claimed this issue"
      }
    })
  })

  revalidatePath('/homepage/staff')
}

// 2. START: ASSIGNED -> IN_PROGRESS (New Action)
export async function startIssueProgress(issueId) {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') throw new Error("Unauthorized")

  const staffId = session.user.id

  await prisma.$transaction(async (tx) => {
    // Check current status
    const issue = await tx.issue.findUnique({ where: { id: issueId } })
    
    // Safety check: ensure it is actually assigned to me or at least assigned
    if (issue.status !== 'ASSIGNED') {
      throw new Error("Issue must be claimed first")
    }

    // Update Issue
    await tx.issue.update({
      where: { id: issueId },
      data: {
        status: 'IN_PROGRESS',
        // We don't change assignedAt here, as it was assigned earlier
      }
    })

    // Add History
    await tx.issueStatusHistory.create({
      data: {
        issueId: issueId,
        fromStatus: 'ASSIGNED',
        toStatus: 'IN_PROGRESS',
        changedById: staffId,
        note: "Staff started work on this issue"
      }
    })
  })

  revalidatePath('/homepage/staff')
  revalidatePath('/homepage/student')
}

// 3. RESOLVE: IN_PROGRESS -> RESOLVED (Existing, kept for context)
export async function resolveIssue(issueId, resolutionNote = null) {
  const session = await auth()
  if (session?.user?.role !== 'STAFF') throw new Error("Unauthorized")

  const staffId = session.user.id

  await prisma.$transaction(async (tx) => {
    const currentIssue = await tx.issue.findUnique({
      where: { id: issueId },
      select: { status: true }
    })

    await tx.issue.update({
      where: { id: issueId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      }
    })

    await tx.issueStatusHistory.create({
      data: {
        issueId: issueId,
        fromStatus: currentIssue.status,
        toStatus: 'RESOLVED',
        changedById: staffId,
        note: resolutionNote || "Marked as resolved by staff"
      }
    })
  })

  revalidatePath('/homepage/staff')
  revalidatePath('/homepage/student')
}
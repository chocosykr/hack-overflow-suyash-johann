'use server'

import { prisma } from '../../lib/prisma' // Adjust path if needed
import { auth } from '../auth'
import { revalidatePath } from 'next/cache'

export async function closeIssue(issueId) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // 1. Verify ownership
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { reporterId: true, status: true }
  })

  if (!issue) throw new Error("Issue not found")
  if (issue.reporterId !== session.user.id) {
    throw new Error("Only the reporter can close this issue")
  }

  // 2. Update status and timestamp
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      status: 'CLOSED',
      closedAt: new Date(),
    }
  })

  // 3. Add to history (Optional but recommended)
  await prisma.issueStatusHistory.create({
    data: {
      issueId: issueId,
      fromStatus: issue.status,
      toStatus: 'CLOSED',
      changedById: session.user.id,
      note: "Confirmed fixed by student"
    }
  })

  revalidatePath('/homepage/student')
}
'use server'

import { prisma } from '../../lib/prisma'
import { auth } from '../auth'
import { revalidatePath } from 'next/cache'

export async function addComment(issueId, content, parentId = null) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.comment.create({
    data: {
      content,
      issueId,
      userId: session.user.id,
      parentId
    }
  })

  // Revalidate to show new comments immediately
  revalidatePath('/homepage/student') 
  return { success: true }
}

export async function getIssueComments(issueId) {
  // Fetch all comments for this issue
  // We fetch flat and reconstruct the tree on the client for flexibility
  const comments = await prisma.comment.findMany({
    where: { issueId },
    include: {
      user: {
        select: { name: true, role: true, avatar: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  })
  return comments
}
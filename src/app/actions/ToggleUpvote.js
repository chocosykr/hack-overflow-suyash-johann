'use server'

import { prisma } from '../../lib/prisma' // Adjust your import path
import { revalidatePath } from 'next/cache'
import { auth } from '../auth' // Your Auth library (NextAuth/Clerk)

export async function ToggleUpvote(issueId) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const userId = session.user.id

  // Check if already upvoted
  const existingUpvote = await prisma.upvote.findUnique({
    where: {
      issueId_userId: {
        issueId,
        userId
      }
    }
  })

  if (existingUpvote) {
    // Remove upvote
    await prisma.upvote.delete({
      where: { id: existingUpvote.id }
    })
  } else {
    // Add upvote
    await prisma.upvote.create({
      data: {
        issueId,
        userId
      }
    })
  }

  // Refresh the UI
  revalidatePath('/homepage')
}
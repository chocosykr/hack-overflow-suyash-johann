// app/actions.ts
'use server'

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '../auth' // Your auth path
import { redirect } from 'next/navigation'

export async function createIssue(formData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // 1. EXTRACT DATA
  const title = formData.get('title') 
  const description = formData.get('description') 
  const category = formData.get('category') 
  const priority = formData.get('priority') 
  const visibility = formData.get('visibility')  // "PUBLIC" or "PRIVATE"
  const mediaUrl = formData.get('mediaUrl')  // URL from your upload service

  // 2. AUTOMATIC TAGGING (The "Smart" Feature)
  // We fetch the user's location from their profile, NOT the form.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user?.hostelName || !user?.blockName) {
    throw new Error("Profile incomplete. Please update hostel details.")
  }

  // 3. DATABASE INSERT
  await prisma.issue.create({
    data: {
      title,
      description,
      category,
      priority: priority, // Cast to Enum
      visibility: visibility, // Cast to Enum
      mediaUrl: mediaUrl || null,
      
      // Automatic Tagging
      hostelName: user.hostelName,
      blockName: user.blockName,
      roomNumber: user.roomNumber || "N/A",
      
      reporterId: session.user.id,
      status: 'REPORTED'
    }
  })

  revalidatePath('/homepage/student')
  // CHANGE: Return success instead of redirecting
  return { success: true }
}
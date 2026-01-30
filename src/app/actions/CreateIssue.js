'use server'

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '../auth' 
import { redirect } from 'next/navigation'

// Renamed to match your import in the form component
// If your import is 'createIssue', keep this name. 
// If it is 'createIssueAction', change it here.
export async function createIssue(formData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  // 1. EXTRACT DATA
  const title = formData.get('title') 
  const description = formData.get('description') 
  const categoryId = formData.get('category') 
  const priority = formData.get('priority') 
  const visibility = formData.get('visibility') 
  const mediaUrl = formData.get('mediaUrl') 

  // 2. LOCATION LOGIC (The Fix)
  // Priority A: Check if the form sent a manual location (Staff Override)
  // Priority B: Check if the user has a location in their profile (Student Auto-tag)
  let hostelId = formData.get('hostelId') 
  let blockId = formData.get('blockId')
  // Room is usually optional for staff or derived from profile
  let roomId = formData.get('roomId') 

  // If not in form, grab from profile
  if (!hostelId) hostelId = session.user.hostelId
  if (!blockId) blockId = session.user.blockId
  if (!roomId) roomId = session.user.roomId

  // 3. FINAL VALIDATION
  if (!hostelId || !blockId) {
    throw new Error("Location is required. Please update your profile or select a location.")
  }

  // 4. DATABASE INSERT
  await prisma.issue.create({
    data: {
      title,
      description,
      priority: priority || 'LOW', 
      visibility: visibility || 'PUBLIC',
      status: 'REPORTED',
      
      // Handle the array of strings for images
      imageUrls: mediaUrl ? [mediaUrl] : [],
      
      // RELATIONS
      category: { connect: { id: categoryId } },
      reporter: { connect: { id: session.user.id } },
      
      hostel: { connect: { id: hostelId } },
      block:  { connect: { id: blockId } },
      // Only connect room if we have a valid ID (it might be null for staff)
      room:   roomId ? { connect: { id: roomId } } : undefined,
    }
  })

  revalidatePath('/homepage/student')
  revalidatePath('/homepage/staff')
  
  return { success: true }
}
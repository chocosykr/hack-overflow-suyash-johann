'use server'

import { prisma } from '../../lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '../auth'
import { redirect } from 'next/navigation'

export async function submitClaim(formData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const lostItemId = formData.get('itemId') 
  const proofUrls = formData.getAll('proof') // returns an array ['url1', 'url2']
  const description = formData.get('description')

  // 1. Check if this user already claimed this specific item
  const existingClaim = await prisma.LostItemClaim.findFirst({
    where: {
      lostItemId,
      claimantId: session.user.id
    }
  })

if (existingClaim) {
    // Return a message instead of throwing
    return { error: "You have already submitted a claim for this item." };
  }

  // 2. Create the Claim Record
 await prisma.LostItemClaim.create({
  data: {
    lostItemId,
    claimantId: session.user.id,
    status: 'PENDING',
    
    // You can now pass these even if they are undefined or null
    description: description || null, 
    
    // If proofUrls is undefined, the database will automatically save []
    proofUrls: proofUrls, 
  }
})

  revalidatePath('/homepage/search')
}

export async function reportLostItem(formData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

await prisma.lostItem.create({
  data: {
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
    
    // 1. Status: Ensure the form value is exactly 'LOST' or 'FOUND'
    status: formData.get('type'), 

    // 2. ImageUrls: Schema expects String[], code sent String or Null
    // Fix: Wrap single URL in an array, or default to empty array
    imageUrls: formData.get('imageUrl') ? [formData.get('imageUrl')] : [],

    // 3. Date: This is REQUIRED in your schema but was missing
    // Fix: Convert the form string to a real JS Date object
    date: new Date(formData.get('date')), 

    reporterId: session.user.id
  }
})

  revalidatePath('/homepage/search')
  return { success: true }
}


export async function markAsFound(formData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const itemId = formData.get('itemId') 

await prisma.lostItem.update({
  where: { id: itemId },
  data: { 
    // isResolved: true,  <-- REMOVE THIS (Field doesn't exist)
    status: 'RETURNED'    // <-- USE THIS (Matches your Enum)
  }
})

  revalidatePath('/homepage/search')
}
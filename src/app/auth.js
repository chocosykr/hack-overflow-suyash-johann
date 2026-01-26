// app/auth.ts OR lib/auth.ts
import { cookies } from 'next/headers'
import { prisma } from '../lib/prisma'

export async function auth() {
  const cookieStore = await cookies()
  
  // 2. Get the specific cookie
  const sessionCookie = cookieStore.get('session')

  // Check if it exists
  if (sessionCookie) {
    console.log("Session ID:", sessionCookie.value)
  }
  
  if (!sessionCookie?.value) return null

  // Fetch the user data attached to this ID
  const user = await prisma.user.findUnique({
    where: { id: sessionCookie.value }
  })

  if (!user) return null

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      hostelName: user.hostelName,
      blockName: user.blockName,
      role: user.role
    }
  }
}
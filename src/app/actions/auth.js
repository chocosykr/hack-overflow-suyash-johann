'use server'

import { prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod' // Optional: for validation, but good to have

// Simple Login Logic
export async function loginAction(prevState,formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email }
  })

  // 2. Validate Password (Simple check for Hackathon speed)
  // In production: await bcrypt.compare(password, user.password)
  if (!user || user.password !== password) {
    return { error: "Invalid email or password" }
  }

  // 3. Create Session (Set a cookie)
  // We store the User ID in a cookie called 'session'
  const cookieStore = await cookies()
  
  cookieStore.set('session', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/', // Good practice to add this so it works on all routes
  })

  // 4. Redirect to homepage
  redirect('/homepage/student')
}

// Simple Logout Logic
export async function logoutAction() {
  cookies().delete('session')
  redirect('/login')
}
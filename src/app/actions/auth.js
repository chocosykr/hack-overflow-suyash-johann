'use server'

import { prisma } from '../../lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(prevState, formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || user.password !== password) {
    return { error: "Invalid email or password" }
  }

  // Create Session
  const cookieStore = await cookies()
  cookieStore.set('session', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, 
    path: '/',
  })

  // --- NEW: Dynamic Redirect based on Role ---
  if (user.role === 'STAFF') {
    redirect('/homepage/staff')
  } else if (user.role === 'ADMIN') {
    redirect('/dashboard') // Assuming you have an admin dashboard
  } else {
    redirect('/homepage/student')
  }
}

// Simple Logout Logic
export async function logoutAction() {
  // 1. Await the cookie store
  const cookieStore = await cookies()
  
  // 2. Delete the session
  cookieStore.delete('session')
  
  // 3. Redirect to login
  redirect('/login')
}
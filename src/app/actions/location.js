'use server'

import { prisma } from '../../lib/prisma'

// Fetch all hostels for the initial dropdown
export async function getHostels() {
  const hostels = await prisma.hostel.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
  return hostels
}

// Fetch blocks for a specific hostel
export async function getBlocks(hostelId) {
  if (!hostelId) return []
  
  const blocks = await prisma.block.findMany({
    where: { hostelId: hostelId },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
  return blocks
}
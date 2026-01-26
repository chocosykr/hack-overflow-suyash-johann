import 'dotenv/config'; // <-- ADD THIS LINE AT THE TOP
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting Seed...')

  // 1. CLEANUP: Clear existing data to avoid conflicts on re-seeds
  await prisma.comment.deleteMany()
  await prisma.upvote.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.lostItem.deleteMany()
  await prisma.user.deleteMany()

  // 2. CREATE USERS
  console.log('👤 Creating Users...')
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      name: 'Chief Warden',
      password: 'password123', // In real app, hash this!
      role: 'ADMIN',
      hostelName: 'Admin Block',
      blockName: 'Office',
      roomNumber: '101'
    }
  })

  // Students (Boys Hostel)
  const student1 = await prisma.user.create({
    data: {
      email: 'rahul@student.edu',
      name: 'Rahul Sharma',
      password: 'password123',
      role: 'STUDENT',
      hostelName: 'Boys Hostel A',
      blockName: 'Block 1',
      roomNumber: '302'
    }
  })

  const student2 = await prisma.user.create({
    data: {
      email: 'arjun@student.edu',
      name: 'Arjun Verma',
      password: 'password123',
      role: 'STUDENT',
      hostelName: 'Boys Hostel A',
      blockName: 'Block 1',
      roomNumber: '304'
    }
  })

  // Students (Girls Hostel)
  const student3 = await prisma.user.create({
    data: {
      email: 'priya@student.edu',
      name: 'Priya Singh',
      password: 'password123',
      role: 'STUDENT',
      hostelName: 'Girls Hostel B',
      blockName: 'Wing C',
      roomNumber: '105'
    }
  })

  // 3. CREATE ISSUES
  console.log('📝 Creating Issues...')

  // Issue 1: Public, High Priority (The "Me Too" Candidate)
  const issueWifi = await prisma.issue.create({
    data: {
      title: 'Wifi not working on 3rd Floor',
      description: 'The router in the corridor has no power light. Multiple rooms affected.',
      category: 'Internet',
      priority: 'HIGH',
      status: 'REPORTED',
      visibility: 'PUBLIC',
      hostelName: 'Boys Hostel A',
      blockName: 'Block 1',
      roomNumber: 'Corridor',
      reporterId: student1.id,
    }
  })

  // Add Upvotes to Issue 1 (Simulating community interaction)
  await prisma.upvote.create({
    data: {
      issueId: issueWifi.id,
      userId: student2.id
    }
  })

  // Issue 2: Resolved Issue
  await prisma.issue.create({
    data: {
      title: 'Leaking Tap in Bathroom',
      description: 'Tap #4 in the common washroom is leaking continuously.',
      category: 'Plumbing',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      visibility: 'PUBLIC',
      hostelName: 'Boys Hostel A',
      blockName: 'Block 1',
      roomNumber: 'Washroom',
      reporterId: student2.id,
      assigneeId: admin.id // Assigned to admin for demo
    }
  })

  // Issue 3: Private Issue (Should not appear in public feed)
  await prisma.issue.create({
    data: {
      title: 'Roommate conflict',
      description: 'Need to discuss room change due to noise issues.',
      category: 'General',
      priority: 'LOW',
      status: 'IN_PROGRESS',
      visibility: 'PRIVATE',
      hostelName: 'Girls Hostel B',
      blockName: 'Wing C',
      roomNumber: '105',
      reporterId: student3.id,
    }
  })

  // 4. CREATE ANNOUNCEMENTS
  console.log('📢 Creating Announcements...')
  
  await prisma.announcement.create({
    data: {
      title: 'Water Tank Cleaning Tomorrow',
      content: 'Water supply will be cut from 10 AM to 2 PM for cleaning.',
      targetHostel: 'Boys Hostel A', // Only for Boys Hostel
    }
  })

  await prisma.announcement.create({
    data: {
      title: 'Exam Registration Deadline',
      content: 'Please submit your forms by Friday.',
      // No targetHostel means visible to ALL
    }
  })

  // 5. CREATE LOST & FOUND
  console.log('🔍 Creating Lost & Found Items...')

  await prisma.lostItem.create({
    data: {
      title: 'Blue Water Bottle',
      description: 'Left it in the mess hall during lunch.',
      status: 'LOST',
      location: 'Mess Hall',
      date: new Date(),
      reporterId: student1.id
    }
  })

  console.log('✅ Seed Completed! You are ready to build.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
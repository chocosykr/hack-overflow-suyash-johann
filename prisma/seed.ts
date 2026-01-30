import 'dotenv/config'; // <-- ADD THIS LINE AT THE TOP
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  UserRole,
  StaffSpecialization,
  IssueStatus,
  Priority,
  Visibility,
  CommentType,
  LostFoundStatus,
  ClaimStatus
} from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. CLEANUP (Delete in reverse dependency order)
  const deleteOrder = [
    prisma.comment.deleteMany(),
    prisma.issueStatusHistory.deleteMany(),
    prisma.upvote.deleteMany(),
    prisma.lostItemClaim.deleteMany(),
    prisma.lostItem.deleteMany(),
    prisma.issue.deleteMany(),
    prisma.issueCategory.deleteMany(),
    prisma.user.deleteMany(),
    prisma.room.deleteMany(),
    prisma.block.deleteMany(),
    prisma.hostel.deleteMany(),
    prisma.announcement.deleteMany(),
  ];

  // Execute deletes sequentially to avoid foreign key constraints
  for (const operation of deleteOrder) {
    try {
      await operation;
    } catch (e) {
      // Ignore error if table doesn't exist yet
    }
  }

  // 2. CREATE ISSUE CATEGORIES
  console.log('creating categories...');
  const catWifi = await prisma.issueCategory.create({
    data: { name: 'WiFi & Network', icon: 'wifi', specialization: StaffSpecialization.IT_SUPPORT }
  });
  const catElec = await prisma.issueCategory.create({
    data: { name: 'Electrical', icon: 'zap', specialization: StaffSpecialization.ELECTRICIAN }
  });
  const catPlumb = await prisma.issueCategory.create({
    data: { name: 'Plumbing', icon: 'droplet', specialization: StaffSpecialization.PLUMBER }
  });
  const catCarpentry = await prisma.issueCategory.create({
    data: { name: 'Carpentry', icon: 'hammer', specialization: StaffSpecialization.CARPENTER }
  });
  const catCleaning = await prisma.issueCategory.create({
    data: { name: 'Cleaning & Maintenance', icon: 'broom', specialization: StaffSpecialization.CLEANER }
  });
  const catSecurity = await prisma.issueCategory.create({
    data: { name: 'Security', icon: 'shield', specialization: StaffSpecialization.SECURITY }
  });

  // 3. CREATE HOSTELS, BLOCKS, ROOMS
  console.log('creating hostels...');
  
  // Boys Hostel 1
  const hostelA = await prisma.hostel.create({
    data: {
      name: 'Boys Hostel 1',
      code: 'BH1',
      blocks: {
        create: [
          {
            name: 'Block A',
            rooms: {
              createMany: {
                data: [
                  { number: '101', floor: 1 },
                  { number: '102', floor: 1 },
                  { number: '103', floor: 1 },
                  { number: '201', floor: 2 },
                  { number: '202', floor: 2 },
                  { number: '203', floor: 2 },
                  { number: '301', floor: 3 },
                  { number: '302', floor: 3 },
                ]
              }
            }
          },
          {
            name: 'Block B',
            rooms: {
              createMany: { 
                data: [
                  { number: '101', floor: 1 },
                  { number: '102', floor: 1 },
                  { number: '201', floor: 2 },
                  { number: '202', floor: 2 },
                ] 
              }
            }
          }
        ]
      }
    },
    include: { blocks: { include: { rooms: true } } }
  });

  // Girls Hostel 1
  const hostelB = await prisma.hostel.create({
    data: {
      name: 'Girls Hostel 1',
      code: 'GH1',
      blocks: {
        create: [
          {
            name: 'Block A',
            rooms: {
              createMany: {
                data: [
                  { number: '101', floor: 1 },
                  { number: '102', floor: 1 },
                  { number: '103', floor: 1 },
                  { number: '201', floor: 2 },
                  { number: '202', floor: 2 },
                  { number: '301', floor: 3 },
                ]
              }
            }
          },
          {
            name: 'Block B',
            rooms: {
              createMany: { 
                data: [
                  { number: '101', floor: 1 },
                  { number: '102', floor: 1 },
                  { number: '201', floor: 2 },
                ] 
              }
            }
          }
        ]
      }
    },
    include: { blocks: { include: { rooms: true } } }
  });

  // Boys Hostel 2
  const hostelC = await prisma.hostel.create({
    data: {
      name: 'Boys Hostel 2',
      code: 'BH2',
      blocks: {
        create: [
          {
            name: 'Block A',
            rooms: {
              createMany: {
                data: [
                  { number: '101', floor: 1 },
                  { number: '102', floor: 1 },
                  { number: '201', floor: 2 },
                  { number: '202', floor: 2 },
                ]
              }
            }
          }
        ]
      }
    },
    include: { blocks: { include: { rooms: true } } }
  });

  // Helper to grab specific IDs
  const blockA_BH1 = hostelA.blocks.find(b => b.name === 'Block A')!;
  const blockB_BH1 = hostelA.blocks.find(b => b.name === 'Block B')!;
  const room101_BH1 = blockA_BH1.rooms.find(r => r.number === '101')!;
  const room102_BH1 = blockA_BH1.rooms.find(r => r.number === '102')!;
  const room201_BH1 = blockA_BH1.rooms.find(r => r.number === '201')!;
  const room301_BH1 = blockA_BH1.rooms.find(r => r.number === '301')!;

  const blockA_GH1 = hostelB.blocks.find(b => b.name === 'Block A')!;
  const blockB_GH1 = hostelB.blocks.find(b => b.name === 'Block B')!;
  const room101_GH1 = blockA_GH1.rooms.find(r => r.number === '101')!;
  const room102_GH1 = blockA_GH1.rooms.find(r => r.number === '102')!;
  const room201_GH1 = blockA_GH1.rooms.find(r => r.number === '201')!;

  const blockA_BH2 = hostelC.blocks.find(b => b.name === 'Block A')!;
  const room101_BH2 = blockA_BH2.rooms.find(r => r.number === '101')!;

  // 4. CREATE USERS
  console.log('creating users...');
  
  // ===== STUDENTS =====
  const student1 = await prisma.user.create({
    data: {
      email: 'student@demo.com',
      name: 'Rahul Kumar',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room101_BH1.id,
    }
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'arjun@demo.com',
      name: 'Arjun Sharma',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room102_BH1.id,
    }
  });

  const student3 = await prisma.user.create({
    data: {
      email: 'priya@demo.com',
      name: 'Priya Patel',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      roomId: room101_GH1.id,
    }
  });

  const student4 = await prisma.user.create({
    data: {
      email: 'sneha@demo.com',
      name: 'Sneha Reddy',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      roomId: room102_GH1.id,
    }
  });

  const student5 = await prisma.user.create({
    data: {
      email: 'vikram@demo.com',
      name: 'Vikram Singh',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room201_BH1.id,
    }
  });

  const student6 = await prisma.user.create({
    data: {
      email: 'amit@demo.com',
      name: 'Amit Verma',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelC.id,
      blockId: blockA_BH2.id,
      roomId: room101_BH2.id,
    }
  });

  const student7 = await prisma.user.create({
    data: {
      email: 'kavya@demo.com',
      name: 'Kavya Nair',
      password: 'password123',
      role: UserRole.STUDENT,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      roomId: room201_GH1.id,
    }
  });

  // ===== STAFF =====
  const electrician = await prisma.user.create({
    data: {
      email: 'staff@demo.com',
      name: 'Ramesh Electrician',
      password: 'password123',
      role: UserRole.STAFF,
      specialization: StaffSpecialization.ELECTRICIAN,
      hostelId: hostelA.id,
    }
  });

  const plumber = await prisma.user.create({
    data: {
      email: 'plumber@demo.com',
      name: 'Mohan Plumber',
      password: 'password123',
      role: UserRole.STAFF,
      specialization: StaffSpecialization.PLUMBER,
      hostelId: hostelA.id,
    }
  });

  const itSupport = await prisma.user.create({
    data: {
      email: 'it@demo.com',
      name: 'Rajesh IT',
      password: 'password123',
      role: UserRole.STAFF,
      specialization: StaffSpecialization.IT_SUPPORT,
      hostelId: hostelA.id,
    }
  });

  const carpenter = await prisma.user.create({
    data: {
      email: 'carpenter@demo.com',
      name: 'Sunil Carpenter',
      password: 'password123',
      role: UserRole.STAFF,
      specialization: StaffSpecialization.CARPENTER,
      hostelId: hostelB.id,
    }
  });

  const cleaner = await prisma.user.create({
    data: {
      email: 'cleaner@demo.com',
      name: 'Lakshmi Cleaner',
      password: 'password123',
      role: UserRole.STAFF,
      specialization: StaffSpecialization.CLEANER,
      hostelId: hostelB.id,
    }
  });

  const security = await prisma.user.create({
    data: {
      email: 'security@demo.com',
      name: 'Kumar Security',
      password: 'password123',
      role: UserRole.STAFF,
      specialization: StaffSpecialization.SECURITY,
      hostelId: hostelC.id,
    }
  });

  // ===== ADMINS =====
  const warden = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      name: 'Suresh Warden',
      password: 'password123',
      role: UserRole.ADMIN,
      hostelId: hostelA.id,
    }
  });

  const wardenGH1 = await prisma.user.create({
    data: {
      email: 'warden.gh1@demo.com',
      name: 'Meera Warden',
      password: 'password123',
      role: UserRole.ADMIN,
      hostelId: hostelB.id,
    }
  });

  // 5. CREATE ISSUES
  console.log('creating issues...');

  // Issue 1: Pending (WiFi)
  const issueWifi1 = await prisma.issue.create({
    data: {
      title: 'WiFi not working in Room 101',
      description: 'The router signal is very weak and keeps disconnecting. Unable to attend online classes.',
      priority: Priority.HIGH,
      status: IssueStatus.REPORTED,
      visibility: Visibility.PUBLIC,
      categoryId: catWifi.id,
      reporterId: student1.id,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room101_BH1.id,
    }
  });

  // Issue 2: In Progress (Electrical)
  const issueFan = await prisma.issue.create({
    data: {
      title: 'Ceiling fan making noise',
      description: 'The fan in the corridor is wobbling and making loud grinding noises.',
      priority: Priority.MEDIUM,
      status: IssueStatus.IN_PROGRESS,
      categoryId: catElec.id,
      reporterId: student2.id,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      assigneeId: electrician.id,
    }
  });

  await prisma.comment.create({
    data: {
      content: 'I will check this tomorrow morning.',
      type: CommentType.OFFICIAL_UPDATE,
      userId: electrician.id,
      issueId: issueFan.id,
    }
  });

  // Issue 3: Resolved (Plumbing)
  const issueTap = await prisma.issue.create({
    data: {
      title: 'Leaking tap in bathroom',
      description: 'The bathroom tap has been leaking continuously for 2 days.',
      priority: Priority.HIGH,
      status: IssueStatus.RESOLVED,
      categoryId: catPlumb.id,
      reporterId: student3.id,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      roomId: room101_GH1.id,
      assigneeId: plumber.id,
      resolvedAt: new Date(),
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Tap washer replaced. Issue fixed.',
      type: CommentType.OFFICIAL_UPDATE,
      userId: plumber.id,
      issueId: issueTap.id,
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Thank you! Works perfectly now.',
      type: CommentType.DISCUSSION,
      userId: student3.id,
      issueId: issueTap.id,
    }
  });

  // Issue 4: Critical (Electrical - No Power)
  const issuePower = await prisma.issue.create({
    data: {
      title: 'No power in entire floor',
      description: 'Complete power outage on 2nd floor, Block A. All rooms affected.',
      priority: Priority.EMERGENCY,
      status: IssueStatus.REPORTED,
      visibility: Visibility.PUBLIC,
      categoryId: catElec.id,
      reporterId: student5.id,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room201_BH1.id,
    }
  });

  // Issue 5: Low Priority (Carpentry)
  const issueDoor = await prisma.issue.create({
    data: {
      title: 'Cupboard door hinge broken',
      description: 'The cupboard door hinge is loose and the door is not closing properly.',
      priority: Priority.LOW,
      status: IssueStatus.ASSIGNED,
      categoryId: catCarpentry.id,
      reporterId: student4.id,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      roomId: room102_GH1.id,
      assigneeId: carpenter.id,
    }
  });

  // Issue 6: Cleaning
  const issueCleaning = await prisma.issue.create({
    data: {
      title: 'Common room needs cleaning',
      description: 'The common room on ground floor has not been cleaned for 3 days.',
      priority: Priority.MEDIUM,
      status: IssueStatus.IN_PROGRESS,
      categoryId: catCleaning.id,
      reporterId: student7.id,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      assigneeId: cleaner.id,
    }
  });

  // Issue 7: Security
  const issueSecurity = await prisma.issue.create({
    data: {
      title: 'Main gate lock broken',
      description: 'The main entrance gate lock is not working. Security concern.',
      priority: Priority.HIGH,
      status: IssueStatus.ASSIGNED,
      categoryId: catSecurity.id,
      reporterId: student6.id,
      hostelId: hostelC.id,
      blockId: blockA_BH2.id,
      assigneeId: security.id,
    }
  });

  // Issue 8: WiFi (Girls Hostel)
  const issueWifi2 = await prisma.issue.create({
    data: {
      title: 'Slow internet speed',
      description: 'Internet speed is very slow during evening hours (6-10 PM).',
      priority: Priority.MEDIUM,
      status: IssueStatus.REPORTED,
      visibility: Visibility.PUBLIC,
      categoryId: catWifi.id,
      reporterId: student3.id,
      hostelId: hostelB.id,
      blockId: blockA_GH1.id,
      roomId: room101_GH1.id,
    }
  });

  // Issue 9: Plumbing (Bathroom drainage)
  const issueDrainage = await prisma.issue.create({
    data: {
      title: 'Bathroom drainage blocked',
      description: 'Water is not draining from the bathroom. Strong odor present.',
      priority: Priority.HIGH,
      status: IssueStatus.ASSIGNED,
      categoryId: catPlumb.id,
      reporterId: student2.id,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room102_BH1.id,
      assigneeId: plumber.id,
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Will send the plumber team today evening.',
      type: CommentType.OFFICIAL_UPDATE,
      userId: warden.id,
      issueId: issueDrainage.id,
    }
  });

  // Issue 10: Electrical (Light)
  const issueLight = await prisma.issue.create({
    data: {
      title: 'Room light flickering',
      description: 'The tube light keeps flickering and sometimes goes off completely.',
      priority: Priority.LOW,
      status: IssueStatus.RESOLVED,
      categoryId: catElec.id,
      reporterId: student1.id,
      hostelId: hostelA.id,
      blockId: blockA_BH1.id,
      roomId: room101_BH1.id,
      assigneeId: electrician.id,
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  });

  // Add upvotes to some issues
  await prisma.upvote.create({
    data: {
      userId: student2.id,
      issueId: issueWifi1.id,
    }
  });

  await prisma.upvote.create({
    data: {
      userId: student5.id,
      issueId: issueWifi1.id,
    }
  });

  await prisma.upvote.create({
    data: {
      userId: student4.id,
      issueId: issueWifi2.id,
    }
  });

  // 6. CREATE ANNOUNCEMENTS
  console.log('creating announcements...');
  
  await prisma.announcement.create({
    data: {
      title: 'Water Supply Maintenance',
      content: 'Water supply will be cut off from 10 AM to 2 PM tomorrow for tank cleaning.',
      priority: Priority.HIGH,
      isPinned: true,
      authorId: warden.id,
      targetHostelId: hostelA.id,
    }
  });

  await prisma.announcement.create({
    data: {
      title: 'Hostel Mess Timings Updated',
      content: 'New mess timings: Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM. Please adhere to these timings.',
      priority: Priority.MEDIUM,
      isPinned: true,
      authorId: warden.id,
      targetHostelId: hostelA.id,
    }
  });

  await prisma.announcement.create({
    data: {
      title: 'Electricity Maintenance - Sunday',
      content: 'Electricity will be off on Sunday from 9 AM to 12 PM for electrical maintenance work in Block A.',
      priority: Priority.HIGH,
      isPinned: false,
      authorId: warden.id,
      targetHostelId: hostelA.id,
      targetBlockId: blockA_BH1.id,
    }
  });

  await prisma.announcement.create({
    data: {
      title: 'Visitors Policy Reminder',
      content: 'All visitors must register at the security desk. Visiting hours: 4 PM to 8 PM on weekdays, 10 AM to 8 PM on weekends.',
      priority: Priority.LOW,
      isPinned: false,
      authorId: wardenGH1.id,
      targetHostelId: hostelB.id,
    }
  });

  await prisma.announcement.create({
    data: {
      title: 'WiFi Password Changed',
      content: 'New WiFi password: Hostel2025@Secure. Please update your devices.',
      priority: Priority.MEDIUM,
      isPinned: true,
      authorId: warden.id,
      targetHostelId: hostelA.id,
    }
  });

  await prisma.announcement.create({
    data: {
      title: 'Room Inspection Next Week',
      content: 'Room inspection will be conducted next Tuesday. Please keep your rooms clean and organized.',
      priority: Priority.MEDIUM,
      isPinned: false,
      authorId: wardenGH1.id,
      targetHostelId: hostelB.id,
    }
  });

  // 7. LOST & FOUND
  console.log('creating lost items...');
  
  const lostBottle = await prisma.lostItem.create({
    data: {
      title: 'Blue Water Bottle',
      description: 'Lost my Milton blue water bottle in the common room. Has a sticker of a mountain.',
      status: LostFoundStatus.LOST,
      location: 'Block A Common Room',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      reporterId: student1.id,
      hostelId: hostelA.id,
    }
  });

  await prisma.lostItem.create({
    data: {
      title: 'Black Headphones',
      description: 'Sony WH-1000XM4 black headphones. Lost in the study room.',
      status: LostFoundStatus.LOST,
      location: 'Study Room, 3rd Floor',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      reporterId: student5.id,
      hostelId: hostelA.id,
    }
  });

  const foundCharger = await prisma.lostItem.create({
    data: {
      title: 'iPhone Charger',
      description: 'Found white iPhone charging cable in the corridor.',
      status: LostFoundStatus.FOUND,
      location: 'Block A, 2nd Floor Corridor',
      date: new Date(),
      reporterId: student2.id,
      hostelId: hostelA.id,
    }
  });

  await prisma.lostItem.create({
    data: {
      title: 'Red Backpack',
      description: 'Red color backpack with laptop compartment. Lost near the mess area.',
      status: LostFoundStatus.LOST,
      location: 'Mess Area',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      reporterId: student3.id,
      hostelId: hostelB.id,
    }
  });

  await prisma.lostItem.create({
    data: {
      title: 'Calculator (Scientific)',
      description: 'Casio FX-991EX scientific calculator. Has my name written on back.',
      status: LostFoundStatus.LOST,
      location: 'Library',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      reporterId: student4.id,
      hostelId: hostelB.id,
    }
  });

  const foundWatch = await prisma.lostItem.create({
    data: {
      title: 'Silver Watch',
      description: 'Found a silver wrist watch near the gym area.',
      status: LostFoundStatus.FOUND,
      location: 'Gym Area',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      reporterId: student6.id,
      hostelId: hostelC.id,
    }
  });

  await prisma.lostItem.create({
    data: {
      title: 'Notebook - Data Structures',
      description: 'Purple cover notebook with Data Structures notes.',
      status: LostFoundStatus.LOST,
      location: 'Classroom Block',
      date: new Date(),
      reporterId: student7.id,
      hostelId: hostelB.id,
    }
  });

  const foundKeys = await prisma.lostItem.create({
    data: {
      title: 'Room Keys',
      description: 'Found a bunch of keys with a blue keychain near the main gate.',
      status: LostFoundStatus.FOUND,
      location: 'Main Gate',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      reporterId: security.id,
      hostelId: hostelC.id,
    }
  });

  // Create a claim for one of the found items
  await prisma.lostItemClaim.create({
    data: {
      lostItemId: foundCharger.id,
      claimantId: student5.id,
      description: 'This is my charger, I lost it yesterday in the same location.',
      status: ClaimStatus.PENDING,
    }
  });

  console.log('✅ Seeding finished.');
  console.log('\n📊 Summary:');
  console.log('- Hostels: 3 (BH1, GH1, BH2)');
  console.log('- Users: 16 (7 students, 6 staff, 3 admins)');
  console.log('- Issue Categories: 6');
  console.log('- Issues: 10');
  console.log('- Announcements: 6');
  console.log('- Lost Items: 8');
  console.log('- Comments: 5');
  console.log('- Upvotes: 3');
  console.log('- Claims: 1');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
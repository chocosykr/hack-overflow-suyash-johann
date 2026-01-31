import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notices = await prisma.announcement.findMany({
      where: {
        OR: [
          { targetHostelId: null }, 
          { targetHostelId: session.user.hostelId } 
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notices, { status: 200 });
  } catch (error) {
    console.error("Announcements API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, targetHostelId, priority, expiresAt, isPinned } = body;

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        targetHostelId: targetHostelId || null,
        priority: priority || "MEDIUM",
        isPinned: isPinned || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Announcements POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
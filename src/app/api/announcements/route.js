import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth";

export async function GET() {
  try {
    const session = await auth();
    
    // Safety check: only logged-in users should see announcements
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(session.user);
    const notices = await prisma.announcement.findMany({
      where: {
        OR: [
          { targetHostelId: null }, // Global announcements
          { targetHostelId: session.user.hostelId } // Targeted announcements
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
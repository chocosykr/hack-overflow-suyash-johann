import { NextResponse } from "next/server";
// Adjust these paths based on where your lib and auth folders actually sit
import { prisma } from "../../../lib/prisma"; 
import { auth } from "../../auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hostels = await prisma.hostel.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(hostels);
  } catch (error) {
    console.error("Hostels Fetch Error:", error);
    return NextResponse.json({ error: "Failed to load hostels" }, { status: 500 });
  }
}
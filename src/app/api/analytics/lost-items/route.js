import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const items = await prisma.lostItem.findMany({
      // 1. Added Filter: Only Found or Returned items
      where: {
        status: {
          in: ["FOUND", "RETURNED"], 
        },
      },
      include: {
        reporter: { select: { name: true } },
        claims: {
          include: {
            claimant: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
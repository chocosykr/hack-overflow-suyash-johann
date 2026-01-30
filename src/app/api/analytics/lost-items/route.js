import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const items = await prisma.lostItem.findMany({
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
}

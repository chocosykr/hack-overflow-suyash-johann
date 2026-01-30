import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req, { params }) {
  const { itemId, claimId } = params;

  // approve claim
  const claim = await prisma.lostItemClaim.update({
    where: { id: claimId },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
    },
  });

  // mark item as RETURNED
  await prisma.lostItem.update({
    where: { id: itemId },
    data: { status: "RETURNED" },
  });

  return NextResponse.json(claim);
}

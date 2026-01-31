import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../../lib/prisma";

export async function POST(req, { params }) {
  try {
    // 1. CRITICAL: Await the params in Next.js 15/16
    const resolvedParams = await params;
    const { itemId, claimId } = resolvedParams;

    if (!itemId || !claimId) {
      return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
    }

    // 2. Use a Transaction to ensure both updates succeed or both fail
    const updatedClaim = await prisma.$transaction(async (tx) => {
      // Update the specific claim
      const claim = await tx.lostItemClaim.update({
        where: { id: claimId },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
        },
      });

      // Update the main item status
      await tx.lostItem.update({
        where: { id: itemId },
        data: { status: "RETURNED" },
      });

      return claim;
    });

    return NextResponse.json(updatedClaim);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
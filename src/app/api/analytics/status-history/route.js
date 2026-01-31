import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
// Use the path that finally worked for you in the previous step
import { auth } from "../../../auth"; 

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Extract issueId from the URL query params (e.g., ?issueId=123)
    const { searchParams } = new URL(req.url);
    const issueId = searchParams.get("issueId");

    const history = await prisma.issueStatusHistory.findMany({
      where: issueId ? { issueId } : {}, // Filter if ID exists, else show all
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        issue: { select: { title: true, id: true } },
        changedBy: { select: { name: true } }
      }
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
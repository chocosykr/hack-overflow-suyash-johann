import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    const sinceRaw = url.searchParams.get("since");
    const untilRaw = url.searchParams.get("until");

    // validate dates
    const since = sinceRaw ? new Date(sinceRaw) : null;
    const until = untilRaw ? new Date(untilRaw) : null;
    if (sinceRaw && isNaN(since.getTime())) {
      return NextResponse.json({ error: "Invalid 'since' date" }, { status: 400 });
    }
    if (untilRaw && isNaN(until.getTime())) {
      return NextResponse.json({ error: "Invalid 'until' date" }, { status: 400 });
    }

    // build where clause defensively
    const where = {};
    if (hostelId) where.hostelId = hostelId;
    if (since || until) {
      where.createdAt = {};
      if (since) where.createdAt.gte = since;
      if (until) where.createdAt.lte = until;
    }

    // group by categoryId and count issues
    const groups = await prisma.issue.groupBy({
      by: ["categoryId"],
      where,
      _count: { id: true },
    });

    if (!groups || groups.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const categoryIds = groups.map((g) => g.categoryId).filter(Boolean);
    if (categoryIds.length === 0) {
      // defensive: no valid category ids
      return NextResponse.json([], { status: 200 });
    }

    const categories = await prisma.issueCategory.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

    const result = groups
      .map((g) => ({
        name: catMap[g.categoryId] ?? "Unknown",
        issues: g._count?.id ?? 0,
      }))
      .sort((a, b) => b.issues - a.issues);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // log full error for server-side debugging
    console.error("GET /api/analytics/categories error:", err?.message ?? err, err?.stack ?? "");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

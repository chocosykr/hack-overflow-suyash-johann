import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../auth";

// Define what "Active" means consistently across the app
const ACTIVE_STATUSES = ["REPORTED", "ASSIGNED", "IN_PROGRESS"];

export async function GET(req) {
  try {
    // 1. Strict Access Control
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const hostelId = url.searchParams.get("hostelId");
    const sinceRaw = url.searchParams.get("since");
    const untilRaw = url.searchParams.get("until");

    const since = sinceRaw ? new Date(sinceRaw) : null;
    const until = untilRaw ? new Date(untilRaw) : null;

    // 2. Build 'where' clause
    const where = {
      isDuplicate: false,
      status: { in: ACTIVE_STATUSES }, // 🔹 ONLY ACTIVE ISSUES
    };

    if (hostelId) where.hostelId = hostelId;
    if (since || until) {
      where.createdAt = {};
      if (since) where.createdAt.gte = since;
      if (until) where.createdAt.lte = until;
    }

    // 3. Group by category and count
    const groups = await prisma.issue.groupBy({
      by: ["categoryId"],
      where,
      _count: { id: true },
    });

    if (!groups.length) return NextResponse.json([]);

    const categoryIds = groups.map((g) => g.categoryId).filter(Boolean);

    // 4. Resolve Category Names
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

    return NextResponse.json(result);
  } catch (err) {
    console.error("Category Analytics error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// /app/api/analytics/categories/route.js
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since");   // optional
    const hostel = searchParams.get("hostel"); // optional

    const where = {};

    if (since) {
      where.createdAt = { gte: new Date(since) };
    }

    if (hostel) {
      where.hostelName = hostel;
    }

    const grouped = await prisma.issue.groupBy({
      by: ["category"],
      where,
      _count: { category: true },
    });

    const data = grouped.map((g) => ({
      name: g.category,
      issues: g._count.category,
    }));

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch category analytics" }),
      { status: 500 }
    );
  }
}

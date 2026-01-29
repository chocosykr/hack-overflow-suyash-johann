// /app/api/analytics/summary/route.js
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Active Issues
    const activeIssues = await prisma.issue.count({
      where: { status: { in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"] } },
    });

    // Avg Resolution Time (in hours)
    const resolvedIssues = await prisma.issue.findMany({
      where: { status: "RESOLVED" },
      select: { createdAt: true, updatedAt: true },
    });

    const avgResolution =
      resolvedIssues.length > 0
        ? Math.round(
            resolvedIssues.reduce(
              (sum, i) => sum + (i.updatedAt - i.createdAt) / (1000 * 60 * 60),
              0
            ) / resolvedIssues.length
          )
        : 0;

    // Resolved this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const resolvedThisMonth = await prisma.issue.count({
      where: { status: "RESOLVED", updatedAt: { gte: startOfMonth } },
    });

    // Occupancy (total users)
    const occupancy = await prisma.user.count();

    return new Response(
      JSON.stringify({
        activeIssues,
        avgResolution: `${avgResolution}h`,
        resolvedThisMonth,
        occupancy,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch summary" }), {
      status: 500,
    });
  }
}

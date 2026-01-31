import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // 1. Parallel execution for high performance
    const [activeIssues, resolvedIssues, occupancy] = await Promise.all([
      // Count issues that are currently being worked on
      prisma.issue.count({
        where: {
          isDuplicate: false,
          status: { in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"] },
        },
      }),

      // Fetch timestamps for the average calculation
      // Using resolvedAt as per your schema
      prisma.issue.findMany({
        where: { 
          status: "RESOLVED",
          resolvedAt: { not: null } // Safety check
        },
        select: {
          createdAt: true,
          resolvedAt: true,
        },
      }),

      // Count students
      prisma.user.count({
        where: { role: "STUDENT" },
      }),
    ]);

    // 2. Calculate Average Resolution Time
    let avgResolution = 0;
    if (resolvedIssues.length > 0) {
      const totalTimeMs = resolvedIssues.reduce((sum, issue) => {
        // resolvedAt is the definitive timestamp for the fix
        const duration = issue.resolvedAt.getTime() - issue.createdAt.getTime();
        return sum + duration;
      }, 0);

      // (Total MS / Count) / (MS in an hour)
      avgResolution = Math.round(
        totalTimeMs / resolvedIssues.length / (1000 * 60 * 60)
      );
    }

    // 3. Monthly Metrics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const resolvedThisMonth = await prisma.issue.count({
      where: {
        status: "RESOLVED",
        resolvedAt: { gte: startOfMonth },
      },
    });

    return Response.json({
      activeIssues,
      avgResolution: `${avgResolution}h`,
      resolvedThisMonth,
      occupancy,
    });
    
  } catch (err) {
    console.error("Summary API error:", err);
    return Response.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 }
    );
  }
}
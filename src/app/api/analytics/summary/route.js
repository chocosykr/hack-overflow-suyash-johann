import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Active issues
    const activeIssues = await prisma.issue.count({
      where: {
        status: {
          in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"],
        },
      },
    });

    // Avg resolution time (using updatedAt)
    const resolvedIssues = await prisma.issue.findMany({
      where: { status: "RESOLVED" },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const avgResolution =
      resolvedIssues.length === 0
        ? 0
        : Math.round(
            resolvedIssues.reduce((sum, i) => {
              return (
                sum +
                (i.updatedAt.getTime() - i.createdAt.getTime()) /
                  (1000 * 60 * 60)
              );
            }, 0) / resolvedIssues.length
          );

    // Resolved this month
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const resolvedThisMonth = await prisma.issue.count({
      where: {
        status: "RESOLVED",
        updatedAt: { gte: startOfMonth },
      },
    });

    // Occupancy = number of students
    const occupancy = await prisma.user.count({
      where: { role: "STUDENT" },
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

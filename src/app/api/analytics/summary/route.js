import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Strict Access Control
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parallel execution for high performance
    // Note: We include private issues because Admins need a total workload view
    const [activeIssues, resolvedIssues, occupancy] = await Promise.all([
      // Count unique open issues
      prisma.issue.count({
        where: {
          isDuplicate: false,
          status: { in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"] },
        },
      }),

      // Fetch timestamps for accurate average calculation
      prisma.issue.findMany({
        where: {
          status: "RESOLVED",
          resolvedAt: { not: null } 
        },
        select: {
          createdAt: true,
          resolvedAt: true,
        },
      }),

      // Count total student population
      prisma.user.count({
        where: { role: "STUDENT" },
      }),
    ]);

    // 3. Robust Average Resolution Time Calculation
    let avgResolution = 0;
    const validIssues = resolvedIssues.filter(
      issue => issue.resolvedAt.getTime() > issue.createdAt.getTime()
    );

    if (validIssues.length > 0) {
      const totalTimeMs = validIssues.reduce(
        (sum, issue) => sum + (issue.resolvedAt.getTime() - issue.createdAt.getTime()), 
        0
      );
      
      // Convert MS to Hours
      avgResolution = Math.round(totalTimeMs / validIssues.length / (1000 * 60 * 60));
    }

    // 4. Monthly Performance Metric
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const resolvedThisMonth = await prisma.issue.count({
      where: {
        status: "RESOLVED",
        resolvedAt: { gte: startOfMonth },
        isDuplicate: false, // Standardize duplicate handling
      },
    });

    return NextResponse.json({
      activeIssues,
      avgResolution: `${avgResolution}h`,
      resolvedThisMonth,
      occupancy,
    });

  } catch (err) {
    console.error("Summary API error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
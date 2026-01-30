// /app/api/analytics/hostel-heatmap/route.js
import { prisma } from "@/lib/prisma";

const OPEN_STATUSES = ["REPORTED", "ASSIGNED", "IN_PROGRESS"];
const HIGH_PRIORITY = ["HIGH", "EMERGENCY"];

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      where: {
        visibility: "PUBLIC",
      },
      select: { 
        priority: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        hostel: {
          select: { name: true },
        },
        block: {
          select: { name: true },
        },
      },
    });

    const map = {};

    for (const issue of issues) {
      const hostelName = issue.hostel?.name ?? "Unknown";
      const blockName = issue.block?.name ?? "Unknown";
      const key = `${hostelName}_${blockName}`;

      map[key] ??= {
        hostel: hostelName,
        block: blockName,
        openCount: 0,
        highPriorityCount: 0,
        resolutionSum: 0,
        resolvedCount: 0,
      };

      const cell = map[key];

      if (OPEN_STATUSES.includes(issue.status)) {
        cell.openCount++;

        if (HIGH_PRIORITY.includes(issue.priority)) {
          cell.highPriorityCount++;
        }
      }

      if (issue.status === "RESOLVED") {
        cell.resolvedCount++;
        cell.resolutionSum +=
          (issue.updatedAt - issue.createdAt) / (1000 * 60 * 60);
      }
    }

    const data = Object.values(map).map(c => ({
      hostel: c.hostel,
      block: c.block,
      count: c.openCount,
      pendingCount: c.openCount,
      highPriorityCount: c.highPriorityCount,
      avgResolutionHours:
        c.resolvedCount > 0
          ? Number((c.resolutionSum / c.resolvedCount).toFixed(1))
          : 0,
    }));

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch hostel heatmap data" }),
      { status: 500 }
    );
  }
}

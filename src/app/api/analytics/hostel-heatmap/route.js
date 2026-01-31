import { prisma } from "../../../../lib/prisma";

const OPEN_STATUSES = ["REPORTED", "ASSIGNED", "IN_PROGRESS"];
const HIGH_PRIORITY = ["HIGH", "EMERGENCY"];

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      // REMOVED `where: { visibility: "PUBLIC" }`
      // Analytics should typically show ALL data, regardless of visibility.
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
        totalCount: 0, // NEW: Tracks everything (Closed + Resolved + Open)
        openCount: 0,  // Tracks backlog (Reported + Assigned + In Progress)
        highPriorityCount: 0,
        resolutionSum: 0,
        resolvedCount: 0,
      };

      const cell = map[key];

      // 1. Always increment Total Count
      cell.totalCount++;

      // 2. Count Open / Pending Issues (Includes IN_PROGRESS)
      if (OPEN_STATUSES.includes(issue.status)) {
        cell.openCount++;

        if (HIGH_PRIORITY.includes(issue.priority)) {
          cell.highPriorityCount++;
        }
      }

      // 3. Calculation for Resolution Time
      if (issue.status === "RESOLVED") {
        cell.resolvedCount++;
        // Calculate hours difference
        const created = new Date(issue.createdAt);
        const updated = new Date(issue.updatedAt);
        const diffHours = (updated - created) / (1000 * 60 * 60);
        
        // Safety check to ensure valid numbers
        if (!isNaN(diffHours)) {
            cell.resolutionSum += diffHours;
        }
      }
    }

    const data = Object.values(map).map(c => ({
      hostel: c.hostel,
      block: c.block,
      count: c.totalCount, // FIXED: Now shows Total volume
      pendingCount: c.openCount, // Shows specific backlog
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
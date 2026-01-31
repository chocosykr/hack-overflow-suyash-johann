import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../auth"; // 🔹 Ensure this import exists

const OPEN_STATUSES = ["REPORTED", "ASSIGNED", "IN_PROGRESS"];
const HIGH_PRIORITY = ["HIGH", "EMERGENCY"];

export async function GET(request) {
  try {
    const session = await auth();
    
    // 🔹 STRICT RULE: Only Admins/Staff should access analytics
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetHostel = searchParams.get("hostel");
    const targetBlock = searchParams.get("block");

    // 🔹 SINCE IT'S ADMIN-ONLY: 
    // We remove the visibility filter entirely so Admins see EVERYTHING (Public + Private)
    const baseWhere = {
      isDuplicate: false,
      status: { notIn: ["CLOSED"] },
    };

    // --- MODE A: DRILLDOWN ---
    if (targetHostel && targetBlock) {
      const issues = await prisma.issue.findMany({
        where: {
          ...baseWhere,
          hostel: { name: targetHostel },
          block: { name: targetBlock },
          status: { in: OPEN_STATUSES } 
        },
        include: {
          category: { select: { name: true } },
          hostel: { select: { name: true } },
          block: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ data: issues });
    }

    // --- MODE B: HEATMAP GRID ---
    const issues = await prisma.issue.findMany({
      where: baseWhere,
      select: {
        priority: true,
        status: true,
        hostel: { select: { name: true } },
        block: { select: { name: true } },
      },
    });

    const map = {};
    for (const issue of issues) {
      const hName = issue.hostel?.name ?? "Unknown";
      const bName = issue.block?.name ?? "Unknown";
      const key = `${hName}_${bName}`;

      map[key] ??= { hostel: hName, block: bName, count: 0, highPriorityCount: 0 };

      if (OPEN_STATUSES.includes(issue.status)) {
        map[key].count++;
        if (HIGH_PRIORITY.includes(issue.priority)) {
          map[key].highPriorityCount++;
        }
      }
    }

    return NextResponse.json(Object.values(map));
  } catch (err) {
    console.error("Heatmap API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

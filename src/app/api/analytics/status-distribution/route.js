// /app/api/analytics/status-distribution/route.js
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const resolvedCount = await prisma.issue.count({
      where: { status: "RESOLVED" },
    });

    const inProgressCount = await prisma.issue.count({
      where: { status: "IN_PROGRESS" },
    });

    const pendingCount = await prisma.issue.count({
      where: { status: { in: ["REPORTED", "ASSIGNED"] } },
    });

    const data = [
      { name: "Resolved", value: resolvedCount, color: "#10b981" },
      { name: "In Progress", value: inProgressCount, color: "#f59e0b" },
      { name: "Pending", value: pendingCount, color: "#ef4444" },
    ];

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch status distribution" }), { status: 500 });
  }
}

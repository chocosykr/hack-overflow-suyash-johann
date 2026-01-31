import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../auth";

export async function GET() {
  try {
    const session = await auth();
    
    // Strict Admin-only check
    if (!session?.user || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Standard filter to exclude duplicates for accuracy
    const baseWhere = { isDuplicate: false };

    const [resolvedCount, inProgressCount, pendingCount] = await Promise.all([
      prisma.issue.count({ where: { ...baseWhere, status: "RESOLVED" } }),
      prisma.issue.count({ where: { ...baseWhere, status: "IN_PROGRESS" } }),
      prisma.issue.count({ where: { ...baseWhere, status: { in: ["REPORTED", "ASSIGNED"] } } }),
    ]);

    const data = [
      { name: "Resolved", value: resolvedCount, color: "#10b981" },
      { name: "In Progress", value: inProgressCount, color: "#f59e0b" },
      { name: "Pending", value: pendingCount, color: "#ef4444" },
    ];

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth";

function clean(val) {
  if (!val) return null;
  return String(val).split(/[?&]/)[0].trim();
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role ?? "STUDENT";

    const { searchParams } = new URL(request.url);

    const hostel = clean(searchParams.get("hostel"));
    const block = clean(searchParams.get("block"));
    const status = clean(searchParams.get("status"));
    const search = clean(searchParams.get("search"));
    const assigneeId = clean(searchParams.get("assigneeId"));
    const reporterId = clean(searchParams.get("reporterId"));
    const specialization = clean(searchParams.get("specialization"));
    const priority = clean(searchParams.get("priority"));
    const visibility = clean(searchParams.get("visibility"));

    const sort = clean(searchParams.get("sort")) || "newest";
    const page = Math.max(1, Number(clean(searchParams.get("page")) || 1));
    const limit = Math.min(100, Math.max(5, Number(clean(searchParams.get("limit")) || 15)));
    const skip = (page - 1) * limit;

    const unresolvedOnly = clean(searchParams.get("unresolved")) !== "false";
    const isSpecificView = Boolean(reporterId || assigneeId || search || status === "ALL");

    const where = {};

    /* ---------- LOCATION FILTERS (FIXED) ---------- */
    if (hostel) {
      where.hostel = {
        name: { contains: hostel, mode: "insensitive" },
      };
    }

    if (block) {
      where.block = {
        name: { contains: block, mode: "insensitive" },
      };
    }

    /* ---------- OWNERSHIP ---------- */
    if (assigneeId) where.assigneeId = assigneeId;
    if (reporterId) where.reporterId = reporterId;

    /* ---------- METADATA ---------- */
    if (priority) where.priority = priority;
    if (specialization) {
      where.category = { specialization };
    }

    /* ---------- SEARCH ---------- */
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { id: { contains: search, mode: "insensitive" } },
        { hostel: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    /* ---------- STATUS ---------- */
    if (status && status !== "ALL") {
      where.status = status;
    } else if (unresolvedOnly && !isSpecificView) {
      where.status = { notIn: ["CLOSED"] };
    }

    /* ---------- DUPLICATES ---------- */
    if (!isSpecificView && userRole !== "ADMIN") {
      where.isDuplicate = false;
    }

    /* ---------- VISIBILITY (FIXED) ---------- */
    if (userRole === "ADMIN") {
      if (visibility && visibility !== "ALL") {
        where.visibility = visibility.toUpperCase(); // PUBLIC / PRIVATE
      }
    } else {
      // Students NEVER see private issues
      where.visibility = "PUBLIC";
    }

    const orderBy =
      sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const include = {
      _count: { select: { upvotes: true } },
      hostel: { select: { name: true } },
      block: { select: { name: true } },
      room: { select: { number: true } },
      category: { select: { name: true, specialization: true } },
      mergedWith: { select: { id: true, status: true, title: true } },
    };

    if (userId) {
      include.upvotes = {
        where: { userId },
        select: { userId: true },
      };
    }

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        orderBy,
        include,
        skip,
        take: limit,
      }),
      prisma.issue.count({ where }),
    ]);

   return NextResponse.json(
  {
    data: issues,   // For Management/Admin dashboard
    issues: issues, // For Student ClientDashboard compatibility
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  },
  { status: 200 }
);
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

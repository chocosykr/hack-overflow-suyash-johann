import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter & Search Params
    const hostel = searchParams.get("hostel");
    const block = searchParams.get("block");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";

    // Pagination Params
    const unresolvedOnly = searchParams.get("unresolved") !== "false";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit") || 25)));
    const skip = (page - 1) * limit;

    // TODO: Replace with real auth logic
    const userId = null;
    const role = "STUDENT";

    /** ------------------------
     * Build WHERE clause
     * ------------------------ */
    const where = {
      isDuplicate: false,
      
      // Role-based visibility
      ...(role !== "ADMIN" && { visibility: "PUBLIC" }),

      // Specific filters
      ...(hostel && { hostelName: hostel }),
      ...(block && { blockName: block }),
      ...(priority && { priority }),

      // Search logic (ID, Title, or Hostel Name)
      ...(search && {
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { hostelName: { contains: search, mode: "insensitive" } },
        ],
      }),

      // Status logic: Specific status takes precedence over "unresolvedOnly"
      ...(status && status !== "ALL"
        ? { status }
        : unresolvedOnly && !status
        ? { status: { notIn: ["RESOLVED", "CLOSED"] } }
        : {}),
    };

    /** ------------------------
     * Handle Sorting & Relations
     * ------------------------ */
    const orderBy = sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const include = {
      _count: { select: { upvotes: true } },
    };

    if (userId) {
      include.upvotes = {
        where: { userId },
        select: { userId: true },
      };
    }

    // Execute Query
    const issues = await prisma.issue.findMany({
      where,
      orderBy,
      include,
      skip,
      take: limit,
    });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
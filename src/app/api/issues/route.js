
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth"; // Import your auth utility

export async function GET(request) {
  try {

    const session = await auth(); // Get the actual session
    const userId = session?.user?.id || null; // Identify the user
    const role = session?.user?.role || "STUDENT"; // Default to student

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


    /** ------------------------
     * Build WHERE clause
     * ------------------------ */
    const where = {
      isDuplicate: false,

      ...(role !== "ADMIN" && { visibility: "PUBLIC" }),

      ...(hostel && {
        hostel: { name: hostel },
      }),

      ...(block && {
        block: { name: block },
      }),

      ...(priority && { priority }),

      ...(search && {
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          {
            hostel: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }),

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
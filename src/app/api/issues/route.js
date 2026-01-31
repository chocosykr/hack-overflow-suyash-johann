import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;
    const role = session?.user?.role || "STUDENT";

    const { searchParams } = new URL(request.url);

    const hostel = searchParams.get("hostel");
    const block = searchParams.get("block");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const visibility = searchParams.get("visibility");

    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit") || 15)));
    const skip = (page - 1) * limit;

    /** --- Build WHERE clause --- **/
    const where = {
      isDuplicate: false,
      // CORRECTED: Combined security and filter logic into one block
      ...(role !== "ADMIN" 
        ? { visibility: "PUBLIC" } 
        : (visibility && visibility !== "all" 
            ? { visibility: visibility.toUpperCase() } 
            : {})
      ),
      ...(hostel && { hostel: { name: hostel } }),
      ...(block && { block: { name: block } }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { hostel: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
      ...(status && status !== "ALL"
        ? { status }
        : { status: { notIn: ["RESOLVED", "CLOSED"] } }),
    };

    const orderBy = sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const include = {
      _count: { select: { upvotes: true } },
      hostel: { select: { name: true } },
      block: { select: { name: true } },
      category: { select: { name: true } },
    };

    if (userId) {
      include.upvotes = { where: { userId }, select: { userId: true } };
    }

    const [issues, totalCount] = await Promise.all([
      prisma.issue.findMany({ where, orderBy, include, skip, take: limit }),
      prisma.issue.count({ where })
    ]);

    return NextResponse.json({
      data: issues,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
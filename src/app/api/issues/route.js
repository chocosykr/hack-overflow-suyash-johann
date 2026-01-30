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
    const search = searchParams.get("search");
    const unresolvedOnly = searchParams.get("unresolved") !== "false";
    const assigneeId = searchParams.get("assigneeId"); // New param
    const specialization = searchParams.get("specialization"); // New param

    // ... (Pagination logic remains the same) ...
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit") || 25)));
    const skip = (page - 1) * limit;

    const where = {
      isDuplicate: false,
      ...(role !== "ADMIN" && { visibility: "PUBLIC" }),
      
      // FIX: Filter via relations, not flat fields
      ...(hostel && { hostel: { name: hostel } }), 
      ...(block && { block: { name: block } }),

      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          // FIX: Search inside the related Hostel model
          { hostel: { name: { contains: search, mode: "insensitive" } } }, 
        ],
      }),

      ...(status && status !== "ALL"
        ? { status }
        : unresolvedOnly && !status
        ? { status: { notIn: ["RESOLVED", "CLOSED"] } }
        : {}),

        ...(assigneeId && { assigneeId }),

        ...(specialization && { 
     category: { 
        specialization: specialization 
     } 
     }),

    };

    const include = {
      _count: { select: { upvotes: true } },
      // NEW: Fetch the location details
      hostel: { select: { name: true } },  
      block: { select: { name: true } },
      room: { select: { number: true } },
      category: { select: { name: true } } // Fetch category name if it's a relation
    };

    if (userId) {
      include.upvotes = {
        where: { userId },
        select: { userId: true },
      };
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include,
      skip,
      take: limit,
    });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
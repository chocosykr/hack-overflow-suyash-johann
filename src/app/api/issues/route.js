import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;
    const userRole = session?.user?.role || "STUDENT";

    const { searchParams } = new URL(request.url);
    const hostel = searchParams.get("hostel");
    const block = searchParams.get("block");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const assigneeId = searchParams.get("assigneeId");
    const specialization = searchParams.get("specialization");
    const priority =searchParams.get("priority");
    
    // 1. NEW PARAM: Allow filtering by Reporter (for "My Issues")
    const reporterId = searchParams.get("reporterId"); 
    
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(5, Number(searchParams.get("limit") || 25)));
    const skip = (page - 1) * limit;

    // 2. LOGIC: When should we show duplicates/closed issues?
    // If we are searching, looking at "My Issues", or looking at "Assigned to Me", show everything.
    // Otherwise (Public Feed), hide duplicates and closed issues.
    const isSpecificView = reporterId || assigneeId || search || status === "ALL";

    // Default "Unresolved" logic: Only apply if we are NOT in a specific view
    // (e.g. In "My Issues", I want to see my Closed/Duplicate issues too)
    const unresolvedOnly = searchParams.get("unresolved") !== "false";

    const where = {
      // REMOVED "isDuplicate: false" from here. We handle it conditionally below.
      
      ...(hostel && { hostel: { name: hostel } }), 
      ...(block && { block: { name: block } }),
      ...(assigneeId && { assigneeId }),
      ...(reporterId && { reporterId }), // Add to query
      ...(priority && { priority }),
      
      ...(specialization && { 
         category: { specialization: specialization } 
      }),

      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { hostel: { name: { contains: search, mode: "insensitive" } } }, 
        ],
      }),
    };

    // --- CONDITIONAL FILTERS ---

    // A. Status Filter
    if (status && status !== "ALL") {
      where.status = status;
    } else if (unresolvedOnly && !isSpecificView) {
      // If public feed, hide CLOSED (keep RESOLVED visible)
      where.status = { notIn: ["CLOSED"] };
    }

    // B. Duplicate Filter
    // Hide duplicates ONLY if it's the public feed
    if (!isSpecificView && userRole !== 'ADMIN') {
      where.isDuplicate = false;
    }

    // ---------------------------

    const orderBy = sort === "oldest" ? { createdAt: "asc" } : { createdAt: "desc" };

    const include = {
      _count: { select: { upvotes: true } },
      hostel: { select: { name: true } },  
      block: { select: { name: true } },
      room: { select: { number: true } },
      category: { select: { name: true } },
      
      // 3. IMPORTANT: Include merged issue details so the card can link to it
      mergedWith: { select: { id: true, status: true, title: true } } 
    };

    if (userId) {
      include.upvotes = {
        where: { userId },
        select: { userId: true },
      };
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy,
      include,
      skip,
      take: limit,
    });

    return NextResponse.json({ issues }, { status: 200 }); // Return object structure consistently
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
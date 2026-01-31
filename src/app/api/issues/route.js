import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../auth";

// Helper from 'main' branch
function clean(val) {
  if (!val) return null;
  return String(val).split(/[?&]/)[0].trim();
}

export async function GET(request) {
  try {
    const session = await auth();
    // Allow public fetch if needed, but usually restrict
    // const userId = session?.user?.id || null; // If you want to allow guests
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.role ?? "STUDENT";

    const { searchParams } = new URL(request.url);

    // 1. EXTRACT & CLEAN PARAMS (Merged list)
    const hostel = clean(searchParams.get("hostel"));
    const block = clean(searchParams.get("block"));
    const status = clean(searchParams.get("status"));
    const search = clean(searchParams.get("search"));
    const assigneeId = clean(searchParams.get("assigneeId"));
    const reporterId = clean(searchParams.get("reporterId"));
    const specialization = clean(searchParams.get("specialization"));
    const priority = clean(searchParams.get("priority"));
    const category = clean(searchParams.get("category")); // From HEAD
    const visibility = clean(searchParams.get("visibility"));

    const sort = clean(searchParams.get("sort")) || "newest";
    
    // Pagination (from main)
    const page = Math.max(1, Number(clean(searchParams.get("page")) || 1));
    const limit = Math.min(100, Math.max(5, Number(clean(searchParams.get("limit")) || 15)));
    const skip = (page - 1) * limit;

    const unresolvedOnly = clean(searchParams.get("unresolved")) !== "false";

    // "Specific View" allows seeing duplicates and private issues (e.g. My Issues, Search)
    const isSpecificView = Boolean(reporterId || assigneeId || search || status === "ALL");

    // 2. CONSTRUCT 'WHERE' CLAUSE
    const where = {
      // Direct filters
      ...(hostel && { hostel: { name: hostel } }), 
      ...(block && { block: { name: block } }),
      ...(assigneeId && { assigneeId }),
      ...(reporterId && { reporterId }),
      ...(priority && { priority }),
      
      // Category Filter (From HEAD)
      ...(category && category !== "All Categories" && { 
         category: { name: category } 
      }),
      
      // Specialization Filter (for Staff)
      ...(specialization && { 
         category: { specialization: specialization } 
      }),

      // Search Logic (Combined: Title + Hostel + ID)
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { id: { contains: search, mode: "insensitive" } }, // Added ID search from main
          { hostel: { name: { contains: search, mode: "insensitive" } } }, 
        ],
      }),
    };

    // 3. STATUS FILTER
    if (status && status !== "ALL") {
      where.status = status;
    } else if (unresolvedOnly && !isSpecificView) {
      where.status = { notIn: ["CLOSED"] };
    }

    // 4. DUPLICATE FILTER
    // Only hide duplicates if browsing the public feed
    if (!isSpecificView && userRole !== "ADMIN") {
      where.isDuplicate = false;
    }

    // 5. VISIBILITY FILTER (The Fix)
    // Admin sees filter choice. Students see PUBLIC, UNLESS it's their own issue (isSpecificView)
    if (userRole === "ADMIN") {
      if (visibility && visibility !== "ALL") {
        where.visibility = visibility.toUpperCase();
      }
    } else {
      // If I'm not looking at a specific view (like "My Reports"), force PUBLIC
      if (!isSpecificView) {
        where.visibility = "PUBLIC";
      }
    }

    // 6. SORTING LOGIC (From HEAD - supports Priority/Upvotes)
    let orderBy;
    if (sort === 'priority') {
      orderBy = [
        { priority: "desc" }, 
        { createdAt: "desc" }
      ];
    } else if (sort === 'oldest') {
      orderBy = { createdAt: "asc" };
    } else if (sort === 'most_upvoted') {
       orderBy = { upvotes: { _count: "desc" } };
    } else {
      orderBy = { createdAt: "desc" };
    }

    // 7. INCLUDES
    const include = {
      _count: { select: { upvotes: true } },
      hostel: { select: { name: true } },
      block: { select: { name: true } },
      room: { select: { number: true } },
      category: { select: { name: true, specialization: true } },
      mergedWith: { select: { id: true, status: true, title: true } }, // Important for UI
    };

    if (userId) {
      include.upvotes = {
        where: { userId },
        select: { userId: true },
      };
    }

    // 8. FETCH DATA & COUNT (Parallel for performance)
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

    // 9. RETURN UNIFIED RESPONSE
    // Returns 'issues' (for Student Dashboard) AND 'data' (for Admin/Teammate's Dashboard)
    return NextResponse.json(
      {
        issues: issues, 
        data: issues,   
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
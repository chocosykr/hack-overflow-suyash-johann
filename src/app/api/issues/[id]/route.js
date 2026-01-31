// /app/api/issues/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../auth";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        reporter: { select: { name: true, email: true } },
        hostel: { select: { name: true } },
        block: { select: { name: true } },
        room: { select: { number: true } },
        category: { select: { name: true } },
      },
    });

    if (!issue) {
      return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });
    }

    // 🔒 permission check AFTER fetch
    const canView =
      issue.visibility === "PUBLIC" ||
      issue.reporterId === session.user.id ||
      issue.assigneeId === session.user.id;

    if (!canView) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, issue });
  } catch (err) {
    console.error("Detail API Error:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

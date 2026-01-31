import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../auth";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const issue = await prisma.issue.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { name: true, email: true } },
        hostel: { select: { name: true } },
        block: { select: { name: true } },
        category: { select: { name: true } },
      }
    });

    if (!issue) return NextResponse.json({ success: false, error: "Not Found" }, { status: 404 });

    return NextResponse.json({ success: true, issue });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ─── POST /api/projects ─────────────────────────────────
// Save a completed booth session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const session = await prisma.boothSession.create({
      data: {
        templateId: body.templateId || null,
        layout: body.layout || "portrait",
        filter: body.filter || "normal",
        photoCount: body.photoCount || 4,
        resultUrl: body.resultUrl || null,
        metadata: JSON.stringify(body.metadata || {}),
      },
    });

    return NextResponse.json(
      { success: true, data: session },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save project" },
      { status: 500 }
    );
  }
}

// ─── GET /api/projects ──────────────────────────────────
// Get booth sessions (optional)
export async function GET() {
  try {
    const sessions = await prisma.boothSession.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { incrementUsage } from "@/lib/services/template-service";

// ─── POST /api/templates/[id]/usage ─────────────────────
// Increment usage count for a template
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await incrementUsage(id);

    return NextResponse.json({
      success: true,
      data: { usageCount: template.usageCount },
    });
  } catch (error) {
    console.error("[POST /api/templates/[id]/usage]", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment usage" },
      { status: 500 }
    );
  }
}

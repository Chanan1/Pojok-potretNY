import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getTemplateById, updateTemplate, deleteTemplate } from "@/lib/services/template-service";
import { updateTemplateSchema } from "@/lib/validators/template";

// ─── GET /api/templates/[id] ────────────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await getTemplateById(id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error("[GET /api/templates/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/templates/[id] ──────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = updateTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const template = await updateTemplate(id, parsed.data);

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error("[PATCH /api/templates/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/templates/[id] ─────────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTemplate(id);

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("[DELETE /api/templates/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

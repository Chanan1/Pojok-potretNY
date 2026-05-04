import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getTemplates, createTemplate } from "@/lib/services/template-service";
import { templateQuerySchema, createTemplateSchema } from "@/lib/validators/template";
import { getSession } from "@/lib/auth";
import { ensureUser } from "@/lib/services/user-service";

// ─── GET /api/templates ─────────────────────────────────
// List templates with pagination, filtering, and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const parsed = templateQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await getTemplates(parsed.data);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[GET /api/templates]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// ─── POST /api/templates ────────────────────────────────
// Create a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Get current user from session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const user = await ensureUser(session.userId, session.username);

    const template = await createTemplate(parsed.data, user.id);

    return NextResponse.json(
      { success: true, data: template },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/templates]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    );
  }
}

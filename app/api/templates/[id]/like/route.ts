import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/services/template-service";
import { getSession } from "@/lib/auth";
import { ensureUser } from "@/lib/services/user-service";

// ─── POST /api/templates/[id]/like ──────────────────────
// Toggle like on a template
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const user = await ensureUser(session.userId, session.username);

    const result = await toggleLike(user.id, id);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[POST /api/templates/[id]/like]", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

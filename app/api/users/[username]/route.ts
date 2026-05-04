import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { getUserByUsername, updateUserProfile } from "@/lib/services/user-service";
import { updateUserSchema } from "@/lib/validators/user";

// ─── GET /api/users/[username] ──────────────────────────
// Get creator profile with templates and stats
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const user = await getUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[GET /api/users/[username]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// ─── PATCH /api/users/[username] ────────────────────────
// Update creator profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Find user by username first
    const existing = await getUserByUsername(username);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updated = await updateUserProfile(existing.id, parsed.data);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PATCH /api/users/[username]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

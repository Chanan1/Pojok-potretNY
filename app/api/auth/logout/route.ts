import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { destroySession } from "@/lib/auth";

export async function POST() {
  destroySession();
  return NextResponse.json({ success: true });
}

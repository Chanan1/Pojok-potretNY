import { NextRequest, NextResponse } from "next/server";
import { handleTemplateUpload } from "@/lib/services/upload-service";

// ─── POST /api/upload ───────────────────────────────────
// Upload a file (template image) to local disk
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: PNG, JPEG, WEBP" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File too large. Max 10MB" },
        { status: 400 }
      );
    }

    const url = await handleTemplateUpload(file);

    return NextResponse.json(
      { success: true, data: { url, filename: file.name, size: file.size } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}

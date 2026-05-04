import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Ensures the upload directory exists.
 */
function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Save a file buffer to local disk and return the public URL.
 */
export async function uploadFile(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  ensureUploadDir();

  const ext = path.extname(originalName) || ".png";
  // Sanitize filename and remove any directory traversal attempts
  const safeName = `${uuidv4()}${ext.replace(/[^a-z0-9.]/gi, '')}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  fs.writeFileSync(filePath, buffer);

  // Return the public-accessible URL
  return `/uploads/${safeName}`;
}

/**
 * Delete a file from local disk given its public URL.
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  const filename = publicUrl.replace("/uploads/", "");
  const filePath = path.join(UPLOAD_DIR, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Get the full file system path from a public URL.
 */
export function getFilePath(publicUrl: string): string {
  const filename = publicUrl.replace("/uploads/", "");
  return path.join(UPLOAD_DIR, filename);
}

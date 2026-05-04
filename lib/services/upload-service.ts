import { uploadFile, deleteFile } from "@/lib/storage";

// ─── HANDLE FILE UPLOAD ─────────────────────────────────
export async function handleTemplateUpload(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadFile(buffer, file.name);
  return url;
}

// ─── DELETE UPLOADED FILE ───────────────────────────────
export async function handleTemplateDelete(url: string): Promise<void> {
  await deleteFile(url);
}

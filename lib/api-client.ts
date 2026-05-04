/**
 * Centralized API client for Pojok•Potret backend.
 * All frontend stores/components should use this to talk to the API.
 */

const BASE_URL = "/api";

export interface TemplateItem {
  id: string;
  name: string;
  description?: string | null;
  src: string;
  category: string;
  frameCount: number;
  likes: number;
  creator: string;
  creatorUsername?: string;
  creatorAvatar?: string | null;
  usageCount?: number;
  downloadCount?: number;
  status?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `API Error: ${res.status}`);
  }

  return json;
}

// ─── TEMPLATES ──────────────────────────────────────────

export interface TemplateFilters {
  category?: string;
  frameCount?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "popular" | "likes";
}

export async function fetchTemplates(filters?: TemplateFilters): Promise<ApiResponse<TemplateItem[]>> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.frameCount) params.set("frameCount", String(filters.frameCount));
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.sort) params.set("sort", filters.sort);

  const query = params.toString();
  return apiFetch<TemplateItem[]>(`/templates${query ? `?${query}` : ""}`);
}

export async function fetchTemplate(id: string): Promise<ApiResponse<TemplateItem>> {
  return apiFetch<TemplateItem>(`/templates/${id}`);
}

export async function createTemplate(data: Record<string, unknown>) {
  return apiFetch("/templates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTemplate(id: string, data: Record<string, unknown>) {
  return apiFetch(`/templates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTemplate(id: string) {
  return apiFetch(`/templates/${id}`, { method: "DELETE" });
}

export async function toggleLike(templateId: string) {
  return apiFetch(`/templates/${templateId}/like`, { method: "POST" });
}

export async function trackUsage(templateId: string) {
  return apiFetch(`/templates/${templateId}/usage`, { method: "POST" });
}

// ─── UPLOAD ─────────────────────────────────────────────

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json as ApiResponse<{ url: string; filename: string; size: number }>;
}

// ─── AUTH ───────────────────────────────────────────────

export async function fetchMe() {
  return apiFetch("/auth/me");
}

export async function logoutUser() {
  return apiFetch("/auth/logout", { method: "POST" });
}

// ─── USERS ──────────────────────────────────────────────

export async function fetchUser(username: string) {
  return apiFetch(`/users/${username}`);
}

export async function updateUser(username: string, data: Record<string, unknown>) {
  return apiFetch(`/users/${username}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ─── HEALTH ─────────────────────────────────────────────

export async function checkHealth() {
  return apiFetch("/health");
}

// ─── PROJECTS ───────────────────────────────────────────

export interface CreateProjectData {
  templateId?: string | null;
  layout?: string;
  filter?: string;
  photoCount?: number;
  resultUrl?: string | null;
  metadata?: Record<string, unknown>;
}

export async function createProject(data: CreateProjectData) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

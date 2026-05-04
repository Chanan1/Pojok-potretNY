import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchUser, updateUser as updateApiUser } from "@/lib/api-client";

export interface CreatorTemplate {
  id: string;
  title: string;
  previewSrc: string;
  status: "Dipublikasi" | "Draft";
  likes: number;
  frameCount?: number;
}

export interface CreatorUser {
  name: string;
  username: string;
  avatar: string;
  level: number;
  bio: string;
  email: string;
  socials: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}

export interface CreatorStats {
  totalTemplates: number;
  totalUses: number;
  totalLikes: number;
  totalDownloads: number;
}

interface CreatorState {
  user: CreatorUser | null;
  stats: CreatorStats;
  templates: CreatorTemplate[];
  
  // Actions
  updateUser: (updates: Partial<CreatorUser>) => void;
  fetchProfile: (username: string) => Promise<void>;
  saveProfile: (updates: Partial<CreatorUser>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useCreatorStore = create<CreatorState>()(
  persist(
    (set, get) => ({
      user: null,
      stats: {
        totalTemplates: 0,
        totalUses: 0,
        totalLikes: 0,
        totalDownloads: 0,
      },
      templates: [],
      
      updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
      
      logout: async () => {
        try {
          const { logoutUser } = await import("@/lib/api-client");
          await logoutUser();
          
          // Clear creator store state
          set({ user: null, templates: [], stats: { totalTemplates: 0, totalUses: 0, totalLikes: 0, totalDownloads: 0 } });
          
          // Force clear all capture and editor session data from storage
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pojok-capture-session");
            sessionStorage.removeItem("pojok-editor-session");
          }
          
          window.location.href = "/login";
        } catch (err) {
          console.error("Logout failed", err);
        }
      },

      checkAuth: async () => {
        try {
          const { fetchMe } = await import("@/lib/api-client");
          const res = await fetchMe();
          if (res.success && res.data) {
            // Found a logged in user, fetch their profile
            const data = res.data as { username: string };
            await get().fetchProfile(data.username);
          } else {
            set({ user: null });
          }
        } catch {
          set({ user: null });
        }
      },

      fetchProfile: async (username: string) => {
        if (!username) return;
        try {
          const res = await fetchUser(username);
          if (res.success && res.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = res.data;
            set({
              user: {
                name: data.name,
                username: data.username,
                avatar: data.avatar || "",
                level: data.level,
                bio: data.bio || "",
                email: data.email,
                socials: typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials || {},
              },
              stats: data.stats,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              templates: data.templates.map((t: any) => ({
                id: t.id,
                title: t.name,
                previewSrc: t.src,
                status: t.status === "PUBLISHED" ? "Dipublikasi" : "Draft",
                likes: t.likes,
                frameCount: t.frameCount,
              })),
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile for:", username, error);
          // If fetching the specific user fails, don't crash the whole store
        }
      },
      
      saveProfile: async (updates: Partial<CreatorUser>) => {
        try {
          const state = get();
          if (!state.user) throw new Error("Not authenticated");
          
          const { updateUser: updateApiUser } = await import("@/lib/api-client");
          const res = await updateApiUser(state.user.username, updates);
          if (res.success) {
            set((state) => ({ user: state.user ? { ...state.user, ...updates } : null }));
          }
        } catch (error) {
          console.error("Failed to save profile:", error);
          throw error;
        }
      },
    }),
    {
      name: "pojok-creator-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

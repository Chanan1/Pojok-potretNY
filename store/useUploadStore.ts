import { create } from "zustand";
import { uploadFile as apiUploadFile, createTemplate } from "@/lib/api-client";

export interface SlotConfig {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
}

interface UploadState {
  // File
  file: File | null;
  previewUrl: string | null;
  templateDimensions: { width: number, height: number } | null;
  
  // Settings & Metadata
  name: string;
  categories: string[];
  frameCount: number;
  description: string;
  backgroundColor: string; // 'transparent' or hex
  margin: number;
  borderRadius: number;
  isPublic: boolean;
  
  // Slots
  slots: SlotConfig[];
  
  // UI State
  isSlotEditorOpen: boolean;
  isUploading: boolean;

  // Actions
  setFile: (file: File | null, url: string | null) => void;
  updatePreviewUrl: (url: string) => void;
  setTemplateDimensions: (width: number, height: number) => void;
  setName: (name: string) => void;
  toggleCategory: (category: string) => void;
  setFrameCount: (count: number) => void;
  setDescription: (desc: string) => void;
  setBackgroundColor: (color: string) => void;
  setMargin: (margin: number) => void;
  setBorderRadius: (radius: number) => void;
  setIsPublic: (isPublic: boolean) => void;
  setSlots: (slots: SlotConfig[]) => void;
  addSlot: (slot: Omit<SlotConfig, "id">) => void;
  updateSlot: (id: string, updates: Partial<SlotConfig>) => void;
  setIsSlotEditorOpen: (isOpen: boolean) => void;
  generateDefaultSlots: (count: number) => void;
  reset: () => void;
  
  // API Actions
  publishTemplate: () => Promise<boolean>;
}

const initialState = {
  file: null,
  previewUrl: null,
  templateDimensions: null,
  name: "",
  categories: ["Cute"],
  frameCount: 4,
  description: "",
  backgroundColor: "transparent",
  margin: 10,
  borderRadius: 0,
  isPublic: true,
  slots: [],
  isSlotEditorOpen: false,
  isUploading: false,
};

export const useUploadStore = create<UploadState>((set, get) => ({
  ...initialState,
  
  setFile: (file, previewUrl) => {
    set({ file, previewUrl, slots: [] }); // Clear slots on new file
  },
  
  updatePreviewUrl: (previewUrl) => set({ previewUrl }),
  
  setTemplateDimensions: (width, height) => set({ templateDimensions: { width, height } }),
  
  setName: (name) => set({ name }),
  
  toggleCategory: (category) => set((state) => {
    const exists = state.categories.includes(category);
    if (exists) {
      return { categories: state.categories.filter((c) => c !== category) };
    }
    return { categories: [...state.categories, category] };
  }),
  
  setFrameCount: (frameCount) => {
    set({ frameCount });
    // Regenerate default slots when frame count changes
    get().generateDefaultSlots(frameCount);
  },
  
  setDescription: (description) => set({ description }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setMargin: (margin) => set({ margin }),
  setBorderRadius: (borderRadius) => set({ borderRadius }),
  setIsPublic: (isPublic) => set({ isPublic }),
  
  setSlots: (slots) => set({ slots }),
  
  addSlot: (slot) => set((state) => ({
    slots: [...state.slots, { ...slot, id: `slot-${Date.now()}` }]
  })),
  
  updateSlot: (id, updates) => set((state) => ({
    slots: state.slots.map((slot) => slot.id === id ? { ...slot, ...updates } : slot)
  })),
  
  setIsSlotEditorOpen: (isSlotEditorOpen) => set({ isSlotEditorOpen }),
  
  generateDefaultSlots: (count) => {
    const slots: SlotConfig[] = [];
    const gap = 4; // 4% gap
    const margin = 10; // 10% vertical margins combined
    
    // Simple vertical stacked layout calculation
    const availableHeight = 100 - (margin * 2) - (gap * (count - 1));
    const slotHeight = availableHeight / count;
    
    for (let i = 0; i < count; i++) {
      slots.push({
        id: `slot-${i+1}`,
        x: 10, // 10% from left
        y: margin + (i * (slotHeight + gap)),
        width: 80, // 80% width
        height: slotHeight
      });
    }
    
    set({ slots });
  },

  reset: () => set(initialState),
  
  publishTemplate: async () => {
    const state = get();
    if (!state.file || !state.name || state.categories.length === 0) {
      return false;
    }
    
    try {
      set({ isUploading: true });
      
      // 1. Upload file
      const uploadRes = await apiUploadFile(state.file);
      if (!uploadRes.success || !uploadRes.data?.url) throw new Error("Upload failed");
      
      // 2. Create template
      const templateRes = await createTemplate({
        name: state.name,
        description: state.description,
        src: uploadRes.data.url,
        category: state.categories[0], // Simplified to 1st category for MVP
        frameCount: state.frameCount,
        slots: state.slots,
        backgroundColor: state.backgroundColor,
        margin: state.margin,
        borderRadius: state.borderRadius,
        isPublic: state.isPublic,
        status: "PUBLISHED"
      });
      
      set({ isUploading: false });
      
      if (templateRes.success) {
        get().reset();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to publish template:", error);
      set({ isUploading: false });
      return false;
    }
  }
}));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface EditorTemplateSlot {
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
}

export interface EditorTemplate {
  id: string;
  name?: string;
  src: string;
  frameCount: number;
  slots: EditorTemplateSlot[];
}

export interface EditorPhotoFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  sepia: number;
  blur: number;
}

export interface EditorSlot {
  x: number;
  y: number;
  width: number;
  height: number;
  photoIndex: number;
  filter: EditorPhotoFilter;
  photoScale?: number;
  photoRotation?: number;
  photoX?: number;
  photoY?: number;
}

export interface StickerState {
  id: string;
  src: string;
  name?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  flipX: boolean;
  flipY: boolean;
}

export interface TextState {
  id: string;
  text: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  fontFamily: string;
}

interface EditorState {
  template: EditorTemplate | null;
  photos: string[];
  backgroundColor: string;
  slots: EditorSlot[];
  stickers: StickerState[];
  texts: TextState[];
  activeElementId: string | null;
  activeEditorTab: string | null;

  // Actions
  setPhotos: (photos: string[]) => void;
  setTemplate: (template: EditorTemplate | null) => void;
  setBackgroundColor: (color: string) => void;
  
  updateSlotFilter: (index: number, filter: Partial<EditorPhotoFilter>) => void;
  updateSlotTransform: (index: number, transform: Partial<EditorSlot>) => void;
  
  addSticker: (sticker: Omit<StickerState, "id">) => void;
  updateSticker: (id: string, updates: Partial<StickerState>) => void;
  removeSticker: (id: string) => void;
  swapSlotPhotos: (slotIndexA: number, slotIndexB: number) => void;
  
  addText: (text: Omit<TextState, "id">) => void;
  updateText: (id: string, updates: Partial<TextState>) => void;
  removeText: (id: string) => void;
  
  setActiveElementId: (id: string | null) => void;
  setActiveEditorTab: (tab: string | null) => void;
  generateFallbackSlots: (totalPhotos: number) => void;
  resetEditor: () => void;
  
  // Magic wand helper
  setCustomSlots: (slots: EditorTemplateSlot[]) => void;
}

const DEFAULT_FILTER: EditorPhotoFilter = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sharpness: 0,
  sepia: 0,
  blur: 0,
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      template: null,
      photos: [],
  backgroundColor: "#fdf6f9",
  slots: [],
  stickers: [],
  texts: [],
  activeElementId: null,
  activeEditorTab: "layout",

  setPhotos: (photos) => {
    set({ photos });
    
    // If we already have slots (from a template), update their indices to match new photo count
    const currentSlots = get().slots;
    if (currentSlots.length > 0 && photos.length > 0) {
      const fixedSlots = currentSlots.map((slot, idx) => ({
        ...slot,
        // If index was NaN or invalid, reset it
        photoIndex: (isNaN(slot.photoIndex) || slot.photoIndex === undefined) 
          ? (idx % photos.length) 
          : (slot.photoIndex % photos.length)
      }));
      set({ slots: fixedSlots });
    }

    // generate initial slots if none
    if (get().slots.length === 0) {
      get().generateFallbackSlots(photos.length);
    }
  },

  setTemplate: (template) => {
    set({ template });
    if (template) {
      const photos = get().photos;
      const photoCount = photos.length;
      
      // Sync slots with template slots
      const newSlots = template.slots.map((ts, idx) => ({
        ...ts,
        // Fallback to idx if photos are not loaded yet to prevent NaN
        photoIndex: photoCount > 0 ? idx % photoCount : idx,
        filter: { ...DEFAULT_FILTER },
        photoScale: 1,
        photoRotation: 0,
        photoX: 0,
        photoY: 0,
      }));
      set({ slots: newSlots });
    } else {
      // Revert to fallback grid
      get().generateFallbackSlots(get().photos.length);
    }
  },

  setBackgroundColor: (color) => set({ backgroundColor: color }),

  updateSlotFilter: (index, filter) =>
    set((state) => {
      const newSlots = [...state.slots];
      if (newSlots[index]) {
        newSlots[index] = { ...newSlots[index], filter: { ...newSlots[index].filter, ...filter } };
      }
      return { slots: newSlots };
    }),

  updateSlotTransform: (index, transform) =>
    set((state) => {
      const newSlots = [...state.slots];
      if (newSlots[index]) {
        newSlots[index] = { ...newSlots[index], ...transform };
      }
      return { slots: newSlots };
    }),

  addSticker: (sticker) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      stickers: [...state.stickers, { ...sticker, id }],
      activeElementId: `sticker-${id}`,
    }));
  },

  updateSticker: (id, updates) =>
    set((state) => ({
      stickers: state.stickers.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),

  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
      activeElementId: state.activeElementId === `sticker-${id}` ? null : state.activeElementId,
    })),

  addText: (text) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      texts: [...state.texts, { ...text, id }],
      activeElementId: `text-${id}`,
    }));
  },

  updateText: (id, updates) =>
    set((state) => ({
      texts: state.texts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeText: (id) =>
    set((state) => ({
      texts: state.texts.filter((t) => t.id !== id),
      activeElementId: state.activeElementId === `text-${id}` ? null : state.activeElementId,
    })),

  setActiveElementId: (id) => set({ activeElementId: id }),
  setActiveEditorTab: (tab) => set({ activeEditorTab: tab }),

  setCustomSlots: (customSlots) => {
    // Used for magic wand manually updating slots array
    const newSlots = customSlots.map((ts, idx) => ({
      ...ts,
      photoIndex: idx % get().photos.length,
      filter: { ...DEFAULT_FILTER },
      photoScale: 1,
      photoRotation: 0,
      photoX: 0,
      photoY: 0,
    }));
    set({ slots: newSlots });
  },

  generateFallbackSlots: (totalPhotos) => {
    // Fallback to strip layout (1 column)
    const padding = 5;
    const gap = 2;
    const availableHeight = 100 - (padding * 2) - (gap * (totalPhotos - 1));
    const hPerSlot = availableHeight / Math.max(1, totalPhotos);
    
    const newSlots: EditorSlot[] = [];
    for (let i = 0; i < totalPhotos; i++) {
      newSlots.push({
        x: padding,
        y: padding + i * (hPerSlot + gap),
        width: 100 - (padding * 2),
        height: hPerSlot,
        photoIndex: i,
        filter: { ...DEFAULT_FILTER },
        photoScale: 1,
        photoRotation: 0,
        photoX: 0,
        photoY: 0,
      });
    }
    set({ slots: newSlots });
  },

  swapSlotPhotos: (slotIndexA, slotIndexB) =>
    set((state) => {
      const newSlots = [...state.slots];
      if (newSlots[slotIndexA] && newSlots[slotIndexB]) {
        const tempPhotoIndex = newSlots[slotIndexA].photoIndex;
        newSlots[slotIndexA] = { ...newSlots[slotIndexA], photoIndex: newSlots[slotIndexB].photoIndex };
        newSlots[slotIndexB] = { ...newSlots[slotIndexB], photoIndex: tempPhotoIndex };
      }
      return { slots: newSlots };
    }),

  resetEditor: () => set({
    template: null,
    photos: [],
    backgroundColor: "#fdf6f9",
    slots: [],
    stickers: [],
    texts: [],
    activeElementId: null,
  }),
  }),
  {
    name: "pojok-editor-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        template: state.template,
        backgroundColor: state.backgroundColor,
        slots: state.slots,
        stickers: state.stickers,
        texts: state.texts,
      }),
    }
  )
);

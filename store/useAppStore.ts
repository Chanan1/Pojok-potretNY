import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LayoutOrientation = 'portrait' | 'landscape';
export type FilterType = 'normal' | 'bw' | 'warm' | 'cool';

interface AppState {
  // Capture session
  photos: (string | null)[];
  totalFrames: number;
  currentIndex: number;
  selectedLayout: LayoutOrientation;
  selectedTimer: number;
  selectedFilter: FilterType;
  isMirror: boolean;
  isCapturing: boolean;

  // Template selected from Explore
  selectedTemplateId: string | null;

  // Actions
  setPhotos: (photos: (string | null)[]) => void;
  setPhotoAtIndex: (index: number, photo: string) => void;
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  resetPhotos: () => void;
  setTotalFrames: (frames: number) => void;
  setCurrentIndex: (index: number) => void;
  setSelectedLayout: (layout: LayoutOrientation) => void;
  setSelectedTimer: (timer: number) => void;
  setSelectedFilter: (filter: FilterType) => void;
  setIsMirror: (mirror: boolean) => void;
  setIsCapturing: (capturing: boolean) => void;
  getNextEmptyIndex: () => number;
  isAllSlotsFilled: () => boolean;

  // Template from Explore
  setSelectedTemplateId: (id: string | null) => void;

  // Clear session
  clearSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      photos: [null, null, null, null],
      totalFrames: 4,
      currentIndex: 0,
      selectedLayout: 'portrait',
      selectedTimer: 3,
      selectedFilter: 'normal',
      isMirror: true,
      isCapturing: false,

      // Template from Explore
      selectedTemplateId: null,

      // Actions
      setPhotos: (photos) => set({ photos }),

      setPhotoAtIndex: (index, photo) =>
        set((state) => {
          const newPhotos = [...state.photos];
          newPhotos[index] = photo;
          return { photos: newPhotos };
        }),

      addPhoto: (photo) => {
        const state = get();
        const nextIndex = state.getNextEmptyIndex();
        if (nextIndex !== -1) {
          const newPhotos = [...state.photos];
          newPhotos[nextIndex] = photo;
          const nextEmpty = newPhotos.findIndex((p, i) => p === null && i > nextIndex);
          set({
            photos: newPhotos,
            currentIndex: nextEmpty !== -1 ? nextEmpty : nextIndex + 1,
          });
        }
      },

      removePhoto: (index) =>
        set((state) => {
          const newPhotos = [...state.photos];
          newPhotos[index] = null;
          return { photos: newPhotos, currentIndex: index };
        }),

      resetPhotos: () =>
        set((state) => ({
          photos: Array(state.totalFrames).fill(null),
          currentIndex: 0,
        })),

      setTotalFrames: (frames) =>
        set({
          totalFrames: frames,
          photos: Array(frames).fill(null),
          currentIndex: 0,
        }),

      setCurrentIndex: (index) => set({ currentIndex: index }),
      setSelectedLayout: (layout) => set({ selectedLayout: layout }),
      setSelectedTimer: (timer) => set({ selectedTimer: timer }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
      setIsMirror: (mirror) => set({ isMirror: mirror }),
      setIsCapturing: (capturing) => set({ isCapturing: capturing }),

      getNextEmptyIndex: () => {
        const { photos } = get();
        return photos.findIndex((p) => p === null);
      },

      isAllSlotsFilled: () => {
        const { photos } = get();
        return photos.every((p) => p !== null);
      },

      // Template from Explore
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),

      // Clear session
      clearSession: () => set({
        photos: [null, null, null, null],
        totalFrames: 4,
        currentIndex: 0,
        selectedLayout: 'portrait',
        selectedTimer: 3,
        selectedFilter: 'normal',
        isMirror: true,
        isCapturing: false,
        selectedTemplateId: null,
      }),
    }),
    {
      name: 'pojok-capture-session',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist the essential capture data — skip transient flags
      partialize: (state) => ({
        photos: state.photos,
        totalFrames: state.totalFrames,
        currentIndex: state.currentIndex,
        selectedLayout: state.selectedLayout,
        selectedTimer: state.selectedTimer,
        selectedFilter: state.selectedFilter,
        isMirror: state.isMirror,
        selectedTemplateId: state.selectedTemplateId,
      }),
    }
  )
);

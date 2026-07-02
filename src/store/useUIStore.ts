import { create } from 'zustand';

interface UIState {
    isFormOpen: boolean;
    openForm: () => void;
    closeForm: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isFormOpen: false, // Form drawer is hidden by default
    openForm: () => set({ isFormOpen: true }),
    closeForm: () => set({ isFormOpen: false }),
}));
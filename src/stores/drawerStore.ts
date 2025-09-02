import { create } from "zustand";

interface DrawerState {
  primaryOpen: boolean;
  secondaryOpen: boolean;
  selectedItemId: number | null;
  setPrimaryOpen: (open: boolean) => void;
  setSecondaryOpen: (open: boolean) => void;
  setSelectedItemId: (id: number | null) => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  primaryOpen: false,
  secondaryOpen: false,
  selectedItemId: null,
  setPrimaryOpen: (open) => set({ primaryOpen: open }),
  setSecondaryOpen: (open) => set({ secondaryOpen: open }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
}));
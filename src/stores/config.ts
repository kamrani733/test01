import { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'

// Common store configuration
export const createStore = <T extends object>(
  initialState: T,
  name: string
) => {
  return devtools(
    (set) => ({
      ...initialState,
      set: (partial: Partial<T>) => set(partial),
      reset: () => set(initialState),
    }),
    { name }
  )
}

// Persist middleware configuration
export const persistConfig = {
  name: 'app-storage',
  partialize: (state: unknown) => ({
    // Only persist specific parts of state
    // Add specific keys you want to persist
  }),
}

// Store types
export interface BaseStore {
  set: (partial: unknown) => void
  reset: () => void
}

// Utility types
export type StoreSlice<T> = StateCreator<T, [['zustand/devtools', never]]>

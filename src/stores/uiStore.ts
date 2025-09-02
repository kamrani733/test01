import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  // Modal states
  isModalOpen: boolean
  modalType: string | null
  modalData: unknown

  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>

  // Toast/Notification states
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>

  // Theme and UI preferences
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  language: string
}

interface UIActions {
  // Modal actions
  openModal: (type: string, data?: unknown) => void
  closeModal: () => void

  // Loading actions
  setGlobalLoading: (loading: boolean) => void
  setLoadingState: (key: string, loading: boolean) => void
  clearLoadingState: (key: string) => void

  // Notification actions
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Theme and UI actions
  setTheme: (theme: UIState['theme']) => void
  toggleSidebar: () => void
  setLanguage: (language: string) => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        isModalOpen: false,
        modalType: null,
        modalData: null,
        globalLoading: false,
        loadingStates: {},
        notifications: [],
        theme: 'system',
        sidebarCollapsed: false,
        language: 'fa',

        // Actions
        openModal: (type, data) => set({
          isModalOpen: true,
          modalType: type,
          modalData: data,
        }),

        closeModal: () => set({
          isModalOpen: false,
          modalType: null,
          modalData: null,
        }),

        setGlobalLoading: (loading) => set({ globalLoading: loading }),

        setLoadingState: (key, loading) => set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading,
          },
        })),

        clearLoadingState: (key) => set((state) => {
          const newLoadingStates = { ...state.loadingStates }
          delete newLoadingStates[key]
          return { loadingStates: newLoadingStates }
        }),

        addNotification: (notification) => set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Date.now().toString(),
            },
          ],
        })),

        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

        clearNotifications: () => set({ notifications: [] }),

        setTheme: (theme) => set({ theme }),

        toggleSidebar: () => set((state) => ({ 
          sidebarCollapsed: !state.sidebarCollapsed 
        })),

        setLanguage: (language) => set({ language }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          language: state.language,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
)

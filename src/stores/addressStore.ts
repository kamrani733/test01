import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Coordinates {
  lat: number
  lon: number
}

interface AddressState {
  selectedAddress: string
  selectedLocation: Coordinates | null
  editingAddress: { address: string } | null
}

interface AddressActions {
  setSelectedAddress: (address: string) => void
  setSelectedLocation: (location: Coordinates | null) => void
  setEditingAddress: (address: { address: string } | null) => void
}

type AddressStore = AddressState & AddressActions

export const useAddressStore = create<AddressStore>()(
  devtools(
    (set) => ({
      // State
      selectedAddress: '',
      selectedLocation: null,
      editingAddress: null,

      // Actions
      setSelectedAddress: (address) => set({ selectedAddress: address }),
      
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      
      setEditingAddress: (address) => set({ editingAddress: address }),
    }),
    {
      name: 'address-store',
    }
  )
)

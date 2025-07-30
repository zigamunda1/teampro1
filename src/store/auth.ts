import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: any | null
  setUser: (user: any) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
})) 
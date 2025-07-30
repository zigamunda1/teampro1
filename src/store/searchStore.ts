import { create } from 'zustand'
import type { SearchResult } from '../types/search'

interface SearchState {
  query: string
  results: SearchResult[]
  loading: boolean
  error: string | null
  setQuery: (q: string) => void
  setResults: (r: SearchResult[]) => void
  setLoading: (b: boolean) => void
  setError: (e: string | null) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  loading: false,
  error: null,
  setQuery: (q) => set({ query: q }),
  setResults: (r) => set({ results: r }),
  setLoading: (b) => set({ loading: b }),
  setError: (e) => set({ error: e }),
})) 
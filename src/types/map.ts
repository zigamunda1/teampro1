import type { SearchResult } from './search'

export interface MapInfo {
  type: 'embedded' | 'external' | 'error'
  center: {
    lat: number
    lng: number
  }
  place: SearchResult
  geocode?: Record<string, unknown>
  mapUrl?: string
  directions?: Record<string, unknown>
  message?: string
} 
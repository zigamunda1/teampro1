import { create } from 'zustand'
import type { MapInfo } from '../types/map'
import type { SearchResult } from '../types/search'

interface MapState {
  showMap: boolean
  mapData: MapInfo | null
  selectedPlace: SearchResult | null
  directions: any | null
  currentLocation: { lat: number; lng: number } | null
  setShowMap: (b: boolean) => void
  setMapData: (d: MapInfo | null) => void
  setSelectedPlace: (p: SearchResult | null) => void
  setDirections: (d: any | null) => void
  setCurrentLocation: (loc: { lat: number; lng: number } | null) => void
  lat: number | null
  lng: number | null
  setLatLng: (lat: number, lng: number) => void
}

export const useMapStore = create<MapState>((set) => ({
  showMap: false,
  mapData: null,
  selectedPlace: null,
  directions: null,
  currentLocation: null,
  setShowMap: (b) => set({ showMap: b }),
  setMapData: (d) => set({ mapData: d }),
  setSelectedPlace: (p) => set({ selectedPlace: p }),
  setDirections: (d) => set({ directions: d }),
  setCurrentLocation: (loc) => set({ currentLocation: loc }),
  lat: null,
  lng: null,
  setLatLng: (lat, lng) => set({ lat, lng }),
})) 
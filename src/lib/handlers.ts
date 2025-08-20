import { searchPlace } from '../api/naverSearch'
import type { SearchResult } from '../types/search'
import type { MapInfo } from '../types/map'
import { removeHtmlTags } from './utils'
import { useSearchStore } from '../store/searchStore'
import { useMapStore } from '../store/mapStore'


const convertMapX = (mapx: string): number => {
  if (!mapx) return 0
  
  const coordStr = mapx.toString()
  return parseFloat(coordStr.slice(0, 3) + '.' + coordStr.slice(3))
}


const convertMapY = (mapy: string): number => {
  if (!mapy) return 0
  
  const coordStr = mapy.toString()
  return parseFloat(coordStr.slice(0, 2) + '.' + coordStr.slice(2))
}

// 검색 실행 핸들러 (store 기반)
export const handleSearch = async (
  searchQuery: string,
  setError?: (msg: string | null) => void,
  setLoading?: (b: boolean) => void,
  setSearchResults?: (results: SearchResult[]) => void
) => {
  const _setError = setError || useSearchStore.getState().setError
  const _setLoading = setLoading || useSearchStore.getState().setLoading
  const _setResults = setSearchResults || useSearchStore.getState().setResults

  if (!searchQuery.trim()) {
    _setError('검색어를 입력해주세요.')
    return
  }
  _setLoading(true)
  _setError(null)
  try {
    const searchResults = await searchPlace(searchQuery.trim())
    _setResults(searchResults || [])
  } catch (error) {
    _setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.')
    console.error('Search error:', error)
  } finally {
    _setLoading(false)
  }
}

// 엔터키 검색 핸들러
export const handleKeyPress = (
  e: React.KeyboardEvent,
  handleSearch: () => void
) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

// 지도 표시 핸들러 (store 기반)
export const showNaverMap = async (
  selectedPlace: SearchResult,
  updateSelectedPlace?: (place: SearchResult) => void,
  updateMapVisibility?: (isVisible: boolean) => void,
  updateMapData?: (data: MapInfo) => void,
  createMap?: (data: MapInfo) => void
) => {
  console.log("=== showNaverMap 시작 ===")
  console.log("선택된 장소:", selectedPlace)
  console.log("좌표 정보:", { mapx: selectedPlace.mapx, mapy: selectedPlace.mapy })
  const _setSelectedPlace = updateSelectedPlace || useMapStore.getState().setSelectedPlace
  const _setShowMap = updateMapVisibility || useMapStore.getState().setShowMap
  const _setMapData = updateMapData || useMapStore.getState().setMapData
  const _createMap = createMap || createMapWithMarker

  _setSelectedPlace(selectedPlace)
  _setShowMap(true)
  
  try {
    
    let latitude = 37.5665  // 기본값 
    let longitude = 126.9780

    // selectedPlace에서 좌표 추출
    if (selectedPlace.mapx && selectedPlace.mapy) {
      // 네이버 API 좌표값을 실제 좌표로 변환
      latitude = convertMapY(selectedPlace.mapy)   // 위도 (Y 좌표)
      longitude = convertMapX(selectedPlace.mapx)  // 경도 (X 좌표)
      console.log("원본 좌표:", { mapx: selectedPlace.mapx, mapy: selectedPlace.mapy })
      console.log("변환된 좌표:", { latitude, longitude })
    } else {
      console.log("좌표 정보 없음, 기본 좌표 사용:", { latitude, longitude })
    }

    // 지도 정보 설정
    const mapInfoData: MapInfo = {
      type: 'embedded',
      center: {
        lat: latitude,
        lng: longitude
      },
      place: selectedPlace
    }
    
    _setMapData(mapInfoData)
    
    // DOM 업데이트를 기다린 후 지도 생성
    setTimeout(() => {
      _createMap(mapInfoData)
    }, 100)
  } catch (error) {
    console.log('지도 표시 오류:', error)
  }
}

// 네이버 지도 렌더링 함수  
export const createMapWithMarker = (mapData: MapInfo) => {

  console.log("받은 mapData:", mapData)
  
  // 지도 컨테이너 찾기 
  let mapContainer = document.getElementById('map')
  console.log("지도 컨테이너:", mapContainer)

  // 컨테이너가 없으면 잠시 대기 후 재시도
  if (!mapContainer) {
    console.log("지도 컨테이너를 찾을 수 없습니다.")
    setTimeout(() => {
      mapContainer = document.getElementById('map')
      if (mapContainer) {
        console.log("지도 컨테이너를 찾았습니다. 지도를 생성합니다.")
        createMapWithMarker(mapData)
      } else {
        console.error("지도 컨테이너를 찾을 수 없습니다.")
      }
    }, 50)
    return
  }

  // 기존 지도 제거
  mapContainer.innerHTML = ''
  console.log("기존 지도 제거 완료")

  try {
    // 네이버 지도 객체 확인
    const naver: any = (window as any).naver;
    console.log("naver 객체:", naver)
    
    if (!naver || !naver.maps) {
      console.error("네이버 지도 API가 로드X")
      mapContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">네이버 지도 API 로딩 실패</div>'
      return
    }
    
    console.log("좌표:", { lat: mapData.center.lat, lng: mapData.center.lng })
    
    // 지도 생성
    const map = new naver.maps.Map(mapContainer, {
      center: new naver.maps.LatLng(mapData.center.lat, mapData.center.lng),
      zoom: 15,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: naver.maps.MapTypeControlStyle.DROPDOWN,
        position: naver.maps.Position.TOP_RIGHT
      }
    })
    
    // 지도 객체를 컨테이너에 저장 (경로 그리기용)
    ;(mapContainer as any)._naverMap = map
    
    console.log("지도 생성 완료:", map)

    // 마커 생성 및 추가
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(mapData.center.lat, mapData.center.lng),
      map: map
    })
    
    console.log("마커 생성 완료:", marker)

    // 정보창 생성
    const infoWindow = new naver.maps.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h3 style="margin: 0 0 5px 0; font-size: 14px;">${removeHtmlTags(mapData.place.title)}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${mapData.place.roadAddress}</p>
        </div>
      `
    })

    // 마커 클릭 시 정보창 표시/숨김
    naver.maps.Event.addListener(marker, 'click', () => {
      if (infoWindow.getMap()) {
        infoWindow.close()
      } else {
        infoWindow.open(map, marker)
      }
    })
    
    console.log("지도렌더링링")

  } catch (error) {
    console.error('지도 렌더링 오류:', error)
    mapContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">지도 로딩에 실패했습니다.</div>'
  }
}



 
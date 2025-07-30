import { searchPlace } from '../api/naverSearch'
import { getDirections } from '../api/naverDirections'
import { getCurrentLocation, getDefaultLocation } from '../api/naverGeolocation'
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

/**
 * 경로 안내 기능을 실행하는 함수
 * @param destination - 목적지 정보 (SearchResult)
 */
export const handleDirections = async (destination: SearchResult) => {
  console.log('=== 경로 안내 시작 ===')
  console.log('목적지:', destination)
  
  try {
    // 1. 현재 위치 가져오기
    let currentLocation: { lat: number; lng: number }
    
    try {
      currentLocation = await getCurrentLocation()
      console.log('현재 위치 가져오기 성공:', currentLocation)
    } catch (error) {
      console.log('현재 위치 가져오기 실패, 기본 위치 사용:', error)
      currentLocation = getDefaultLocation()
    }
    
    // 2. 목적지 좌표 변환
    const destinationLat = convertMapY(destination.mapy)
    const destinationLng = convertMapX(destination.mapx)
    const goalLocation = { lat: destinationLat, lng: destinationLng }
    
    console.log('목적지 좌표:', goalLocation)
    
    // 3. 경로 안내 API 호출
    const directionsData = await getDirections(currentLocation, goalLocation)
    
    // 4. Zustand에 경로 정보 저장
    const { setDirections, setCurrentLocation } = useMapStore.getState()
    setCurrentLocation(currentLocation)
    setDirections(directionsData)
    
    // 5. 지도에 경로 표시
    drawRouteOnMap(currentLocation, goalLocation, directionsData)
    
    console.log('경로 안내 완료:', directionsData)
    
    return directionsData
    
  } catch (error) {
    console.error('경로 안내 오류:', error)
    throw error
  }
}

/**
 * 지도에 경로를 그리는 함수
 * @param start - 출발지 좌표
 * @param goal - 목적지 좌표
 * @param directionsData - 경로 데이터
 */
export const drawRouteOnMap = (start: { lat: number; lng: number }, goal: { lat: number; lng: number }, directionsData: any) => {
  const mapContainer = document.getElementById('map')
  if (!mapContainer) {
    console.error('지도 컨테이너를 찾을 수 없습니다.')
    return
  }

  try {
    const naver: any = (window as any).naver
    if (!naver || !naver.maps) {
      console.error('네이버 지도 API가 로드되지 않았습니다.')
      return
    }

    // 기존 지도 객체 가져오기 (이미 생성된 지도가 있다면)
    const existingMap = (mapContainer as any)._naverMap
    if (!existingMap) {
      console.error('기존 지도 객체를 찾을 수 없습니다.')
      return
    }

    // 출발지 마커 생성 (초록색)
    new naver.maps.Marker({
      position: new naver.maps.LatLng(start.lat, start.lng),
      map: existingMap,
      icon: {
        content: '<div style="background: #4CAF50; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        size: new naver.maps.Size(20, 20),
        anchor: new naver.maps.Point(10, 10)
      }
    })

    // 목적지 마커 생성 (빨간색)
    new naver.maps.Marker({
      position: new naver.maps.LatLng(goal.lat, goal.lng),
      map: existingMap,
      icon: {
        content: '<div style="background: #F44336; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        size: new naver.maps.Size(20, 20),
        anchor: new naver.maps.Point(10, 10)
      }
    })

    // 경로 데이터에서 좌표 추출하여 폴리라인 생성
    if (directionsData && directionsData.route && directionsData.route.traoptimal && directionsData.route.traoptimal[0]) {
      const path = directionsData.route.traoptimal[0].path
      if (path && path.length > 0) {
        const pathCoords = path.map((coord: string) => {
          const [lat, lng] = coord.split(',').map(Number)
          return new naver.maps.LatLng(lat, lng)
        })

        // 경로 선 그리기 (주황색)
        new naver.maps.Polyline({
          path: pathCoords,
          strokeColor: '#FF6B35',
          strokeWeight: 5,
          strokeOpacity: 0.8,
          map: existingMap
        })

        // 지도 범위 조정 (출발지와 목적지를 모두 포함)
        const bounds = new naver.maps.LatLngBounds()
        bounds.extend(new naver.maps.LatLng(start.lat, start.lng))
        bounds.extend(new naver.maps.LatLng(goal.lat, goal.lng))
        existingMap.fitBounds(bounds, 50) // 50px 패딩

        console.log('경로가 지도에 표시되었습니다.')
      }
    }

  } catch (error) {
    console.error('경로 그리기 오류:', error)
  }
}

 
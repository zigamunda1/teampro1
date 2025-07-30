import { getMapsApiHeaders } from './config'

/**
 * 네이버 Directions5 API를 호출하여 경로 안내를 제공하는 함수
 * @param start - 출발지 좌표 (위도,경도)
 * @param goal - 목적지 좌표 (위도,경도)
 * @returns 경로 안내 정보
 */
export async function getDirections(start: { lat: number; lng: number }, goal: { lat: number; lng: number }) {
  try {
    // 좌표를 문자열로 변환
    const startCoord = `${start.lat},${start.lng}`
    const goalCoord = `${goal.lat},${goal.lng}`
    
    console.log('=== Directions5 API 호출 ===')
    console.log('출발지:', startCoord)
    console.log('목적지:', goalCoord)
    
    const url = `/api/naver/directions5?start=${encodeURIComponent(startCoord)}&goal=${encodeURIComponent(goalCoord)}`
    
    const response = await fetch(url, {
      headers: getMapsApiHeaders()
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Directions5 API 오류:', errorText)
      throw new Error(`경로 안내 API 호출 실패: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('경로 안내 결과:', data)
    
    return data
  } catch (error) {
    console.error('경로 안내 API 오류:', error)
    throw error
  }
} 
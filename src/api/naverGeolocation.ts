/**
 * 브라우저 Geolocation API를 사용하여 현재 위치를 구하는 함수
 * @returns 현재 위치 좌표 (위도, 경도)
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 지원되지 않습니다.'))
      return
    }
    
    console.log('=== 현재 위치 요청 ===')
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        console.log('현재 위치:', { lat: latitude, lng: longitude })
        resolve({ lat: latitude, lng: longitude })
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error)
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

/**
 * 기본 위치 (서울시청) 반환 함수
 * @returns 기본 위치 좌표
 */
export function getDefaultLocation(): { lat: number; lng: number } {
  return { lat: 37.5665, lng: 126.9780 }
} 
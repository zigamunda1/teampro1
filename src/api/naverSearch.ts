import { getLocalSearchHeaders } from './config';

/**
 * 네이버 지역검색 API를 호출하여 장소를 검색하는 함수
 * @param query - 검색할 키워드 (예: "강남 파스타", "마곡 맛집")
 * @returns 검색된 장소들의 배열
 */
export async function searchPlace(query: string) {
  // 검색어를 URL 인코딩
  const encodedQuery = encodeURIComponent(query);
  // Vite 프록시를 통해 CORS 문제 해결
  const url = `/api/naver/search?query=${encodedQuery}&display=5`;

  // 네이버 지역검색 API에 GET 요청 전송
  const res = await fetch(url, {
    headers: getLocalSearchHeaders(),
  });

  // HTTP 상태 코드 확인
  if (!res.ok) {
    throw new Error(`장소 검색 실패: ${res.status}`);
  }

  // JSON 응답을 파싱하여 검색 결과 반환
  const data = await res.json();
  console.log('네이버 검색 API 응답:', data);
  console.log('검색 결과 항목들:', data.items);
  
  // 각 결과의 연락처 정보 확인
  if (data.items && data.items.length > 0) {
    data.items.forEach((item: any, index: number) => {
      console.log(`결과 ${index + 1}:`, {
        title: item.title,
        telephone: item.telephone,
        roadAddress: item.roadAddress,
        address: item.address
      });
    });
  }
  
  return data.items; // 검색된 장소들의 배열 반환
} 
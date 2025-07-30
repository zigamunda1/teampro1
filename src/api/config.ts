
export const NAVER_API_CONFIG = {
  // 네이버 지역검색 API
  LOCAL_SEARCH_CLIENT_ID: import.meta.env.VITE_NAVER_LOCAL_SEARCH_CLIENT_ID || 'VYCS5lP9SCMVkkX_eBd1',
  LOCAL_SEARCH_CLIENT_SECRET: import.meta.env.VITE_NAVER_LOCAL_SEARCH_CLIENT_SECRET || 'SieO0TPZhS',
  
  // 네이버 지도 API (NCP Maps API)
  MAPS_API_KEY_ID: import.meta.env.VITE_NCP_MAPS_API_KEY_ID || 'nts1pzispr',
  MAPS_API_KEY: import.meta.env.VITE_NCP_MAPS_API_KEY || 'JnCCjVIYFTqjuOfngFsBW9Ii2dQUOuX905SI0ZoS',
  
  // API 기본 URL들
  BASE_URLS: {
    LOCAL_SEARCH: 'https://openapi.naver.com/v1/search/local.json',
    GEOCODE: 'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
    REVERSE_GEOCODE: 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc',
    DIRECTIONS: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving',
    DYNAMIC_MAP: 'https://map.naver.com/p'
  }
};

// 네이버 지역검색 API 헤더
export const getLocalSearchHeaders = () => ({
  'X-Naver-Client-Id': NAVER_API_CONFIG.LOCAL_SEARCH_CLIENT_ID,
  'X-Naver-Client-Secret': NAVER_API_CONFIG.LOCAL_SEARCH_CLIENT_SECRET,
  'Content-Type': 'application/json'
});

// 네이버 지도 API 헤더
export const getMapsApiHeaders = () => ({
  'x-ncp-apigw-api-key-id': NAVER_API_CONFIG.MAPS_API_KEY_ID,
  'x-ncp-apigw-api-key': NAVER_API_CONFIG.MAPS_API_KEY,
  'Accept': 'application/json'
}); 
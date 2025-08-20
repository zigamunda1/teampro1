
export const NAVER_API_CONFIG = {
  // 네이버 지역검색 API
  LOCAL_SEARCH_CLIENT_ID: import.meta.env.VITE_NAVER_LOCAL_SEARCH_CLIENT_ID || 'VYCS5lP9SCMVkkX_eBd1',
  LOCAL_SEARCH_CLIENT_SECRET: import.meta.env.VITE_NAVER_LOCAL_SEARCH_CLIENT_SECRET || 'SieO0TPZhS',
  
  // 네이버 지도 API (NCP Maps API)
  MAPS_API_KEY_ID: import.meta.env.VITE_NCP_MAPS_API_KEY_ID || 'h52y5k093u',
  MAPS_API_KEY: import.meta.env.VITE_NCP_MAPS_API_KEY || 'Kwd07fmmkH3TtVF4ISh21MtkYi7O4dX3GokRCk3w',
  
  // API 기본 URL들
  BASE_URLS: {
    LOCAL_SEARCH: 'https://openapi.naver.com/v1/search/local.json',
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
  'X- NCP-APIGW-API-KEY-ID': NAVER_API_CONFIG.MAPS_API_KEY_ID,
  'X-NCP-APIGW-API-KEY': NAVER_API_CONFIG.MAPS_API_KEY,
  'Accept': 'application/json'
}); 
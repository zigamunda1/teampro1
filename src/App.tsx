import { useSearchStore } from "./store/searchStore";
import { useMapStore } from "./store/mapStore";

import { removeHtmlTags } from "./lib/utils";
import {
  handleSearch,
  handleKeyPress,
  showNaverMap,
  createMapWithMarker,
} from "./lib/handlers";


import { useAuthStore } from "./store/auth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./lib/supabase";

function App() {
  // 검색 상태
  const {
    query,setQuery, 
    results,setResults,
    loading,setLoading,
    error,setError,
  } = useSearchStore();

  // 지도 상태
  const {
    selectedPlace,setSelectedPlace,
    mapData,setMapData,
    showMap,setShowMap,
  } = useMapStore();

  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  //  로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearUser();
      navigate("/sign-in");
    } catch (err: any) {
      console.error("로그아웃 실패:", err.message);
      alert("로그아웃 중 문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    // ===== 메인 컨테이너 =====
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 bg-cover bg-center overflow-y-scroll relative">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="src/assets/food1.jpg" 
          alt="배경 음식 이미지" 
          className="w-full h-full object-cover"
        />
      </div>
      {/* ===== 헤더 섹션 ===== */}
      <header className="w-full h-20 p-4 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-lg border-b border-blue-200/20 flex items-center backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="flex-1"></div>
        <p className="text-white font-bold text-[28px] tracking-wider drop-shadow-lg relative z-10 title-font">
          YOUR MENU SELECTING PARTNER
        </p>

        {/* 로그아웃에 onClick과 로그인을 추가  + 앞에 user.email이 뜨게함*/}
        <div className="flex-1 flex justify-end items-center gap-6">
          {user ? (
            <>
              <span className="text-white text-lg font-medium korean-text relative z-10">
                {user.email}님
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-200 transition-all duration-300 font-semibold py-2 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20 relative z-10"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="px-3 py-1 bg-blue-500 text-white rounded relative z-10 hover:bg-blue-600 transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* ===== 메인 콘텐츠 섹션 ===== */}
      <main
        className={`mt-24 px-4 ${
          showMap ? "flex" : "flex flex-col items-center justify-center"
        }`}
      >
        {/* ===== 좌측 콘텐츠 영역 ===== */}
        <div
          className={`${
            showMap ? "w-1/4 pr-4" : "w-1/3"
          } transition-all duration-1000`}
        >
          <div className="bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/40 relative overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
            <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 rounded-full"></div>
            <div className="flex justify-between items-start -mt-4 mb-4">
              <div className="w-24 h-24 bg-purple-200/20 rounded-full blur-xl"></div>
              <div className="w-24 h-24 bg-blue-200/20 rounded-full blur-xl"></div>
            </div>

            {/* ===== 로고 섹션 ===== */}
            <div className="flex justify-center mb-6">
              <img
                src="src/assets/logo.png"
                alt="뭐먹띠 로고"
                className="h-72 drop-shadow-lg rounded-4xl"
              />
            </div>

            {/* ===== 캐치프레이즈 ===== */}
            <p className="text-4xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-wide title-font">
              오늘 점심은 뭐먹띠?
            </p>
            <p className="text-xl mb-8 text-gray-700 font-medium body-font">
              {showMap ? (
                <>
                  메뉴 고민은 이제 그만!<br />
                  어떤 맛집을 찾으시나요?
                </>
              ) : (
                "메뉴 고민은 이제 그만! 어떤 맛집을 찾으시나요?"
              )}
            </p>

            {/* ===== 검색 기능 섹션 ===== */}
            <div className="flex items-center bg-white/90 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all hover:border-blue-300/70 hover:scale-[1.02]">
              <input
                type="text"
                placeholder="검색어를 입력해 주세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) =>
                  handleKeyPress(e, () =>
                    handleSearch(query, setError, setLoading, setResults)
                  )
                }
                className="flex-grow outline-none bg-transparent text-gray-800 text-lg placeholder-gray-500"
              />
              <button
                onClick={() =>
                  handleSearch(query, setError, setLoading, setResults)
                }
                className="text-blue-600 transition-all duration-300 text-2xl hover:scale-110"
              >
                🔍
              </button>
            </div>

            {/* ===== 검색 결과 표시 영역 ===== */}
            {/* 로딩 */}
            {loading && (
              <div className="mt-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="mt-3 text-gray-600 font-medium">검색 중...</p>
              </div>
            )}

            {/* 에러 */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* 검색 결과가 있을 때만 표시 */}
            {results.length > 0 && (
              <div className="mt-8 space-y-4">
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  검색 결과 ({results.length}개)
                </p>
                <div className="grid gap-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:scale-[1.02] hover:border-blue-300/50 cursor-pointer"
                    >
                      {/* ===== 장소 정보 표시 ===== */}
                      {/* 장소명과 카테고리 */}
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-lg font-semibold text-gray-800 flex-1">
                          {removeHtmlTags(result.title)}
                        </p>
                        <span className="text-sm text-blue-600 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full font-medium shadow-sm">
                          {result.category}
                        </span>
                      </div>

                      {/* 장소 상세 설명 */}
                      <p className="text-gray-600 mb-3 text-sm">
                        {removeHtmlTags(result.description)}
                      </p>

                      {/* ===== 위치 및 연락처 정보 ===== */}
                      <div className="space-y-1 text-sm text-gray-500">
                        {result.roadAddress && (
                          <p className="flex items-center">
                            <span className="mr-2">📍</span>
                            {result.roadAddress}
                          </p>
                        )}
                      </div>

                      {/* ===== 상세보기(관련링크) ===== */}
                      <div className="mt-4 flex gap-2">
                        <button
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                          onClick={() => window.open(result.link, "_blank")}
                        >
                          상세보기
                        </button>
                                                  <button
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105"
                          onClick={() => {
                            showNaverMap(
                              result,
                              setSelectedPlace,
                              setShowMap,
                              setMapData,
                              createMapWithMarker
                            );
                            if (result.mapx && result.mapy) {
                              // 좌표 변환 함수
                              const convertMapX = (mapx: string): number => {
                                if (!mapx) return 0;
                                const coordStr = mapx.toString();
                                return parseFloat(
                                  coordStr.slice(0, 3) + "." + coordStr.slice(3)
                                );
                              };

                              const convertMapY = (mapy: string): number => {
                                if (!mapy) return 0;
                                const coordStr = mapy.toString();
                                return parseFloat(
                                  coordStr.slice(0, 2) + "." + coordStr.slice(2)
                                );
                              };

                              const lat = convertMapY(result.mapy);
                              const lng = convertMapX(result.mapx);
                              useMapStore.getState().setLatLng(lat, lng);
                            }
                          }}
                        >
                          지도보기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== 우측 지도 영역 (3/4) ===== */}
        {showMap && (
          <div className="w-3/4 pl-4 transition-all duration-1000">
            <div className="bg-white rounded-2xl shadow-2xl h-full min-h-[600px] overflow-hidden">
              {/* ===== 지도 헤더 ===== */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <p className="text-xl font-semibold">🗺️ 네이버 지도</p>
                {selectedPlace && (
                  <p className="text-sm opacity-90">
                    {removeHtmlTags(selectedPlace.title)}
                  </p>
                )}
              </div>

              {/* ===== 지도 컨테이너 ===== */}
              <div className="h-full p-4">
                {mapData && mapData.type === "embedded" ? (
                  <div className="h-full">
                    {/* ===== 지도 정보 표시 ===== */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-800 mb-2">
                        선택된 장소:
                      </p>
                      <p className="text-gray-700">
                        {removeHtmlTags(mapData.place.title)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {mapData.place.roadAddress}
                      </p>

                      {/* ===== 네이버 길찾기 버튼 ===== */}
                      <div className="mt-4">
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm w-full"
                          onClick={() => {
                            try {
                              // 좌표 변환
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

                              const lat = convertMapY(mapData.place.mapy)
                              const lng = convertMapX(mapData.place.mapx)
                              
                              const placeName = encodeURIComponent(removeHtmlTags(mapData.place.title))
                              const naverDirectionsUrl = `https://map.naver.com/p/directions?query=${placeName}&lat=${lat}&lng=${lng}`
                              
                              // 새 탭에서 네이버 길찾기 페이지 열기
                              window.open(naverDirectionsUrl, '_blank')
                            } catch (error) {
                              console.error('네이버 길찾기 오류:', error)
                              alert('네이버 길찾기를 열 수 없습니다.')
                            }
                          }}
                        >
                          🚗 네이버 길찾기
                        </button>
                      </div>
                    </div>

                    {/* ===== 지도 표시 영역 ===== */}
                    <div
                      id="map"
                      className="w-full h-[768px] rounded-lg overflow-hidden"
                      style={{ position: "relative" }}
                    >
                      {/* 지도 렌더링 */}
                    </div>
                  </div>
                ) : mapData && mapData.type === "error" ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">❌ {mapData.message}</p>
                      <button
                        onClick={() => setShowMap(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        메인으로 돌아가기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        지도를 불러오는 중...
                      </p>
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

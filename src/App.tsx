import NaverMap from "./components/navermap.tsx";
import GeocodeSearch from "./components/geocodesearch.tsx";
  import { useEffect, useRef } from "react";



function App() {
  const [searchValue, setSearch] = useState("");
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">네이버 지도 테스트</h1>
      <div className="w-100vw h-100vh">
       
      <NaverMap />
      <GeocodeSearch />
      </div>
    </div>
  );
}

export default App;


import { useEffect, useRef } from "react";

export default function NaverMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.naver && mapElement.current) {
        new window.naver.maps.Map(mapElement.current, {
          center: new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 16,
        });
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={mapElement}
      style={{ width: "100%", height: "400px" }}
    />
  );
}

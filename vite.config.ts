import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    proxy: {
            // 네이버 지도 API 프록시

      '/api/naver/geocode': {
        target: 'https://naveropenapi.apigw.ntruss.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver\/geocode/, '/map-geocode/v2/geocode'),
      },
      '/api/naver/reverse-geocode': {
        target: 'https://naveropenapi.apigw.ntruss.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver\/reverse-geocode/, '/map-reversegeocode/v2/gc'),
      },
               
       '/api/naver/directions5': {
              target: 'https://naveropenapi.apigw.ntruss.com',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/naver\/directions5/, '/map-direction/v1/driving'),
            },
            '/api/naver/dynamic-map': {
              target: 'https://map.naver.com',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/naver\/dynamic-map/, '/p'),
            },
      // 네이버 지역검색 API 프록시 
      '/api/naver/search': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver\/search/, '/v1/search/local.json'),
      },
    },
  },
});
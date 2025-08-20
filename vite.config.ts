import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
            // 네이버 지도 API 프록시
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
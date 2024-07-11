import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '192.168.7.33',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://192.168.7.33:8080',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://192.168.7.33:8080',
        ws: true,
      },
    },
  },
})

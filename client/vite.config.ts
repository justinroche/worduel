import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  client_host,
  server_host,
  client_port,
  server_port,
} from './src/config/config.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: client_host,
    port: client_port,
    proxy: {
      '/api': {
        target: 'http://' + server_host + ':' + server_port,
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://' + server_host + ':' + server_port,
        ws: true,
      },
    },
  },
})

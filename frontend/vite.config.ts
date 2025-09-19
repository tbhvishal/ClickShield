import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, '');
  return {
    plugins: [react()],
    server: {
      port: Number(env.FRONTEND_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_API_URL || `http://localhost:${env.PORT || 8001}`,
          changeOrigin: true
        }
      }
    },
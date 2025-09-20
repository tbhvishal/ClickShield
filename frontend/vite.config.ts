import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, new URL('..', import.meta.url).pathname, '');
  return {
    plugins: [react(), viteStaticCopy({ targets: [{ src: 'src/assets/*', dest: 'assets' }] })],
    server: {
      port: Number(env.FRONTEND_PORT) || 5173,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_API_URL || `http://localhost:${env.PORT || 8001}`,
          changeOrigin: true
        }
      }
    },
    define: {
      'import.meta.env.VITE_BACKEND_API_URL': JSON.stringify(env.VITE_BACKEND_API_URL || `http://localhost:${env.PORT || 8001}`)
    },
    build: {

      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['framer-motion', 'lucide-react'],
            'utils-vendor': ['jspdf']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      sourcemap: false,
      cssCodeSplit: true
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
    }
  };
});
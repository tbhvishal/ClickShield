/**
 * Application Configuration
 * Simple port defaults for backend and frontend
 * 
 * ⚠️ IMPORTANT: If you change these ports, update .env file too!
 *    - Backend port must match in VITE_BACKEND_API_URL
 *    - Frontend port must match your Vite dev server
 */

export const config = {
  ports: {
    backend: 8001,   // Backend Express server port (API runs here)
    frontend: 5173,  // Frontend Vite dev server port (UI runs here)
  },
} as const;

export default config;

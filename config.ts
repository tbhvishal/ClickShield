/**
 * Application Configuration
 * Simple port defaults for backend and frontend
 */

export const config = {
  ports: {
    backend: 8001,   // Backend Express server port (API runs here)
    frontend: 5173,  // Frontend Vite dev server port (UI runs here)
  },
} as const;

export default config;

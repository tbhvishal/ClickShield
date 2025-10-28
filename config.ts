/**
 * Application Configuration
 * Non-sensitive configuration values that can be safely committed to version control
 */

export const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 8001,
    host: 'localhost',
  },

  // Frontend Configuration
  frontend: {
    port: process.env.FRONTEND_PORT || 5173,
    devUrl: `http://localhost:${process.env.FRONTEND_PORT || 5173}`,
  },

  // API Configuration
  api: {
    // Backend API URL for frontend - automatically set based on environment
    backendUrl: process.env.VITE_BACKEND_API_URL || '',
  },

  // Environment
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export default config;

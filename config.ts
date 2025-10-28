/**
 * Application Configuration
 * Non-sensitive configuration values for both development and production
 */

export const config = {
  // Server Configuration
  server: {
    port: 8001,
    host: 'localhost',
  },

  // Frontend Configuration
  frontend: {
    port: 5173,
    host: 'localhost',
  },

  // API Endpoints
  api: {
    // Development: Backend runs on localhost:8001
    dev: {
      baseUrl: 'http://localhost:8001',
      checkUrl: 'http://localhost:8001/check-url',
    },
    // Production: Uses relative URLs (same domain as frontend)
    prod: {
      baseUrl: '',
      checkUrl: '/check-url',
    },
  },

  // App Information
  app: {
    name: 'ClickShield',
    version: '1.0.0',
    description: 'Advanced Phishing Detection & Website Security Scanner',
  },
} as const;

export default config;

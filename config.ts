/**
 * Application Configuration
 * Simple, universal settings that work for local development and production
 */

export const config = {
  // Server ports (can be overridden by environment variables)
  ports: {
    backend: 8001,
    frontend: 5173,
  },

  // App Information
  app: {
    name: 'ClickShield',
    version: '1.0.0',
    description: 'Advanced Phishing Detection & Website Security Scanner',
  },
} as const;

export default config;

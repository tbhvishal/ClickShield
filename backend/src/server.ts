import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the root directory (go up from backend/src to root)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from './app.js';

// Configuration - using defaults from config file concept
const PORT = process.env.PORT || 8001;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173;
const FRONTEND_URL = process.env.VITE_BACKEND_API_URL ? `http://localhost:${FRONTEND_PORT}` : 'Production';

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`✅ API endpoint: http://localhost:${PORT}/check-url`);
  if (FRONTEND_URL !== 'Production') {
    console.log(`🌐 Frontend available at: ${FRONTEND_URL}`);
  }
});

# 🔧 ClickShield Troubleshooting Guide

## Common Issues and Solutions

### 🚫 Issue: Local development shows blank page or "Cannot connect to server"

**Symptoms:**
- Page title and favicon load but content doesn't appear
- Browser console shows connection errors
- Frontend can't reach backend API

**Solution:**
1. **Check your `.env` file in the root directory**
   ```env
   VITE_BACKEND_API_URL=http://localhost:8001
   ```
   ⚠️ This line **MUST** be uncommented for local development!

2. **Verify both servers are running:**
   ```bash
   # Backend should show:
   ✅ Backend server running on http://localhost:8001
   
   # Frontend should show:
   ➜  Local:   http://localhost:5173/
   ```

3. **If still not working, restart:**
   ```bash
   # Stop all servers (Ctrl+C)
   # Then run:
   npm start
   ```

---

### 🔑 Issue: "Google Safe Browsing API key not configured" error

**Solution:**
1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add it to root `.env` file:
   ```env
   GOOGLE_SAFE_BROWSING_API_KEY=your_actual_key_here
   ```
3. Restart the servers

---

### 🌐 Issue: Works on Vercel but not locally (or vice versa)

**Root Cause:** Different environment configurations

**Solution:**

**For Local Development** (`.env`):
```env
GOOGLE_SAFE_BROWSING_API_KEY=your_api_key_here
PORT=8001
FRONTEND_PORT=5173
VITE_BACKEND_API_URL=http://localhost:8001  # ← REQUIRED for local!
```

**For Production/Vercel** (Vercel Dashboard or `.env.production`):
```env
GOOGLE_SAFE_BROWSING_API_KEY=your_api_key_here
# VITE_BACKEND_API_URL should be EMPTY or not set
```

---

### 📦 Issue: "Module not found" or dependency errors

**Solution:**
```bash
# Clean install everything
npm run clean
npm run install:all

# Or manually:
cd backend && npm install
cd ../frontend && npm install
cd ..
npm install
```

---

### 🏗️ Issue: Build fails or TypeScript errors

**Solution:**
```bash
# Clean and rebuild
cd backend && rm -rf dist node_modules
npm install
npm run build

cd ../frontend && rm -rf dist node_modules
npm install
npm run build
```

---

### 🔄 Issue: Changes not reflecting after update

**Solution:**
```bash
# Hard refresh in browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# Or clear Vite cache:
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

### 🐳 Issue: Docker setup not working

**Solution:**
```bash
# Make sure .env exists with proper values
cp .env.example .env
# Edit .env with your API key

# Rebuild containers
docker-compose down
docker-compose up --build
```

---

## Quick Checks

### ✅ Verify Environment Setup

Run this command to check your setup:

```bash
# Windows (PowerShell)
Get-Content .env | Select-String "VITE_BACKEND_API_URL"

# Mac/Linux
cat .env | grep VITE_BACKEND_API_URL
```

**Expected output for local dev:**
```
VITE_BACKEND_API_URL=http://localhost:8001
```

### ✅ Check if Servers are Running

```bash
# Check backend
curl http://localhost:8001/check-url

# Should return: {"error":"Invalid or missing URL.",...}
```

### ✅ Check Frontend can reach Backend

1. Open browser console (F12)
2. Look for this log:
   ```
   VITE_BACKEND_API_URL: http://localhost:8001
   ```
3. If it shows `undefined`, your `.env` is not configured correctly

---

## Still Having Issues?

1. **Check the logs:**
   - Backend logs show in the terminal where you ran `npm start`
   - Frontend logs show in browser console (F12)

2. **Verify ports are not in use:**
   ```bash
   # Windows
   netstat -ano | findstr :8001
   netstat -ano | findstr :5173
   
   # Mac/Linux
   lsof -i :8001
   lsof -i :5173
   ```

3. **Try a different port:**
   Update `.env`:
   ```env
   PORT=8002
   VITE_BACKEND_API_URL=http://localhost:8002
   ```

4. **Check firewall/antivirus:**
   - Allow Node.js through firewall
   - Temporarily disable antivirus to test

---

## Getting Help

If you still can't resolve the issue:

1. Check [GitHub Issues](https://github.com/tbhvishal/ClickShield/issues)
2. Create a new issue with:
   - Your OS and Node.js version
   - Full error message
   - Output of `npm start`
   - Your `.env` configuration (without API key)

---

## Quick Reference: Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start local development (frontend + backend) |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build for production |
| `npm run dev:backend` | Start only backend |
| `npm run dev:frontend` | Start only frontend |
| `npm run clean` | Remove all node_modules and dist folders |

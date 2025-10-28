# 🚀 ClickShield - Quick Start Guide

## For Local Development

### Step 1️⃣: Clone and Setup
```bash
git clone https://github.com/tbhvishal/ClickShield.git
cd ClickShield
cp .env.example .env
```

### Step 2️⃣: Configure Environment
Edit `.env` and add your Google Safe Browsing API key:
```env
GOOGLE_SAFE_BROWSING_API_KEY=your_api_key_here
PORT=8001
FRONTEND_PORT=5173
VITE_BACKEND_API_URL=http://localhost:8001
```

### Step 3️⃣: Verify Setup (Optional but Recommended)
```bash
npm run verify
```
This will check if everything is configured correctly.

### Step 4️⃣: Start Development Servers
```bash
npm start
```

**That's it!** 🎉

- Backend: http://localhost:8001
- Frontend: http://localhost:5173

---

## For Production/Cloud Deployment (Vercel)

### Step 1️⃣: Push to GitHub
```bash
git push origin main
```

### Step 2️⃣: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable in Vercel:
   - Key: `GOOGLE_SAFE_BROWSING_API_KEY`
   - Value: your API key
4. Deploy!

**Important:** Don't set `VITE_BACKEND_API_URL` on Vercel - it will use relative URLs automatically.

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start local development (installs deps, builds, runs servers) |
| `npm run verify` | Verify your setup is correct |
| `npm run dev:backend` | Run only backend server |
| `npm run dev:frontend` | Run only frontend server |
| `npm run build` | Build for production |
| `npm run install:all` | Install all dependencies |

---

## Troubleshooting

**Problem:** Blank page when running locally?
**Solution:** Check your `.env` file has this line uncommented:
```env
VITE_BACKEND_API_URL=http://localhost:8001
```

**Problem:** "Cannot find module" errors?
**Solution:** Run `npm run install:all`

**More help:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---
## Project Structure

```
ClickShield/
├── .env                    # ⚠️ Your local environment config (DO NOT COMMIT)
├── .env.example            # Template for .env
├── package.json            # Root package file
├── start.js                # Development startup script
├── verify-setup.js         # Setup verification script
├── README.md               # Full documentation
├── TROUBLESHOOTING.md      # Detailed troubleshooting guide
├── backend/                # Backend Express API
│   ├── src/
│   │   ├── server.ts       # Server entry point
│   │   ├── app.ts          # Express app configuration
│   │   └── api/
│   │       └── checkUrl.ts # URL checking API endpoint
│   └── package.json
└── frontend/               # Frontend React app
    ├── src/
    │   ├── App.tsx         # Main app component
    │   └── components/     # React components
    └── package.json
```

---

## What Happens When You Run `npm start`?

1. ✅ Checks if `.env` file exists
2. ✅ Validates environment configuration
3. 📦 Installs all dependencies (root, backend, frontend)
4. 🔍 Runs linting (if configured)
5. 🔨 Builds the project
6. 🚀 Starts backend on port 8001
7. 🚀 Starts frontend on port 5173
8. 🌐 Opens browser automatically

---

## Getting Your Google Safe Browsing API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Safe Browsing API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the key and add it to your `.env` file

**Free tier:** 10,000 requests per day

---

## Tips for Success

✅ **Always run `npm run verify` after cloning or changing .env**
✅ **Keep `.env` in your `.gitignore` (it already is)**
✅ **Use `.env.example` as a template for team members**
✅ **For production, set environment variables in your cloud provider's dashboard**
✅ **Don't commit your API keys to Git**

---

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 🔧 Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 🐛 [Open an issue](https://github.com/tbhvishal/ClickShield/issues) on GitHub
- 💬 Review existing [GitHub Discussions](https://github.com/tbhvishal/ClickShield/discussions)

---

**Happy coding! 🛡️**

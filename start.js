// Run this with 'npm start' from the project root to get everything running.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, cwd) {
  console.log(`\n> ${cmd} (in ${cwd || process.cwd()})`);
  execSync(cmd, { stdio: 'inherit', cwd: cwd || process.cwd() });
}

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log('\n⚠️  WARNING: .env file not found!');
    console.log('📋 Copy .env.example to .env and add your Google Safe Browsing API key');
    console.log('   Example: cp .env.example .env');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('VITE_BACKEND_API_URL=http://localhost:8001')) {
    console.log('\n⚠️  WARNING: VITE_BACKEND_API_URL is not set in .env');
    console.log('📋 For local development, make sure your .env contains:');
    console.log('   VITE_BACKEND_API_URL=http://localhost:8001');
  }
  
  console.log('✅ Environment file found and configured');
}

function ensureConcurrentlyInstalled() {
  try {
    require.resolve('concurrently');
  } catch (e) {
    console.log('\n📦 Installing concurrently...');
    run('npm install -g concurrently');
  }
}

function installAll() {
  console.log('\n📦 Installing dependencies...\n');
  
  // Install dependencies for the main project if package.json is there
  if (fs.existsSync('package.json')) {
    run('npm install', process.cwd());
  }
  // Install backend dependencies
  if (fs.existsSync('backend/package.json')) {
    run('npm install', path.join(process.cwd(), 'backend'));
  }
  // Install frontend dependencies
  if (fs.existsSync('frontend/package.json')) {
    run('npm install', path.join(process.cwd(), 'frontend'));
  }
  
  console.log('\n✅ All dependencies installed!');
}


function lintIfAvailable(dir, name) {
  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.scripts && pkg.scripts.lint) {
      console.log(`\nRunning lint for ${name}...`);
      run('npm run lint', dir);
    } else {
      console.log(`\nNo lint script found for ${name}. Skipping lint.`);
    }
  }
}

function lintAll() {
  lintIfAvailable(path.join(process.cwd(), 'frontend'), 'frontend');
  lintIfAvailable(path.join(process.cwd(), 'backend'), 'backend');
}

function buildAll() {
  console.log('\n🔨 Building the project...\n');
  
  // Build the project using the build script from the root
  if (fs.existsSync('package.json')) {
    run('npm run build', process.cwd());
  }
  
  console.log('\n✅ Build complete!');
}

function startAll() {
  console.log('\n🚀 Starting development servers...\n');
  console.log('📍 Backend will run on: http://localhost:8001');
  console.log('📍 Frontend will run on: http://localhost:5173\n');
  
  // Start both backend and frontend servers in dev mode using concurrently
  const backendStart = 'cd backend && npm run dev';
  const frontendStart = 'cd frontend && npm run dev';
  
  run(`npx concurrently -k -n backend,frontend -c yellow,cyan "${backendStart}" "${frontendStart}"`);
}


function main() {
  console.log('\n🛡️  ClickShield - Local Development Setup\n');
  console.log('='.repeat(50));
  
  checkEnvFile();
  installAll();
  lintAll();
  buildAll();
  ensureConcurrentlyInstalled();
  startAll();
}

main();

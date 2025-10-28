// Run this with 'npm start' from the project root to get everything running.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
function run(cmd, cwd) {
  console.log(`\n> ${cmd} (in ${cwd || process.cwd()})`);
  execSync(cmd, { stdio: 'inherit', cwd: cwd || process.cwd() });
}
function ensureConcurrentlyInstalled() {
  try {
    require.resolve('concurrently');
  } catch (e) {
    console.log('\nInstalling concurrently globally...');
    run('npm install -g concurrently');
  }
}

function installAll() {
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
  // Build the project using the build script from the root
  if (fs.existsSync('package.json')) {
    run('npm run build', process.cwd());
  }
}

function startAll() {
  // Start both backend and frontend servers in dev mode using concurrently
  const backendStart = 'cd backend && npm run dev';
  const frontendStart = 'cd frontend && npm run dev';
  console.log('\nStarting both frontend and backend...');
  run(`npx concurrently -k -n backend,frontend -c yellow,cyan "${backendStart}" "${frontendStart}"`);
}


function main() {
  installAll();
  lintAll();
  buildAll();
  ensureConcurrentlyInstalled();
  startAll();
}

main();

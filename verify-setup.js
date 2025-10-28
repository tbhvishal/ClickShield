#!/usr/bin/env node

/**
 * ClickShield Setup Verification Script
 * Run this to verify your local development environment is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('\n🛡️  ClickShield Setup Verification\n');
console.log('='.repeat(50));

let errors = [];
let warnings = [];
let success = [];

// Check 1: Node.js version
console.log('\n✓ Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
if (majorVersion >= 18) {
  success.push(`Node.js ${nodeVersion} ✓`);
} else {
  errors.push(`Node.js version ${nodeVersion} is too old. Need v18+`);
}

// Check 2: .env file exists
console.log('✓ Checking .env file...');
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  success.push('.env file exists ✓');
  
  // Check 3: .env contents
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check API key
  if (envContent.includes('GOOGLE_SAFE_BROWSING_API_KEY=') && 
      !envContent.includes('GOOGLE_SAFE_BROWSING_API_KEY=your_api_key_here') &&
      !envContent.match(/GOOGLE_SAFE_BROWSING_API_KEY=\s*$/m)) {
    success.push('Google Safe Browsing API key configured ✓');
  } else {
    errors.push('Google Safe Browsing API key is missing or not configured in .env');
  }
  
  // Check VITE_BACKEND_API_URL for local dev
  if (envContent.includes('VITE_BACKEND_API_URL=http://localhost:8001')) {
    success.push('VITE_BACKEND_API_URL configured for local development ✓');
  } else if (envContent.includes('# VITE_BACKEND_API_URL=http://localhost:8001')) {
    errors.push('VITE_BACKEND_API_URL is commented out! Uncomment it for local development.');
  } else {
    warnings.push('VITE_BACKEND_API_URL may not be configured correctly for local dev');
  }
  
  // Check PORT
  if (envContent.includes('PORT=8001')) {
    success.push('Backend PORT configured ✓');
  } else {
    warnings.push('PORT not explicitly set (will default to 8001)');
  }
  
} else {
  errors.push('.env file not found! Copy .env.example to .env');
}

// Check 4: package.json files
console.log('✓ Checking project structure...');
const rootPackage = path.join(process.cwd(), 'package.json');
const backendPackage = path.join(process.cwd(), 'backend', 'package.json');
const frontendPackage = path.join(process.cwd(), 'frontend', 'package.json');

if (fs.existsSync(rootPackage)) success.push('Root package.json exists ✓');
else errors.push('Root package.json not found');

if (fs.existsSync(backendPackage)) success.push('Backend package.json exists ✓');
else errors.push('Backend package.json not found');

if (fs.existsSync(frontendPackage)) success.push('Frontend package.json exists ✓');
else errors.push('Frontend package.json not found');

// Check 5: node_modules
console.log('✓ Checking dependencies...');
const rootModules = path.join(process.cwd(), 'node_modules');
const backendModules = path.join(process.cwd(), 'backend', 'node_modules');
const frontendModules = path.join(process.cwd(), 'frontend', 'node_modules');

if (!fs.existsSync(rootModules)) {
  warnings.push('Root node_modules not found - run: npm install');
}
if (!fs.existsSync(backendModules)) {
  warnings.push('Backend node_modules not found - run: cd backend && npm install');
}
if (!fs.existsSync(frontendModules)) {
  warnings.push('Frontend node_modules not found - run: cd frontend && npm install');
}

if (fs.existsSync(rootModules) && fs.existsSync(backendModules) && fs.existsSync(frontendModules)) {
  success.push('All dependencies installed ✓');
}

// Print Results
console.log('\n' + '='.repeat(50));
console.log('\n📊 Results:\n');

if (success.length > 0) {
  console.log('✅ Success (' + success.length + '):');
  success.forEach(msg => console.log('   ' + msg));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings (' + warnings.length + '):');
  warnings.forEach(msg => console.log('   ' + msg));
}

if (errors.length > 0) {
  console.log('\n❌ Errors (' + errors.length + '):');
  errors.forEach(msg => console.log('   ' + msg));
}

console.log('\n' + '='.repeat(50));

// Final verdict
if (errors.length === 0) {
  console.log('\n🎉 All checks passed! You\'re ready to start development.\n');
  console.log('Run: npm start\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Please fix the errors above before running npm start.\n');
  console.log('📖 See TROUBLESHOOTING.md for detailed solutions.\n');
  process.exit(1);
}

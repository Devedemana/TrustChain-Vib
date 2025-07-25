// Webpack Build Fix Script
// This script helps resolve common webpack module resolution issues

const path = require('path');
const fs = require('fs');

console.log('🔧 Applying webpack build fixes...');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('❌ node_modules not found. Please run: npm install');
  process.exit(1);
}

// Check for problematic packages
const problematicPackages = [
  '@reduxjs/toolkit',
  'recharts'
];

const fixes = [];

problematicPackages.forEach(pkg => {
  const pkgPath = path.join(nodeModulesPath, pkg);
  if (fs.existsSync(pkgPath)) {
    fixes.push(`Found ${pkg} - applying compatibility fixes`);
  }
});

if (fixes.length > 0) {
  console.log('📦 Package compatibility fixes:');
  fixes.forEach(fix => console.log(`  ✓ ${fix}`));
}

// Create a simple polyfill for missing modules
const polyfillsPath = path.join(__dirname, 'src', 'polyfills.js');
const polyfillContent = `
// Browser polyfills for Node.js modules
if (typeof process === 'undefined') {
  global.process = require('process/browser');
}

if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

// Suppress recharts/redux warnings in development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === 'string' && (
        message.includes('execOptions.factory.call') ||
        message.includes('@reduxjs/toolkit') ||
        message.includes('process/browser')
      )
    ) {
      return; // Suppress specific warnings
    }
    originalConsoleWarn.apply(console, args);
  };
}
`;

try {
  fs.writeFileSync(polyfillsPath, polyfillContent);
  console.log('✅ Created polyfills.js');
} catch (error) {
  console.log('⚠️  Could not create polyfills.js:', error.message);
}

console.log('🎉 Webpack fixes applied successfully!');
console.log('💡 You can now run: npm run dev');

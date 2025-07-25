// Buffer Dependency Fix Script
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing buffer dependency issues...');

// Check if the problematic path exists
const problematicPath = path.join(__dirname, 'node_modules', '@dfinity', 'agent', 'node_modules', 'buffer');
const problematicIndex = path.join(problematicPath, 'index.js');

if (fs.existsSync(problematicPath) && !fs.existsSync(problematicIndex)) {
  console.log('❌ Found problematic buffer path without index.js');
  
  try {
    // Remove the problematic directory
    fs.rmSync(problematicPath, { recursive: true, force: true });
    console.log('✅ Removed problematic buffer directory');
  } catch (error) {
    console.log('⚠️  Could not remove directory:', error.message);
  }
}

// Verify main buffer package exists
const mainBufferPath = path.join(__dirname, 'node_modules', 'buffer');
if (!fs.existsSync(mainBufferPath)) {
  console.log('❌ Main buffer package not found');
  console.log('💡 Please run: npm install buffer');
} else {
  console.log('✅ Main buffer package found');
}

// Create a simple package.json resolution
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Ensure buffer is in dependencies
    if (!packageJson.dependencies) packageJson.dependencies = {};
    if (!packageJson.dependencies.buffer) {
      packageJson.dependencies.buffer = '^6.0.3';
      console.log('✅ Added buffer to dependencies');
    }
    
    // Add resolutions to force single buffer version
    if (!packageJson.resolutions) packageJson.resolutions = {};
    packageJson.resolutions.buffer = '^6.0.3';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with buffer resolution');
    
  } catch (error) {
    console.log('⚠️  Could not update package.json:', error.message);
  }
}

console.log('🎉 Buffer dependency fix completed!');
console.log('💡 Run: npm install && npm run dev');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const botNodeModules = path.join(__dirname, '../bot/node_modules');
const installLock = path.join(__dirname, '../bot/.installed');

// If already installed, skip
if (fs.existsSync(installLock)) {
  console.log('✅ Bot dependencies already installed. Skipping.');
  process.exit(0);
}

console.log('⚙️ Installing bot dependencies...');

try {
  execSync('cd bot && npm install', { stdio: 'inherit' });
  
  // Create lock file
  fs.writeFileSync(installLock, `Installed at ${new Date().toISOString()}`);
  console.log('✅ Bot dependencies installed successfully.');
} catch (error) {
  console.error('❌ Failed to install bot dependencies:', error.message);
  process.exit(1);
}

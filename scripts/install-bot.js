// scripts/install-bot.js
const fs = require('fs');
const path = require('path');

const BOT_DIR = path.join(__dirname, 'bot');
const NODE_MODULES = path.join(BOT_DIR, 'node_modules');

// Check if bot/node_modules exists → assume already installed
if (fs.existsSync(NODE_MODULES)) {
  console.log('✅ bot/node_modules already exists. Skipping install.');
  process.exit(0);
}

console.log('⚙️ Installing bot dependencies...');

const { execSync } = require('child_process');

try {
  execSync('npm install', {
    cwd: BOT_DIR,
    stdio: 'inherit', // show output for debugging
  });
  console.log('✅ Bot dependencies installed.');
} catch (error) {
  console.error('❌ Failed to install bot dependencies:', error.message);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

/**
 * Recursively copy the contents of the Next.js exported site into the
 * server's public directory. This script is executed after building
 * both the web and server packages. It removes any existing public
 * directory to ensure stale assets are not served.
 */
function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    throw new Error(`Source directory does not exist: ${srcDir}`);
  }
  fs.mkdirSync(destDir, { recursive: true });
  for (const item of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const outDir = path.join(projectRoot, 'apps', 'web', 'out');
  const publicDir = path.join(projectRoot, 'packages', 'server', 'public');
  // Remove existing public directory if it exists
  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
  copyRecursive(outDir, publicDir);
  console.log(`Copied ${outDir} to ${publicDir}`);
}

if (require.main === module) {
  main();
}
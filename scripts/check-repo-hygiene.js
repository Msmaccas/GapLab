const fs = require('fs');
const path = require('path');

/**
 * Recursively walk a directory and return an array of absolute file paths.
 */
function walkDir(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    const filePath = path.join(dir, entry);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

function checkHygiene() {
  const projectRoot = path.resolve(__dirname, '..');
  const prohibitedPatterns = [
    /\.tsbuildinfo$/,
    /\bnode_modules\b.*dist/,
    /\bdist\b.*\.ts/,
    /\.zip$/,
    /\bout\/.*\.js$/
  ];
  const errors = [];
  const files = walkDir(projectRoot);
  for (const file of files) {
    // Ignore files in node_modules root
    if (file.includes('node_modules')) {
      continue;
    }
    // Check each pattern
    for (const pattern of prohibitedPatterns) {
      if (pattern.test(file)) {
        errors.push(`Prohibited file detected: ${file}`);
        break;
      }
    }
  }
  if (errors.length) {
    console.error('Repository hygiene check failed:');
    for (const err of errors) {
      console.error('  ' + err);
    }
    process.exit(1);
  } else {
    console.log('Repository hygiene check passed');
  }
}

checkHygiene();
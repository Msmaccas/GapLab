const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Runs the compiled worker to generate a gap board and report. This script
 * is intended to be used after the monorepo has been built. It relies
 * on the compiled JavaScript files under packages/worker/dist. The
 * report is written into the `reports` directory for inspection.
 */
function runSmoke() {
  const projectRoot = path.resolve(__dirname, '..');
  const workerCli = path.join(projectRoot, 'packages', 'worker', 'dist', 'index.js');
  if (!fs.existsSync(workerCli)) {
    throw new Error(`Compiled worker CLI not found at ${workerCli}. Did you run npm run build?`);
  }
  console.log('Running worker CLI...');
  const output = execSync(`node ${workerCli}`, { encoding: 'utf8' });
  console.log(output);
  // Additionally, generate markdown report via requiring the worker module
  const { runGapWorker } = require(workerCli);
  return runGapWorker().then(({ markdown }) => {
    const reportsDir = path.join(projectRoot, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }
    const reportPath = path.join(reportsDir, 'smoke_report.md');
    fs.writeFileSync(reportPath, markdown, 'utf8');
    console.log(`Wrote smoke report to ${reportPath}`);
  });
}

runSmoke().catch(err => {
  console.error(err);
  process.exit(1);
});
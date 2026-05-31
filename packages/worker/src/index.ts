import { readGapsFromFile } from '@gaplab/data';
import { runGapWorkflowBatch } from '@gaplab/workflows';
import { generateBoardJson, generateMarkdownReport } from '@gaplab/reports';

/**
 * Runs the full gap classification pipeline on the configured fixture
 * universe. Returns both the structured board JSON and a markdown
 * report. This function does not write to disk; consumers can decide
 * how to persist or present the results.
 */
export async function runGapWorker() {
  const gaps = await readGapsFromFile();
  const outputs = await runGapWorkflowBatch(gaps);
  const board = generateBoardJson(outputs);
  const markdown = generateMarkdownReport(outputs);
  return { board, markdown };
}

/**
 * If executed directly via node (for example `node dist/index.js`), run
 * the worker and print the results to the console. This CLI usage
 * supports the repository smoke test by demonstrating that the
 * workflows and report generator can complete without error.
 */
if (require.main === module) {
  runGapWorker()
    .then(({ board }) => {
      // Print a concise summary of the board. For each item include
      // the ticker and classification template.
      console.log('Gap board summary:');
      board.forEach(item => {
        console.log(`${item.entityId}: ${item.template}`);
      });
    })
    .catch(err => {
      console.error('Error running gap worker:', err);
      process.exit(1);
    });
}
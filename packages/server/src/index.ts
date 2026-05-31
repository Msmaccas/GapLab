import express, { Request, Response } from 'express';
import path from 'path';
import { readGapsFromFile } from '@gaplab/data';
import { runGapWorkflowBatch } from '@gaplab/workflows';
import { generateBoardJson, generateMarkdownReport } from '@gaplab/reports';

/**
 * Build and configure the Express application. This function encapsulates
 * route definitions to support testing and separation of concerns.
 */
export function createApp() {
  const app = express();
  // Health endpoint to verify server is running
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  /**
   * Endpoint to generate a classification board for the configured gap
   * universe. The raw inputs are pulled from the fixtures directory
   * (currently a JSON file) via the data package. The workflows package
   * orchestrates the analysts and classification logic. The reports
   * package converts the workflow outputs into a minimal JSON board
   * for consumption by the UI.
   */
  app.get('/api/board', async (_req: Request, res: Response) => {
    try {
      const gaps = await readGapsFromFile();
      const outputs = await runGapWorkflowBatch(gaps);
      const board = generateBoardJson(outputs);
      res.status(200).json(board);
    } catch (err: unknown) {
      // Capture runtime errors and respond with a degraded state
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error });
    }
  });

  /**
   * Endpoint to generate a markdown report for the current universe. This
   * builds on the same workflow batch used by the board endpoint but
   * produces a human‑readable document. It could be extended to support
   * additional formats like PDF in the future.
   */
  app.get('/api/report', async (_req: Request, res: Response) => {
    try {
      const gaps = await readGapsFromFile();
      const outputs = await runGapWorkflowBatch(gaps);
      const markdown = generateMarkdownReport(outputs);
      res.setHeader('Content-Type', 'text/markdown');
      res.status(200).send(markdown);
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error });
    }
  });

  // Serve static files from the public directory. During build the
  // Next.js application will be exported into this folder via the
  // copy-web-to-server script. When no matching file is found the
  // index.html file will be returned to support client side routing.
  const publicDir = path.join(__dirname, '../public');
  app.use(express.static(publicDir));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  return app;
}

/**
 * Start the HTTP server if this module is executed directly. This allows
 * the server to be used both programmatically in tests and as a CLI
 * entry point via `npm start`. Port configuration is supplied via the
 * `PORT` environment variable with a default fallback.
 */
if (require.main === module) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`GapLab server listening on port ${port}`);
  });
}
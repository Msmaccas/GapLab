import { createApp } from '@gaplab/server';
import http from 'http';

/**
 * Helper to perform a GET request against an Express app running on an
 * arbitrary port. Returns a promise that resolves with the response
 * body as text and the status code.
 */
function fetchPath(port: number, path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port,
      path,
      method: 'GET'
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode || 0, body: data });
      });
    });
    req.on('error', err => reject(err));
    req.end();
  });
}

describe('server API', () => {
  let server: http.Server;
  let port: number;

  beforeAll(done => {
    const app = createApp();
    server = app.listen(0, () => {
      const address = server.address() as any;
      port = address.port;
      done();
    });
  });

  afterAll(done => {
    server.close(err => done(err));
  });

  it('returns health status', async () => {
    const { status, body } = await fetchPath(port, '/health');
    expect(status).toBe(200);
    const json = JSON.parse(body);
    expect(json.status).toBe('ok');
  });

  it('returns a board', async () => {
    const { status, body } = await fetchPath(port, '/api/board');
    expect(status).toBe(200);
    const board = JSON.parse(body);
    expect(Array.isArray(board)).toBe(true);
    // At least one item from fixtures
    expect(board.length).toBeGreaterThan(0);
    const item = board[0];
    expect(item).toHaveProperty('ticker');
    expect(item).toHaveProperty('template');
    expect(item).toHaveProperty('confidence');
    expect(item).toHaveProperty('rationale');
  });
});
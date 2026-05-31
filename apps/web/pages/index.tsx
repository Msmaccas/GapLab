import { useEffect, useState } from 'react';

interface BoardItem {
  ticker: string;
  template: string;
  confidence: string;
  rationale: string;
}

export default function Home() {
  const [board, setBoard] = useState<BoardItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBoard() {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const res = await fetch(`${base}/api/board`);
        if (!res.ok) {
          throw new Error(`Failed to fetch board: ${res.status}`);
        }
        const data = await res.json();
        setBoard(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    fetchBoard();
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>GapLab Morning Board</h1>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Ticker</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Template</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Confidence</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Rationale</th>
            </tr>
          </thead>
          <tbody>
            {board.map(item => (
              <tr key={item.ticker}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.ticker}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.template}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.confidence}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{item.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
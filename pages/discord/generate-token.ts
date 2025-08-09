import React from 'react';
import { useState } from 'react';

export default function GenerateToken() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/discord/generate-token', { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setToken(data.token);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Generate Discord Token</h1>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Token'}
      </button>
      {token && (
        <div>
          <p>Token: <code>{token}</code></p>
        </div>
      )}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
  );
}

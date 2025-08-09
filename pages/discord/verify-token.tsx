import { useState } from 'react';

export default function VerifyToken() {
  const [inputToken, setInputToken] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/discord/verify-token?token=${encodeURIComponent(inputToken)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Verify Discord Token</h1>
      <input
        type="text"
        value={inputToken}
        onChange={e => setInputToken(e.target.value)}
        placeholder="Enter token"
      />
      <button onClick={handleVerify} disabled={loading || !inputToken.trim()}>
        {loading ? 'Verifying...' : 'Verify Token'}
      </button>

      {result && (
        <div>
          <p>Token valid for user: {result.userId}</p>
          <p>Expires at: {result.expiresAt}</p>
        </div>
      )}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
  );
}

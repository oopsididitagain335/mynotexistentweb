// components/DiscordLinkCard.tsx
import React, { useState } from 'react';

interface DiscordLinkCardProps {
  onLinked: (token: string) => void;
}

const DiscordLinkCard: React.FC<DiscordLinkCardProps> = ({ onLinked }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const link = async () => {
    if (!token) return;
    setLoading(true);
    // Will call API to verify token
    onLinked(token);
    setLoading(false);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Link Discord</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Use your 32-character token from <code>/link TOKEN</code> in Discord.
      </p>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter 32-char token"
        className="input w-full mb-3"
      />
      <button
        onClick={link}
        disabled={!token || loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Linking...' : 'Link Account'}
      </button>
    </div>
  );
};

export default DiscordLinkCard;

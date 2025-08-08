// components/DomainManager.tsx
import React, { useState } from 'react';

const DomainManager: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Custom Domain</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Connect your domain like <code>links.yoursite.com</code>
      </p>
      <div className="space-y-4">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="links.yoursite.com"
          className="input domain-input"
        />
        <button
          onClick={verify}
          disabled={!domain || loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        {verified && (
          <div className="p-3 bg-success/15 text-success rounded-lg text-sm">
            ✅ Domain verified! Point CNAME to <code>cname.thebiolink.lol</code>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainManager;

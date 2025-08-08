// components/BannedPage.tsx
import React from 'react';

const BannedPage: React.FC = () => {
  return (
    <div className="page-banned">
      <div className="banned-content text-center">
        <h1 className="banned-title">🚫 Banned</h1>
        <p className="banned-text">
          You’ve been banned from thebiolink.lol community. This action was synced from Discord.
        </p>
        <p className="text-sm text-gray-500">
          Community guidelines apply everywhere. No appeals.
        </p>
      </div>
    </div>
  );
};

export default BannedPage;

// components/UnbannedPage.tsx
import React from 'react';
import Link from 'next/link';

const UnbannedPage: React.FC = () => {
  return (
    <div className="page-unbanned">
      <div className="banned-content text-center">
        <h1 className="banned-title">You're Unbanned</h1>
        <p className="banned-text">
          You’ve been unbanned. Your identity is restored.
        </p>
        <Link href="/login">
          <a className="btn btn-primary inline-block">Log in to continue</a>
        </Link>
      </div>
    </div>
  );
};

export default UnbannedPage;

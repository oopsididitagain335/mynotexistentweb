// components/BottomNav.tsx
import React from 'react';
import { useRouter } from 'next/router';

const BottomNav: React.FC = () => {
  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="bottom-nav">
      <button
        onClick={() => navigate('/discover')}
        className={`bottom-nav-btn ${isActive('/discover') ? 'active' : ''}`}
      >
        <i className="text-xl">🔍</i>
        <span>Discover</span>
      </button>
      <button
        onClick={() => navigate('/dashboard')}
        className={`bottom-nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
      >
        <i className="text-xl">🏠</i>
        <span>Home</span>
      </button>
      <button
        onClick={() => navigate('/dashboard/messages')}
        className={`bottom-nav-btn ${isActive('/dashboard/messages') ? 'active' : ''}`}
      >
        <i className="text-xl">💬</i>
        <span>Inbox</span>
      </button>
    </nav>
  );
};

export default BottomNav;

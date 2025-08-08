// components/FollowButton.tsx
import React from 'react';

interface FollowButtonProps {
  following: boolean;
  requested: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

const FollowButton: React.FC<FollowButtonProps> = ({ following, requested, onClick, size = 'md' }) => {
  const base = size === 'sm' ? 'px-3 py-1 text-sm' : 'px-4 py-2';
  const classes = `btn ${base}`;

  if (requested) {
    return <button className={`${classes} btn-secondary`} disabled>Requested</button>;
  }

  return (
    <button
      onClick={onClick}
      className={`${classes} ${following ? 'btn-secondary' : 'btn-primary'}`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;

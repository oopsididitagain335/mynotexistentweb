// components/LinkCard.tsx
import React from 'react';

interface LinkCardProps {
  emoji: string;
  label: string;
  url: string;
  onClick: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ emoji, label, url, onClick }) => {
  return (
    <div className="link-card haptic" onClick={onClick}>
      <span className="text-2xl" role="img" aria-label={label}>
        {emoji}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default LinkCard;

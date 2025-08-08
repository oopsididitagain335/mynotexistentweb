// components/ActivityPost.tsx
import React from 'react';

interface ActivityPostProps {
  name: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
}

const ActivityPost: React.FC<ActivityPostProps> = ({
  name,
  username,
  avatar,
  content,
  image,
  timestamp,
  likes,
}) => {
  return (
    <div className="activity-post">
      <div className="flex gap-3">
        <img src={avatar} alt={name} className="avatar" />
        <div className="flex-1">
          <div>
            <strong>{name}</strong>{' '}
            <span className="text-gray-500 dark:text-gray-400">@{username}</span>{' '}
            <span className="text-gray-400 text-sm">{timestamp}</span>
          </div>
          <p className="mt-1">{content}</p>
          {image && <img src={image} alt="Post" />}
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            ❤️ {likes} {likes === 1 ? 'like' : 'likes'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPost;

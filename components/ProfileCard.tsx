// components/ProfileCard.tsx
import React from 'react';

interface ProfileCardProps {
  avatar: string;
  name: string;
  username: string;
  bio: string;
  followers: number;
  onFollow: () => void;
  following: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatar,
  name,
  username,
  bio,
  followers,
  onFollow,
  following,
}) => {
  return (
    <div className="card text-center">
      <img src={avatar} alt={name} className="avatar-xl mx-auto mb-4" />
      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-gray-600 dark:text-gray-400">@{username}</p>
      <p className="mt-3 mb-4">{bio}</p>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {followers} {followers === 1 ? 'Follower' : 'Followers'}
      </div>
      <button
        onClick={onFollow}
        className={`follow-btn ${following ? 'follow-btn-following' : 'follow-btn-follow'}`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default ProfileCard;

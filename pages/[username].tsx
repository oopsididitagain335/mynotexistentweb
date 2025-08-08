// [username].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Layout from '@components/Layout';
import LinkCard from '@components/LinkCard';
import ProfileCard from '@components/ProfileCard';
import BadgeDisplay from '@components/BadgeDisplay';
import FollowButton from '@components/FollowButton';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { userProfile: currentUserProfile, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', String(username)));
      if (userDoc.exists()) {
        const data = userDoc.data();
        // Privacy tier check
        if (data.privacy === 'banned') {
          router.push('/banned');
          return;
        }
        if (data.privacy === 'followers' && !isFollowing(data.username)) {
          // Show teaser
        }
        if (data.privacy === 'friends' && !isFriend(data.username)) {
          // Block
          return;
        }
        setProfile(data);
      } else {
        router.push('/404');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFollowing = (user: string) => {
    return currentUserProfile?.following?.includes(user);
  };

  const isFriend = (user: string) => {
    return currentUserProfile?.friends?.includes(user) && profile?.friends?.includes(currentUserProfile.username);
  };

  if (loading) return <Layout><div className="skeleton-card m-4"></div></Layout>;
  if (!profile) return null;

  return (
    <Layout title={`${profile.name} | @${profile.username}`} noNav>
      <div className="page-profile">
        <ProfileCard
          avatar={profile.avatar}
          name={profile.name}
          username={profile.username}
          bio={profile.bio}
          followers={profile.followersCount}
          following={isFollowing(profile.username)}
          onFollow={() => {}} // TODO: API call
        />

        <div className="mt-6">
          <BadgeDisplay username={profile.username} />
        </div>

        <div className="profile-links mt-6">
          {profile.links?.map((link: any, i: number) => (
            <LinkCard
              key={i}
              emoji={link.emoji}
              label={link.label}
              url={link.url}
              onClick={() => window.open(link.url, '_blank')}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

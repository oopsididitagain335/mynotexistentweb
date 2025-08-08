// pages/dashboard/index.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import ProtectedInput from '@components/ProtectedInput';

const Dashboard: React.FC = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [category, setCategory] = useState(userProfile?.category || '');
  const [links, setLinks] = useState(userProfile?.links || []);
  const [loading, setLoading] = useState(false);

  if (!userProfile) return null;

  const save = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        name,
        bio,
        category,
        links,
      });
      await refreshUserProfile();
      alert('Profile saved!');
    } catch (err) {
      alert('Failed to save.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={`Edit Profile — @${userProfile.username}`}>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Edit Profile</h1>
        <div className="card">
          <div className="mb-4">
            <label>Name</label>
            <ProtectedInput value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="textarea w-full"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input w-full"
            >
              <option>Creator</option>
              <option>Designer</option>
              <option>Developer</option>
              <option>Artist</option>
              <option>AI</option>
            </select>
          </div>

          <h3 className="text-lg font-bold mt-6 mb-3">Links</h3>
          {links.map((link: any, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Emoji"
                value={link.emoji}
                onChange={(e) => {
                  const newLinks = [...links];
                  newLinks[i].emoji = e.target.value;
                  setLinks(newLinks);
                }}
                className="input w-16 text-center"
              />
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => {
                  const newLinks = [...links];
                  newLinks[i].label = e.target.value;
                  setLinks(newLinks);
                }}
                className="input flex-1"
              />
              <input
                type="url"
                placeholder="https://"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...links];
                  newLinks[i].url = e.target.value;
                  setLinks(newLinks);
                }}
                className="input flex-1"
              />
              <button
                onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
                className="btn btn-danger"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => setLinks([...links, { emoji: '🔗', label: '', url: '' }])}
            className="btn btn-secondary"
          >
            + Add Link
          </button>

          <div className="mt-6">
            <button
              onClick={save}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

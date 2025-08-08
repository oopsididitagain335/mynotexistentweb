// pages/dashboard/templates.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import TemplateSelector from '@components/TemplateSelector';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Templates: React.FC = () => {
  const { userProfile, refreshUserProfile } = useAuth();
  const [selected, setSelected] = useState(userProfile?.template || 'minimal');

  const save = async () => {
    try {
      await updateDoc(doc(db, 'users', userProfile!.uid), { template: selected });
      await refreshUserProfile();
      alert('Template saved!');
    } catch (err) {
      alert('Failed to save.');
    }
  };

  return (
    <Layout title={`Templates — @${userProfile?.username}`}>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Choose Template</h1>
        <TemplateSelector selected={selected} onSelect={setSelected} />
        <div className="mt-6">
          <button onClick={save} className="btn btn-primary w-full">
            Save Template
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Templates;

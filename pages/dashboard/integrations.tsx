// pages/dashboard/integrations.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { generateLinkToken } from '@lib/tokens';
import { sendEmail } from '@lib/email';

const Integrations: React.FC = () => {
  const { userProfile } = useAuth();
  const [token, setToken] = useState('');

  const generateToken = async () => {
    const { token } = generateLinkToken();
    setToken(token);

    await updateDoc(doc(db, 'linkTokens', token), {
      userId: userProfile?.uid,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendEmail({
      to: userProfile!.email!,
      subject: '🔐 Your Discord Link Token',
      html: `<p>Your link token: <strong>${token}</strong></p>
             <p>Use <code>/link ${token}</code> in Discord within 15 minutes.</p>`,
    });
  };

  return (
    <Layout title="Integrations — thebiolink.lol">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Discord Integration</h1>
        <div className="card">
          <p>Link your Discord to unlock <strong>Verified</strong> badge and cross-platform identity.</p>
          <button
            onClick={generateToken}
            disabled={!!token}
            className="btn btn-primary mt-4"
          >
            {token ? 'Token Generated' : 'Generate Link Token'}
          </button>
          {token && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <code className="text-sm">{token}</code>
              <p className="text-xs text-gray-500 mt-1">Use <code>/link {token}</code> in Discord</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Integrations;

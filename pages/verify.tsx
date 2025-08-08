// pages/verify.tsx
import React from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@lib/firebase';
import Layout from '@components/Layout';

const Verify: React.FC = () => {
  const sendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      alert('Verification email sent!');
    }
  };

  return (
    <Layout title="Verify Email — thebiolink.lol" noNav>
      <div className="page-auth">
        <div className="auth-card">
          <h2 className="auth-title">Verify Your Email</h2>
          <p className="mb-6">We sent a verification link to your inbox. Click it to continue.</p>
          <button onClick={sendVerification} className="btn btn-secondary">
            Resend Email
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Verify;

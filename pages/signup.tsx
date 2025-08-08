// pages/signup.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateKeyPair } from '@lib/crypto';
import Layout from '@components/Layout';
import ProtectedInput from '@components/ProtectedInput';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const keypair = generateKeyPair();

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        username,
        name: username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: '',
        category: 'Creator',
        privacy: 'public',
        template: 'minimal',
        darkMode: false,
        banned: false,
        linked: false,
        followersCount: 0,
        followingCount: 0,
        weeklyClicks: 0,
        badges: ['🎉 First Link'],
        publicKey: keypair.publicKey,
        privateKeyEncrypted: null,
        links: [],
      });

      router.push('/verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up — thebiolink.lol" noNav>
      <div className="page-auth">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          {error && <div className="mb-4 text-danger text-sm">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <ProtectedInput
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <ProtectedInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <ProtectedInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-footer mt-4">
            <a href="/login">Already have an account? Log in</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;

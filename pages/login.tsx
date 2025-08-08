// pages/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@lib/firebase';
import Layout from '@components/Layout';
import ProtectedInput from '@components/ProtectedInput';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Log In — thebiolink.lol" noNav>
      <div className="page-auth">
        <div className="auth-card">
          <h2 className="auth-title">Log In</h2>
          {error && <div className="mb-4 text-danger text-sm">{error}</div>}
          <form onSubmit={handleSubmit}>
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
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="auth-footer mt-4">
            <a href="/signup">Don’t have an account? Sign up</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

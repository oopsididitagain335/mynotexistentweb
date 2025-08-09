import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Firebase imports
import { db, auth } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const router = useRouter();

  // Validate username format: 3-20 chars, alphanumeric, underscore, hyphen
  const isValid = /^[a-zA-Z0-9_-]{3,20}$/.test(username.trim());

  // Check availability in Firestore
  useEffect(() => {
    if (username.length >= 3 && isValid) {
      setIsChecking(true);
      const timeout = setTimeout(async () => {
        try {
          const userDocRef = doc(db, 'usernames', username.toLowerCase());
          const snap = await getDoc(userDocRef);
          setIsAvailable(!snap.exists());
        } catch (error) {
          console.error('Failed to check username:', error);
          setIsAvailable(false);
        } finally {
          setIsChecking(false);
        }
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setIsAvailable(null);
      setIsChecking(false);
    }
  }, [username, isValid]);

  // Track mouse for glow effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting || isAvailable === false) return;

    setIsSubmitting(true);
    try {
      const cleanUsername = username.toLowerCase();
      const userDocRef = doc(db, 'usernames', cleanUsername);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        throw new Error('Username already taken');
      }

      await setDoc(userDocRef, {
        username: cleanUsername,
        claimedAt: new Date().toISOString(),
        uid: auth.currentUser?.uid || null,
      });

      // Show success toast
      setShowToast('success');
      setMessage(`✅ Successfully claimed thebiolink.lol/${cleanUsername}`);
      setTimeout(() => {
        router.push(`/${cleanUsername}`);
      }, 1500);
    } catch (error: any) {
      setShowToast('error');
      setMessage(`❌ ${error.message || 'Failed to claim username'}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  return (
    <div className="container">
      {/* Glow effect */}
      <div
        className="radial-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      <main className="main">
        <h1 className="title">thebiolink.lol</h1>
        <p className="subtitle">Claim your link. Own your identity.</p>

        <form onSubmit={handleSubmit} className="claim-form">
          <div className="input-group">
            <span className="prefix">thebiolink.lol/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoFocus
              className={`input ${isAvailable === false ? 'invalid' : ''} ${isAvailable === true ? 'valid' : ''}`}
              disabled={isSubmitting}
            />
          </div>

          {/* Availability status */}
          {username.length >= 3 && !isValid && (
            <p className="error-text">3-20 characters. Letters, numbers, _ or - only.</p>
          )}
          {isChecking && <p className="status">Checking...</p>}
          {isAvailable === false && !isChecking && (
            <p className="error-text">❌ Taken or invalid</p>
          )}
          {isAvailable === true && !isChecking && (
            <p className="success-text">✅ Available!</p>
          )}

          <button
            type="submit"
            className="claim-button"
            disabled={!isValid || isSubmitting || isAvailable === false}
          >
            {isSubmitting ? 'Claiming...' : 'Claim Link'}
          </button>
        </form>

        {/* Example Profiles */}
        <section className="examples">
          <h2 className="examples-title">Examples</h2>
          <div className="profile-examples">
            {/* Example 1 */}
            <div className="profile-card">
              <div className="avatar">🔥</div>
              <h3 className="example-username">yourname</h3>
              <div className="links">
                <div className="link">Instagram</div>
                <div className="link">TikTok</div>
                <div className="link">Spotify</div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="profile-card">
              <div className="avatar">🎮</div>
              <h3 className="example-username">gamertag</h3>
              <div className="links">
                <div className="link">Twitch</div>
                <div className="link">YouTube</div>
                <div className="link">Discord</div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>
            Made with 💜 • <Link href="/privacy">Privacy</Link> •{' '}
            <Link href="/terms">Terms</Link>
          </p>
        </footer>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${showToast}`}>
          {message}
        </div>
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f11;
          color: white;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .radial-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(106, 17, 203, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 0;
          opacity: 0.8;
        }

        .main {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
        }

        .title {
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.03em;
        }

        .subtitle {
          color: #aaa;
          margin: 0.5rem 0 2rem;
          font-size: 1.1rem;
        }

        .claim-form {
          margin-bottom: 2.5rem;
        }

        .input-group {
          display: flex;
          border: 1px solid #333;
          border-radius: 12px;
          overflow: hidden;
          background: #1a1a1f;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .prefix {
          padding: 0.85rem 1rem;
          background: #25252d;
          color: #888;
          font-size: 1.1rem;
          border-right: 1px solid #333;
        }

        .input {
          flex: 1;
          padding: 0.85rem 1rem;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 1.1rem;
          transition: all 0.2s;
        }

        .input::placeholder {
          color: #666;
        }

        .input.invalid {
          color: #ef4444;
        }

        .input.valid {
          color: #10b981;
        }

        .status, .error-text, .success-text {
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
          text-align: left;
          height: 1.5rem;
        }

        .error-text {
          color: #ef4444;
        }

        .success-text {
          color: #10b981;
        }

        .status {
          color: #666;
        }

        .claim-button {
          margin-top: 1rem;
          background: #6a11cb;
          color: white;
          border: none;
          padding: 0.85rem 2rem;
          font-size: 1.1rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          width: 100%;
        }

        .claim-button:hover:not([disabled]) {
          background: #8418f5;
          transform: translateY(-1px);
        }

        .claim-button:disabled {
          background: #444;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .examples {
          margin-top: 3rem;
        }

        .examples-title {
          font-size: 1.3rem;
          color: #ccc;
          margin-bottom: 1.5rem;
        }

        .profile-examples {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .profile-card {
          background: #1a1a1f;
          border-radius: 16px;
          padding: 1.5rem;
          width: 180px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .avatar {
          font-size: 2.5rem;
          margin: 0 auto 0.8rem;
          display: block;
        }

        .example-username {
          margin: 0 0 1rem;
          font-size: 1.3rem;
          color: white;
        }

        .links {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .link {
          padding: 0.5rem 0.75rem;
          background: #2a2a33;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #aaa;
          text-align: center;
        }

        .link:hover {
          background: #3a3a44;
        }

        .footer {
          margin-top: 3rem;
          font-size: 0.9rem;
          color: #666;
        }

        .footer a {
          color: #6a11cb;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 500;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 0.3s ease;
          z-index: 9999;
        }

        .toast.success {
          background: #10b981;
          color: white;
        }

        .toast.error {
          background: #ef4444;
          color: white;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Firebase imports
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null); // null = unknown

  const router = useRouter();

  const trimmed = username.trim();
  const cleanUsername = trimmed.toLowerCase();

  // Validate format: 3–20 chars, letters, numbers, _, -
  const isValidFormat = /^[a-zA-Z0-9_-]{3,20}$/.test(trimmed);

  // Reset state when input changes
  useEffect(() => {
    if (trimmed === '') {
      setIsAvailable(null);
      setIsChecking(false);
    }
  }, [trimmed]);

  // Check availability with debounce
  useEffect(() => {
    if (trimmed.length < 3 || !isValidFormat) {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);

    const timer = setTimeout(async () => {
      try {
        const userDocRef = doc(db, 'usernames', cleanUsername);
        console.log('Checking Firestore for:', cleanUsername);
        const snap = await getDoc(userDocRef);

        if (!snap.exists()) {
          console.log('✅ Username available:', cleanUsername);
          setIsAvailable(true);
        } else {
          console.log('❌ Username taken:', cleanUsername);
          setIsAvailable(false);
        }
      } catch (error: any) {
        console.error('Firestore check failed:', error);
        // Handle network errors gracefully
        setIsAvailable(null);
        setMessage(`⚠️ Network error: ${error.message}`);
        setShowToast('error');
        setTimeout(() => setShowToast(null), 3000);
      } finally {
        setIsChecking(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [cleanUsername, isValidFormat]);

  // Mouse move handler with typed event
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidFormat || isAvailable !== true || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'usernames', cleanUsername);
      const snap = await getDoc(userDocRef);

      if (snap.exists()) {
        throw new Error('Username already taken');
      }

      // Simulate success for now
      setShowToast('success');
      setMessage(`✅ Success! thebiolink.lol/${cleanUsername}`);
      setTimeout(() => {
        router.push(`/${cleanUsername}`);
      }, 1000);
    } catch (error: any) {
      setShowToast('error');
      setMessage(`❌ ${error.message || 'Claim failed'}`);
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
              placeholder="yourname"
              autoFocus
              className={`input ${isAvailable === false ? 'invalid' : ''} ${isAvailable === true ? 'valid' : ''}`}
              disabled={isSubmitting}
            />
          </div>

          {/* Status Messages */}
          {trimmed && !isValidFormat && (
            <p className="error-text">3–20 characters: letters, numbers, _ or - only.</p>
          )}

          {isChecking && (
            <p className="status">Checking availability...</p>
          )}

          {isAvailable === true && !isChecking && (
            <p className="success-text">✅ Available – you can claim it!</p>
          )}

          {isAvailable === false && !isChecking && (
            <p className="error-text">❌ Already taken. Try another.</p>
          )}

          <button
            type="submit"
            className="claim-button"
            disabled={!isValidFormat || isSubmitting || isAvailable !== true}
          >
            {isSubmitting ? 'Claiming...' : 'Claim Link'}
          </button>
        </form>

        {/* Example Mobile Devices */}
        <section className="examples">
          <h2 className="examples-title">How It Looks</h2>
          <div className="profile-examples">
            {/* Artist */}
            <div className="mobile-device">
              <div className="device-frame">
                <div className="camera"></div>
                <div className="screen">
                  <div className="avatar">🖼️</div>
                  <h3>artistjane</h3>
                  <p>Designer • Illustrator</p>
                  <div className="links">
                    <div className="link">Instagram</div>
                    <div className="link">Portfolio</div>
                    <div className="link">Contact</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamer */}
            <div className="mobile-device">
              <div className="device-frame">
                <div className="camera"></div>
                <div className="screen">
                  <div className="avatar">🎮</div>
                  <h3>gamertag</h3>
                  <p>Streamer • Pro Player</p>
                  <div className="links">
                    <div className="link">Twitch</div>
                    <div className="link">YouTube</div>
                    <div className="link">Discord</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Music */}
            <div className="mobile-device">
              <div className="device-frame">
                <div className="camera"></div>
                <div className="screen">
                  <div className="avatar">🎧</div>
                  <h3>beatmaker</h3>
                  <p>Producer • DJ</p>
                  <div className="links">
                    <div className="link">Spotify</div>
                    <div className="link">SoundCloud</div>
                    <div className="link">Merch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>
            <Link href="/privacy">Privacy</Link> •{' '}
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
          background: radial-gradient(circle, #6a11cb 0%, transparent 70%);
          opacity: 0.15;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .main {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem;
          max-width: 800px;
          width: 90%;
        }

        .title {
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0 0 0.5rem;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #aaa;
          margin: 0 0 2rem;
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
          font-size: 0.95rem;
          min-height: 1.5rem;
          text-align: left;
        }

        .error-text {
          color: #ef4444;
        }

        .success-text {
          color: #10b981;
        }

        .status {
          color: #888;
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
          width: 100%;
        }

        .claim-button:hover:not(:disabled) {
          background: #8418f5;
        }

        .claim-button:disabled {
          background: #444;
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Mobile Device Examples */
        .examples-title {
          font-size: 1.3rem;
          color: #ccc;
          margin: 2.5rem 0 1.5rem;
        }

        .profile-examples {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .mobile-device .device-frame {
          width: 180px;
          height: 360px;
          background: #111;
          border-radius: 40px;
          border: 10px solid #222;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .mobile-device .camera {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 4px;
          background: #000;
          border-radius: 2px;
        }

        .mobile-device .screen {
          height: 100%;
          background: #0a0a0a;
          color: white;
          padding: 2rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.85rem;
        }

        .mobile-device .avatar {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
        }

        .mobile-device h3 {
          margin: 0 0 0.4rem;
          font-size: 1.2rem;
          color: white;
        }

        .mobile-device p {
          color: #aaa;
          margin: 0 0 1rem;
          font-size: 0.85rem;
        }

        .mobile-device .links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .mobile-device .link {
          padding: 0.6rem;
          background: #2a2a33;
          border-radius: 8px;
          text-align: center;
          color: #ddd;
          font-size: 0.85rem;
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

        .toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 500;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          animation: fadeInUp 0.3s ease;
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

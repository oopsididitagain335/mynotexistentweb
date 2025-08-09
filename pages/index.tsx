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
        /* ... (styles remain unchanged) */
      `}</style>
    </div>
  );
}

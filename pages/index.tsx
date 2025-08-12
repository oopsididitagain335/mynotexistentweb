import { useState } from 'react';
import Link from 'next/link';

// Optional: Firebase imports (if collecting emails later)
// import { getDatabase, ref, push } from 'firebase/database';
// import { database } from '../firebase/config'; // if you have a config file

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse glow effect
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Optional: Handle email submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future: save to Firebase or backend
    console.log('Email submitted:', email);
    setEmail('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="container" onMouseMove={handleMouseMove}>
      {/* Radial Glow */}
      <div
        className="radial-glow"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      <main className="main">
        <h1 className="title">thebiolink.lol</h1>
        <p className="subtitle">The next-gen link-in-bio. Built for creators.</p>

        {/* Coming Soon Message */}
        <div className="coming-soon">
          <h2 className="tagline">Coming Soon</h2>
          <p className="description">
            We're rebuilding thebiolink with full customization, monetization, and ownership.
            <br />
            Join the waitlist to get early access.
          </p>

          {/* Email Capture Form (Optional) */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="waitlist-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="email-input"
              />
              <button type="submit" className="submit-btn">
                Notify Me
              </button>
            </form>
          ) : (
            <p className="success-message">✅ Thanks! We'll be in touch.</p>
          )}
        </div>

        {/* Example Profiles Preview */}
        <section className="examples">
          <h3 className="examples-title">What’s Coming</h3>
          <div className="profile-examples">
            {/* Artist Preview */}
            <div className="mobile-device">
              <div className="device-frame">
                <div className="camera"></div>
                <div className="screen">
                  <div className="avatar">🎨</div>
                  <h3>artistjane</h3>
                  <p>Designer • Illustrator</p>
                  <div className="links">
                    <div className="link">Instagram</div>
                    <div className="link">Shop</div>
                    <div className="link">Contact</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streamer Preview */}
            <div className="mobile-device">
              <div className="device-frame">
                <div className="camera"></div>
                <div className="screen">
                  <div className="avatar">🎮</div>
                  <h3>gamertag</h3>
                  <p>Streamer • Creator</p>
                  <div className="links">
                    <div className="link">Twitch</div>
                    <div className="link">YouTube</div>
                    <div className="link">Donate</div>
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

        .coming-soon {
          margin-bottom: 3rem;
        }

        .tagline {
          font-size: 2.2rem;
          font-weight: 700;
          margin: 0 0 1rem;
          color: white;
        }

        .description {
          color: #ccc;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .waitlist-form {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .email-input {
          padding: 0.85rem 1rem;
          border: 1px solid #333;
          border-radius: 12px;
          background: #1a1a1f;
          color: white;
          font-size: 1rem;
          min-width: 240px;
        }

        .email-input::placeholder {
          color: #777;
        }

        .submit-btn {
          padding: 0.85rem 1.5rem;
          background: #6a11cb;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
        }

        .submit-btn:hover {
          background: #8418f5;
        }

        .success-message {
          color: #10b981;
          font-weight: 500;
          margin-top: 1rem;
        }

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
          width: 160px;
          height: 320px;
          background: #111;
          border-radius: 40px;
          border: 8px solid #222;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .mobile-device .camera {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 3px;
          background: #000;
          border-radius: 2px;
        }

        .mobile-device .screen {
          height: 100%;
          background: #0a0a0a;
          color: white;
          padding: 1.5rem 0.8rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.8rem;
        }

        .mobile-device .avatar {
          font-size: 2rem;
          margin-bottom: 0.6rem;
        }

        .mobile-device h3 {
          margin: 0 0 0.3rem;
          font-size: 1.1rem;
          color: white;
        }

        .mobile-device p {
          color: #aaa;
          margin: 0 0 0.8rem;
          font-size: 0.75rem;
        }

        .mobile-device .links {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-device .link {
          padding: 0.5rem;
          background: #2a2a33;
          border-radius: 8px;
          text-align: center;
          color: #ddd;
          font-size: 0.75rem;
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
      `}</style>
    </div>
  );
}

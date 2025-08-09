// pages/message/send.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import { useRouter } from 'next/router';

const SendMessagePage: React.FC = () => {
  const router = useRouter();
  const [senderId, setSenderId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!senderId || !recipientId || !message) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, recipientId, message }),
      });

      // ✅ res.status is a number, not a function
      if (res.status === 200) {
        setSuccess(true);
        setMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Send message error:', err);
      setError('An error occurred while sending the message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Send Message">
      <div className="max-w-md mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Send a Message</h1>

        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="text"
            placeholder="Your ID"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">Message sent successfully!</p>}
      </div>
    </Layout>
  );
};

export default SendMessagePage;

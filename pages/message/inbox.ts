import { useState, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
}

export default function Inbox({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/message/inbox?userId=${encodeURIComponent(userId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMessages(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [userId]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;

  return (
    <div>
      <h1>Inbox for {userId}</h1>
      {messages.length === 0 && <p>No messages</p>}
      <ul>
        {messages.map(msg => (
          <li key={msg.id}>
            <p><b>From:</b> {msg.senderId}</p>
            <p>{msg.content}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

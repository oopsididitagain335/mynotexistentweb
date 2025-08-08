// pages/dashboard/messages.tsx
import React, { useState } from 'react';
import Layout from '@components/Layout';
import MessageList from '@components/MessageList';
import MessageComposer from '@components/MessageComposer';
import { useMessage } from '@contexts/MessageContext';

const Messages: React.FC = () => {
  const { decryptedInbox, loading, error, decryptInbox } = useMessage();
  const [password, setPassword] = useState('');
  const [decrypting, setDecrypting] = useState(false);

  const handleDecrypt = async () => {
    if (!password) return;
    setDecrypting(true);
    try {
      await decryptInbox(password);
      setPassword('');
    } catch (err) {
      alert('Invalid password');
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <Layout title="Messages — thebiolink.lol">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Messages</h1>
        <div className="card">
          {loading && <div className="loader mx-auto my-6"></div>}
          {error && <div className="text-danger">{error}</div>}

          {decryptedInbox.length === 0 ? (
            <div className="text-center py-6">
              <p>🔒 Your messages are end-to-end encrypted.</p>
              <div className="mt-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password to decrypt"
                  className="input mb-2"
                />
                <button
                  onClick={handleDecrypt}
                  disabled={decrypting || !password}
                  className="btn btn-primary"
                >
                  {decrypting ? 'Decrypting...' : 'Decrypt Inbox'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <MessageList
                messages={decryptedInbox}
                currentUserId="TODO"
              />
              <MessageComposer onSend={() => {}} disabled />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;

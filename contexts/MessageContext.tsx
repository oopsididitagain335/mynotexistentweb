// contexts/MessageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import type { User } from '../../pages/api/user/types';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  ciphertext: string;
  ephemeralPublicKey: string;
  nonce: string;
  timestamp: any;
  read: boolean;
}

interface DecryptedMessage extends Message {
  plaintext?: string;
}

interface MessageContextType {
  inbox: Message[];
  decryptedInbox: DecryptedMessage[];
  loading: boolean;
  error: string | null;
  decryptInbox: (password: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  fetchInbox: () => void;
}

const MessageContext = createContext<MessageContextType>({
  inbox: [],
  decryptedInbox: [],
  loading: true,
  error: null,
  decryptInbox: async () => {},
  markAsRead: async () => {},
  fetchInbox: () => {},
});

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [inbox, setInbox] = useState<Message[]>([]);
  const [decryptedInbox, setDecryptedInbox] = useState<DecryptedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = () => {
    if (!currentUser) return;

    setLoading(true);
    const q = query(
      collection(db, 'messages'),
      where('recipientId', '==', currentUser.uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setInbox(messages);
        setLoading(false);
      },
      (err) => {
        setError('Failed to load messages.');
        console.error(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (currentUser) {
      const unsub = fetchInbox();
      return unsub;
    }
  }, [currentUser]);

  const decryptInbox = async (password: string) => {
    if (!userProfile?.privateKeyEncrypted) return;

    const { encrypted, salt, nonce } = userProfile.privateKeyEncrypted;
    const privateKey = await import('libsodium-wrappers')
      .then(sodium => sodium.ready.then(() => sodium))
      .then(sodium => {
        const key = sodium.crypto_pwhash(
          32,
          password,
          sodium.from_base64(salt),
          sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
          sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
          sodium.crypto_pwhash_ALG_DEFAULT
        );
        const decrypted = sodium.crypto_secretbox_open_easy(
          sodium.from_base64(encrypted),
          sodium.from_base64(nonce),
          key
        );
        return decrypted ? Buffer.from(decrypted).toString('utf8') : null;
      });

    if (!privateKey) {
      throw new Error('Invalid password');
    }

    const decrypted = await Promise.all(
      inbox.map(async (msg): Promise<DecryptedMessage> => {
        const plaintext = await import('libsodium-wrappers')
          .then(sodium => sodium.ready.then(() => sodium))
          .then(sodium => {
            const c = sodium.from_base64(msg.ciphertext);
            const epk = sodium.from_base64(msg.ephemeralPublicKey);
            const n = sodium.from_base64(msg.nonce);
            const sk = sodium.from_base64(privateKey);
            const plain = sodium.crypto_box_open_easy(c, n, epk, sk);
            return plain ? Buffer.from(plain).toString('utf8') : '❌ Failed to decrypt';
          })
          .catch(() => '❌ Decryption error');

        return { ...msg, plaintext };
      })
    );

    setDecryptedInbox(decrypted);
  };

  const markAsRead = async (id: string) => {
    // TODO: Update Firestore message.read = true
  };

  const value = {
    inbox,
    decryptedInbox,
    loading,
    error,
    decryptInbox,
    markAsRead,
    fetchInbox,
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error('useMessage must be used within MessageProvider');
  return context;
};

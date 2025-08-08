// components/MessageList.tsx
import React from 'react';

interface Message {
  id: string;
  senderId: string;
  plaintext: string;
  timestamp: any;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="msg-body">
      {messages.length === 0 ? (
        <div className="empty-state">No messages yet.</div>
      ) : (
        messages.map((msg) => {
          const isOut = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={isOut ? 'msg-out' : 'msg-in'}>
              {msg.plaintext}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;

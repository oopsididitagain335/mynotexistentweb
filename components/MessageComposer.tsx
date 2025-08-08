// components/MessageComposer.tsx
import React, { useState } from 'react';

interface MessageComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const send = () => {
    if (!message.trim() || disabled) return;
    onSend(message);
    setMessage('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && send()}
        placeholder="Type a message..."
        className="input flex-1"
        disabled={disabled}
      />
      <button onClick={send} disabled={!message.trim() || disabled} className="btn btn-primary">
        Send
      </button>
    </div>
  );
};

export default MessageComposer;

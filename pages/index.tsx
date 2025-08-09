import React, { useState } from 'react';
import Link from 'next/link';
import '../styles/globals.css';  // Import CSS file here

const Index: React.FC = () => {
  const [username, setUsername] = useState('');

  const handleClaim = () => {
    if (!username.trim()) {
      alert('Please enter a username.');
      return;
    }
    window.location.href = `/signup?username=${encodeURIComponent(username.trim())}`;
  };

  return (
    <main className="indexMain bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-gray-100 relative overflow-x-hidden">
      {/* ...rest of your code */}
    </main>
  );
};

export default Index;

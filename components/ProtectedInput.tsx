// components/ProtectedInput.tsx
import React from 'react';

interface ProtectedInputProps {
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const ProtectedInput: React.FC<ProtectedInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300"
    />
  );
};

export default ProtectedInput;

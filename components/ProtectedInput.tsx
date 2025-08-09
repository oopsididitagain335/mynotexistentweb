// components/ProtectedInput.tsx
import React from 'react';

type InputType = 'text' | 'password' | 'email';

interface ProtectedInputProps {
  type?: InputType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ProtectedInput: React.FC<ProtectedInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  onKeyPress,
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      onKeyPress={onKeyPress}
      className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300"
    />
  );
};

export default ProtectedInput;

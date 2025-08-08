// components/ProtectedInput.tsx
import React from 'react';

interface ProtectedInputProps {
  type?: 'text' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const ProtectedInput: React.FC<ProtectedInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`protected-input input ${className}`}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onSelect={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default ProtectedInput;

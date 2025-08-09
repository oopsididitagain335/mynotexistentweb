import React from 'react';

type InputType = 'text' | 'password' | 'email';

interface ProtectedInputProps {
  type?: InputType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  // Add any other props you want to pass
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
      className="protected-input" // or whatever styling you have
      autoComplete="off"
    />
  );
};

export default ProtectedInput;

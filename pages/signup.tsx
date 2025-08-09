import React from 'react';

type InputType = 'text' | 'password' | 'email';

interface ProtectedInputProps {
  type?: InputType;
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
      className="protected-input"
    />
  );
};

export default ProtectedInput;

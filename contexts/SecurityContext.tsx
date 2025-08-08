// contexts/SecurityContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SecurityContextType {
  isSecure: boolean;
  blockCopy: boolean;
  blockDevtools: boolean;
  detectSuspiciousActivity: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecure: true,
  blockCopy: true,
  blockDevtools: true,
  detectSuspiciousActivity: () => {},
});

declare global {
  interface Window {
    devtools?: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(true);

  // Block copy/paste in password fields
  useEffect(() => {
    const handleCutCopyPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('protected-input') ||
        target.closest('.protected-input')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('cut', handleCutCopyPaste);
    document.addEventListener('copy', handleCutCopyPaste);
    document.addEventListener('paste', handleCutCopyPaste);

    return () => {
      document.removeEventListener('cut', handleCutCopyPaste);
      document.removeEventListener('copy', handleCutCopyPaste);
      document.removeEventListener('paste', handleCutCopyPaste);
    };
  }, []);

  // Detect devtools open
  useEffect(() => {
    const detect = () => {
      const threshold = 160;
      const width = window.outerWidth - window.innerWidth > threshold;
      const height = window.outerHeight - window.innerHeight > threshold;
      if (width || height) {
        console.log('%c⚠️ Devtools abuse violates ToS.', 'color: red; font-size: 16px; font-weight: bold;');
        setIsSecure(false);
      }
    };

    window.addEventListener('resize', detect);
    window.addEventListener('focus', detect);

    const blockKeys = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        console.log('Action disabled by security policy.');
        return false;
      }
    };

    document.addEventListener('keydown', blockKeys);

    return () => {
      window.removeEventListener('resize', detect);
      window.removeEventListener('focus', detect);
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  // Disable right-click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  const detectSuspiciousActivity = () => {
    console.warn('Suspicious interaction detected.');
  };

  const value = {
    isSecure,
    blockCopy: true,
    blockDevtools: true,
    detectSuspiciousActivity,
  };

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within SecurityProvider');
  return context;
};

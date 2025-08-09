import React, { createContext, useContext, ReactNode } from 'react';

interface DiscoveryContextType {
  search: (query: string) => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const search = (query: string) => {
    console.log('Search query:', query);
    // Implement your actual search logic here
  };

  return (
    <DiscoveryContext.Provider value={{ search }}>
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscovery = (): DiscoveryContextType => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
};

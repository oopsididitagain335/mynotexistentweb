import React, { createContext, useContext, ReactNode, useState } from 'react';

interface DiscoveryContextType {
  search: (query: string) => void;
  results: any[]; // You can type this properly if you want
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<any[]>([]);

  const search = (query: string) => {
    console.log('Searching:', query);
    // TODO: implement actual search logic here, maybe call your API
    setResults([{ id: 1, name: 'Dummy result for ' + query }]);
  };

  return (
    <DiscoveryContext.Provider value={{ search, results }}>
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

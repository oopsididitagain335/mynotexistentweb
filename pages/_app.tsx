// pages/_app.tsx
import React from 'react';
import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { DiscoveryProvider } from '@contexts/DiscoveryContext';
import { MessageProvider } from '@contexts/MessageContext';
import { SecurityProvider } from '@contexts/SecurityContext';
import Layout from '@components/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SecurityProvider>
          <DiscoveryProvider>
            <MessageProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </MessageProvider>
          </DiscoveryProvider>
        </SecurityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;

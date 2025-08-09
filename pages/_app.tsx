// pages/_app.tsx
import { DiscoveryProvider } from '@contexts/DiscoveryContext';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DiscoveryProvider>
      <Component {...pageProps} />
    </DiscoveryProvider>
  );
}

export default MyApp;

// pages/_app.tsx
import '../styles/globals.css'; // your global styles
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

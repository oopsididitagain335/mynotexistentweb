import '../styles/globals.css'; // adjust to your global CSS path
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react'; // if you plan to use NextAuth

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

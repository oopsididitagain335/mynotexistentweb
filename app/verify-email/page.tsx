'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const [timeLeft, setTimeLeft] = useState(3);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const email = new URLSearchParams(window.location.search).get('email');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUser(user);
    });

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          router.push('/u/yourname'); // Redirect after countdown
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-mybio-light">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a verification email to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please check your inbox and click the link to verify.
        </p>
        <div className="text-mybio-primary font-medium">
          Redirecting in {timeLeft}...
        </div>
      </div>
    </div>
  );
}

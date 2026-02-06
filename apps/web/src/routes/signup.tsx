import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import SignUpForm from '@/components/sign-up-form';
import { useAuth } from '@/lib/use-auth';

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
});

function SignUpPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-60px)] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] bg-primary/3 blur-[120px] rounded-full" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px] animate-in-up">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import ForgotPasswordForm from '@/components/forgot-password-form';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import { useAuth } from '@/lib/use-auth';

export const Route = createFileRoute('/_app/forgot-password')({
  head: () => ({
    meta: [
      { title: `Forgot Password | ${SITE_NAME}` },
      {
        name: 'description',
        content: 'Reset your Invoice account password.',
      },
      { property: 'og:title', content: `Forgot Password | ${SITE_NAME}` },
      {
        property: 'og:description',
        content: 'Reset your Invoice account password.',
      },
      { property: 'og:url', content: `${SITE_URL}/forgot-password` },
      { name: 'robots', content: 'noindex, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/forgot-password` }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-60px)] relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] bg-primary/3 blur-[120px] rounded-full" />

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
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}

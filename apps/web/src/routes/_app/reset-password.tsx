import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { z } from 'zod';

import ResetPasswordForm from '@/components/reset-password-form';
import { SITE_URL, SITE_NAME } from '@/lib/seo';
import { useAuth } from '@/lib/use-auth';

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute('/_app/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  head: () => ({
    meta: [
      { title: `Reset Password | ${SITE_NAME}` },
      {
        name: 'description',
        content: 'Set a new password for your Invoice account.',
      },
      { property: 'og:title', content: `Reset Password | ${SITE_NAME}` },
      {
        property: 'og:description',
        content: 'Set a new password for your Invoice account.',
      },
      { property: 'og:url', content: `${SITE_URL}/reset-password` },
      { name: 'robots', content: 'noindex, follow' },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/reset-password` }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { token } = Route.useSearch();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-60px)] relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] bg-primary/3 blur-[120px] rounded-full" />

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
          <ResetPasswordForm token={token ?? ''} />
        </div>
      </div>
    </div>
  );
}

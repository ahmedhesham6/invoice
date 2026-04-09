import { Button } from '@invoice/ui/components/button';
import { Input } from '@invoice/ui/components/input';
import { Label } from '@invoice/ui/components/label';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

export default function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="relative">
        <div className="bg-card border border-border/60 p-8 sm:p-10 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="text-center mb-9">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-primary text-primary-foreground mb-5">
              <span className="font-display text-lg">I</span>
            </div>
            <h1 className="font-display text-3xl tracking-tight mb-2">Invalid link</h1>
            <p className="text-sm text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="font-medium text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (result.error) {
        if (
          result.error.message?.includes('INVALID_TOKEN') ||
          result.error.message?.includes('expired')
        ) {
          setError('This reset link has expired. Please request a new one.');
        } else {
          setError(result.error.message || 'Failed to reset password');
        }
        return;
      }

      toast.success('Password reset successfully!');
      navigate({ to: '/login' });
    } catch (_error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-card border border-border/60 p-8 sm:p-10 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-primary text-primary-foreground mb-5">
            <span className="font-display text-lg">I</span>
          </div>
          <h1 className="font-display text-3xl tracking-tight mb-2">Reset password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={isLoading}
              className="h-11 bg-background/50 border-border/60 focus:border-primary/50 transition-colors"
            />
            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          </div>

          {error && (
            <div className="text-sm text-destructive">
              {error}{' '}
              {error.includes('expired') && (
                <Link
                  to="/forgot-password"
                  className="font-medium underline hover:text-destructive/80"
                >
                  Request a new link
                </Link>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 font-medium shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

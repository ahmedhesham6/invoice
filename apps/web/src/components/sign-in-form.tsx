import { Button } from '@invoice/ui/components/button';
import { Input } from '@invoice/ui/components/input';
import { Label } from '@invoice/ui/components/label';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

export default function SignInForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || 'Failed to sign in');
        return;
      }

      toast.success('Welcome back!');
      navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Card */}
      <div className="bg-card border border-border/60 p-8 sm:p-10 relative">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        {/* Header */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-primary text-primary-foreground mb-5">
            <span className="font-display text-lg">I</span>
          </div>
          <h1 className="font-display text-3xl tracking-tight mb-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue to your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 bg-background/50 border-border/60 focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="h-11 bg-background/50 border-border/60 focus:border-primary/50 transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-medium shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

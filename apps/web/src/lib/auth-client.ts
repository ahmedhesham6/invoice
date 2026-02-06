import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

// Use local proxy (same origin) to avoid cross-site cookie issues
// The proxy forwards to Convex and properly handles Set-Cookie headers
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001',
  plugins: [convexClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

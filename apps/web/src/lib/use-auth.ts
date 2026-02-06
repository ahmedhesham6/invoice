import { api } from '@invoice/backend/convex/_generated/api';
import { useConvexAuth, useQuery } from 'convex/react';

import { authClient } from './auth-client';

/**
 * Custom auth hook that combines Better Auth session with Convex auth state.
 */
export function useAuth() {
  const { isLoading: isConvexLoading, isAuthenticated } = useConvexAuth();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // Get user from Convex when authenticated
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : 'skip');

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return {
    isLoading: isConvexLoading || isSessionPending || (isAuthenticated && user === undefined),
    isAuthenticated,
    user: user ?? null,
    session: session ?? null,
    signOut,
  };
}

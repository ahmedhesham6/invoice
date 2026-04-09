import type { DataModel } from './_generated/dataModel';
import { createClient } from '@convex-dev/better-auth';
import type { GenericCtx } from '@convex-dev/better-auth';
import { convex, crossDomain } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth/minimal';

import { components } from './_generated/api';
import { query } from './_generated/server';
import authConfig from './auth.config';

const siteUrl = process.env.SITE_URL!;
const convexSiteUrl = process.env.CONVEX_SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: convexSiteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          console.error('RESEND_API_KEY is not configured');
          return;
        }
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Invoice <noreply@ahmedhesham.dev>',
            to: user.email,
            subject: 'Reset your password',
            html: `<p>Hi ${user.name},</p><p>Click the link below to reset your password:</p><p><a href="${url}">${url}</a></p><p>This link will expire in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`,
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          console.error('Failed to send reset email:', res.status, text);
        }
      },
    },
    plugins: [convex({ authConfig }), crossDomain({ siteUrl })],
  });
};

// Get the current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

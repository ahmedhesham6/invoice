## Context

The app uses Better Auth (`betterAuth` from `better-auth/minimal`) with `@convex-dev/better-auth` for Convex integration. Auth is email/password only, configured in `packages/backend/convex/auth.ts`. The client is set up in `apps/web/src/lib/auth-client.ts` using `createAuthClient`. There is no email service integrated — no transactional email capability exists yet.

Better Auth has a built-in `forgetPassword` plugin that handles token generation, validation, and password hashing. We need to provide the email sending function and the frontend pages.

## Goals / Non-Goals

**Goals:**

- Allow users to reset their password via email when they forget it
- Leverage Better Auth's built-in `forgetPassword` plugin for the full flow (token generation, validation, password update, and email sending via its `sendResetPassword` callback)

**Non-Goals:**

- Email verification for signup (separate feature)
- Password change from settings while logged in (separate feature)
- Rate limiting beyond what Better Auth provides by default
- Custom email templates with rich HTML (plain functional emails are fine for v1)

## Decisions

### 1. Use Better Auth's `forgetPassword` plugin

**Choice**: Use the built-in plugin instead of custom token/reset logic.

**Rationale**: Better Auth already handles secure token generation, expiry, hashing, and password update. Rolling our own would duplicate tested functionality and risk security issues.

**Alternative considered**: Custom Convex mutations for token storage/validation — rejected because it duplicates Better Auth internals and requires manual security review.

### 2. Email delivery via Better Auth's `sendResetPassword` callback

**Choice**: Use Resend's HTTP API inside Better Auth's `sendResetPassword` callback via `fetch`. All email sending is configured within the `forgetPassword` plugin — no separate email service layer.

**Rationale**: Better Auth owns the full reset flow. The `sendResetPassword` callback is the plugin's built-in mechanism for email delivery. Calling Resend's API via `fetch` directly inside this callback keeps everything in one place and avoids unnecessary abstraction.

**Alternative considered**: Building a standalone email service module — rejected because the only email need right now is password reset, and Better Auth already provides the hook. A reusable service can be extracted later if more email use cases arise.

### 3. Frontend routing structure

**Choice**: Two new routes — `/forgot-password` and `/reset-password`.

**Rationale**: `/forgot-password` is the email input form. `/reset-password` is the token-based password entry form (token passed as URL query param by Better Auth). Both are public routes under the existing `_app` layout.

## Risks / Trade-offs

**[Risk] Resend API key exposure** → Store `RESEND_API_KEY` as a Convex environment variable. Never expose to the client.

**[Risk] Email deliverability** → Resend handles SPF/DKIM for their default domain. For production, a custom sending domain should be configured in Resend dashboard (out of scope for this change).

**[Risk] Token expiry UX** → If a user clicks an expired reset link, they see an error. The reset password page should handle this gracefully and offer to resend.

**[Trade-off] Plain text emails for v1** → Simpler to ship but less professional. Can be upgraded to HTML templates later without changing the architecture.

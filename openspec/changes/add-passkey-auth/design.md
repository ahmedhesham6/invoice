## Context

The app uses Better Auth with `@convex-dev/better-auth` for Convex integration. Auth is currently email/password with password reset via Resend. The server config is in `packages/backend/convex/auth.ts` (using `betterAuth` from `better-auth/minimal`), and the client in `apps/web/src/lib/auth-client.ts`. The settings page (`apps/web/src/routes/_app/settings.tsx`) currently has profile, address, invoice, template, and payment sections — passkey management will be added as a new section.

Better Auth provides a first-party `@better-auth/passkey` plugin that wraps SimpleWebAuthn and handles all WebAuthn ceremony logic, token storage, and credential management.

## Goals / Non-Goals

**Goals:**

- Allow users to register passkeys from their settings page
- Allow users to sign in with a registered passkey from the login page
- Allow users to manage (list, rename, delete) their passkeys in settings

**Non-Goals:**

- Passkey-first onboarding (registering a passkey during signup without a password) — users must first sign up with email/password, then add passkeys from settings
- Conditional UI / autofill passkey prompts — keeping sign-in explicit with a button for v1
- Removing password auth — passkeys are an additional option, not a replacement

## Decisions

### 1. Use Better Auth's `@better-auth/passkey` plugin

**Choice**: Use the official plugin rather than a custom WebAuthn implementation.

**Rationale**: The plugin handles registration/authentication ceremonies, credential storage, and the `passkey` database table automatically via the Convex adapter. No manual schema or WebAuthn logic needed.

**Alternative considered**: Direct `@simplewebauthn/server` integration — rejected because the Better Auth plugin already wraps it and integrates with the session system.

### 2. WebAuthn configuration

**Choice**: Configure `rpID` and `origin` based on `SITE_URL` environment variable, with `rpName` set to "Invoice".

**Rationale**: `rpID` must match the domain (e.g., `localhost` in dev, `invoice.ahmedhesham.dev` in production). `origin` is the full frontend origin. Using `SITE_URL` keeps this consistent with the existing auth config.

### 3. Passkey management in settings page

**Choice**: Add a "Passkeys" card section to the existing settings page rather than a separate page.

**Rationale**: Passkey management is a lightweight UI (list, add, rename, delete). It fits naturally alongside the existing profile and security settings. No need for a dedicated route.

### 4. Sign-in UX

**Choice**: Add a "Sign in with passkey" button below the email/password form on the login page, separated by a divider.

**Rationale**: Keeps the existing flow intact while offering passkey as a visible alternative. Users who have registered a passkey can use it; others continue with email/password.

## Risks / Trade-offs

**[Risk] Browser support** → WebAuthn is supported in all modern browsers but not older ones. The passkey button should only render when `PublicKeyCredential` is available in the browser.

**[Risk] rpID change between environments** → `rpID` must match the domain. Using `SITE_URL` to derive it ensures correctness per environment. Passkeys registered in dev won't work in production (expected).

**[Trade-off] No conditional UI for v1** → Autofill-based passkey prompts provide a smoother UX but add complexity. Explicit button is simpler and sufficient for initial launch.

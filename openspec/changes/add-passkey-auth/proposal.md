## Why

Passkeys provide phishing-resistant, passwordless authentication that's faster and more secure than passwords. They're now supported across all major browsers and platforms (Touch ID, Face ID, Windows Hello, security keys). Adding passkey support gives users a modern sign-in option and positions the app alongside current auth best practices.

## What Changes

- Add Better Auth `passkey` plugin on the server with WebAuthn configuration (rpID, rpName, origin)
- Add `passkeyClient` plugin on the client
- Add "Sign in with passkey" option on the login page
- Add passkey management section in settings (register, list, rename, delete passkeys)
- Install `@better-auth/passkey` dependency on both backend and web packages
- The `passkey` table is automatically created by Better Auth's Convex adapter

## Capabilities

### New Capabilities

- `passkey-auth`: Passkey registration, sign-in, and management using Better Auth's passkey plugin and WebAuthn

### Modified Capabilities

_None — no existing specs are affected._

## Impact

- **Backend**: `@better-auth/passkey` added, `passkey()` plugin registered in `auth.ts`
- **Frontend**: `@better-auth/passkey` added, `passkeyClient()` plugin registered in `auth-client.ts`
- **Login page**: New "Sign in with passkey" button
- **Settings page**: New "Passkeys" card for managing registered passkeys
- **Database**: Better Auth auto-creates `passkey` table via its Convex component

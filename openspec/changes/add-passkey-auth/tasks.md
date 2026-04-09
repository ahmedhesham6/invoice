## 1. Dependencies

- [x] 1.1 Install `@better-auth/passkey` in both `packages/backend` and `apps/web`

## 2. Backend — Passkey Plugin

- [x] 2.1 Add `passkey()` plugin to Better Auth config in `packages/backend/convex/auth.ts` with `rpID`, `rpName`, and `origin` derived from environment
- [x] 2.2 Verify Convex schema auto-generates the `passkey` table after deploying

## 3. Client — Passkey Plugin

- [x] 3.1 Add `passkeyClient()` plugin to `apps/web/src/lib/auth-client.ts`

## 4. Login Page — Passkey Sign-In

- [x] 4.1 Add "Sign in with passkey" button to `sign-in-form.tsx` below the form, separated by a divider
- [x] 4.2 Gate the button behind `PublicKeyCredential` availability check
- [x] 4.3 Wire button to call `authClient.signIn.passkey()` and redirect to dashboard on success

## 5. Settings Page — Passkey Management

- [x] 5.1 Add a "Passkeys" card section to settings page with list of registered passkeys (name, device type, created date)
- [x] 5.2 Add "Add passkey" button that calls `authClient.passkey.addPasskey()` and refreshes the list
- [x] 5.3 Add rename functionality for each passkey via `authClient.passkey.updatePasskey()`
- [x] 5.4 Add delete functionality for each passkey via `authClient.passkey.deletePasskey()` with confirmation

## 6. Verification

- [x] 6.1 Test registering a passkey from settings (manual)
- [x] 6.2 Test signing in with a registered passkey (manual)
- [x] 6.3 Test renaming and deleting passkeys (manual)
- [x] 6.4 Verify passkey button is hidden in browsers without WebAuthn support (manual)

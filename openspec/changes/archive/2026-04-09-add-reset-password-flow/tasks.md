## 1. Backend — Better Auth `forgetPassword` Plugin

- [x] 1.1 Add `RESEND_API_KEY` to Convex environment variables
- [x] 1.2 Enable Better Auth `forgetPassword` plugin in `packages/backend/convex/auth.ts` with `sendResetPassword` callback that sends the reset email via Resend's HTTP API using `fetch`
- [x] 1.3 Enable Better Auth `forgetPasswordClient` plugin in `apps/web/src/lib/auth-client.ts`

## 2. Frontend — Forgot Password Page

- [x] 2.1 Create `/forgot-password` route at `apps/web/src/routes/_app/forgot-password.tsx` as a public route
- [x] 2.2 Create `ForgotPasswordForm` component with email input, submit handler calling `authClient.forgetPassword`, and confirmation message on success
- [x] 2.3 Style the form consistent with existing sign-in/sign-up pages

## 3. Frontend — Reset Password Page

- [x] 3.1 Create `/reset-password` route at `apps/web/src/routes/_app/reset-password.tsx` as a public route that reads `token` from query params
- [x] 3.2 Create `ResetPasswordForm` component with new password input (8-char min), submit handler calling `authClient.resetPassword` with the token
- [x] 3.3 Handle expired/invalid token errors with message and link back to forgot password page
- [x] 3.4 On success, show toast and redirect to login page

## 4. Login Page — Forgot Password Link

- [x] 4.1 Add "Forgot password?" link to `sign-in-form.tsx` between the password field and the submit button, linking to `/forgot-password`

## 5. Verification

- [ ] 5.1 Test full flow: request reset → receive email → click link → set new password → login with new password (manual)
- [ ] 5.2 Verify expired token shows error and re-request option (manual)
- [ ] 5.3 Verify unregistered email shows same confirmation as registered email — no enumeration (manual)

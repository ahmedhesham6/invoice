## Why

Users who forget their password have no way to regain access to their account. This is a critical missing feature for any production auth system — without it, locked-out users must be handled manually or abandoned entirely.

## What Changes

- Add a "Forgot password?" link on the login page that navigates to a password reset request form
- Add a reset password request page where users enter their email to receive a reset link
- Add a reset password page where users set a new password using the token from the email
- Enable Better Auth's built-in `forgetPassword` plugin on both server and client, with email sending configured via its `sendResetPassword` callback

## Capabilities

### New Capabilities

- `password-reset`: End-to-end forgot/reset password flow using Better Auth's `forgetPassword` plugin, including email delivery, token validation, and password update

### Modified Capabilities

_None — no existing specs are affected._

## Impact

- **Backend**: Better Auth `forgetPassword` plugin enabled with `sendResetPassword` callback using Resend API
- **Frontend**: 2 new routes (`/forgot-password`, `/reset-password`), updated login page with forgot password link
- **Environment**: `RESEND_API_KEY` environment variable required for email delivery
- **Auth config**: Better Auth server and client config updated with `forgetPassword` plugin

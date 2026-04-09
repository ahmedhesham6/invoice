## ADDED Requirements

### Requirement: User can request a password reset
The system SHALL allow unauthenticated users to request a password reset by providing their email address. The system SHALL send a reset email if the email is associated with an account. The system SHALL NOT reveal whether an email exists in the system (to prevent enumeration).

#### Scenario: Valid email request
- **WHEN** a user submits the forgot password form with a registered email address
- **THEN** Better Auth's `forgetPassword` plugin sends a password reset email via its `sendResetPassword` callback containing a unique, time-limited reset link, and the UI displays a confirmation message

#### Scenario: Unregistered email request
- **WHEN** a user submits the forgot password form with an email not in the system
- **THEN** the system displays the same confirmation message as a valid request (no error indicating the email doesn't exist)

#### Scenario: Empty email submission
- **WHEN** a user submits the forgot password form with an empty email field
- **THEN** the system displays a validation error and does not send any request

### Requirement: User can reset their password via token
The system SHALL allow users to set a new password by navigating to a reset link containing a valid token. The new password MUST meet the same minimum length requirement as signup (8 characters).

#### Scenario: Valid token and new password
- **WHEN** a user navigates to the reset password page with a valid, non-expired token and submits a new password meeting requirements
- **THEN** the system updates the user's password, displays a success message, and redirects to the login page

#### Scenario: Expired or invalid token
- **WHEN** a user navigates to the reset password page with an expired or invalid token
- **THEN** the system displays an error message indicating the link has expired and offers a link to request a new reset email

#### Scenario: Password too short
- **WHEN** a user submits a new password shorter than 8 characters
- **THEN** the system displays a validation error and does not update the password

### Requirement: Forgot password link on login page
The login page SHALL include a "Forgot password?" link that navigates to the forgot password page.

#### Scenario: User clicks forgot password link
- **WHEN** a user clicks the "Forgot password?" link on the login page
- **THEN** the system navigates to the forgot password page

### Requirement: Reset password routes are public
The forgot password and reset password pages SHALL be accessible without authentication.

#### Scenario: Unauthenticated access to forgot password
- **WHEN** an unauthenticated user navigates to `/forgot-password`
- **THEN** the page loads without redirecting to login

#### Scenario: Unauthenticated access to reset password
- **WHEN** an unauthenticated user navigates to `/reset-password` with a token parameter
- **THEN** the page loads without redirecting to login

### Requirement: Reset email content and delivery
The `sendResetPassword` callback in Better Auth's `forgetPassword` plugin SHALL send the reset email via Resend's HTTP API using `fetch`. The email SHALL contain a link to the reset password page with the token. The `RESEND_API_KEY` MUST be stored as a server-side environment variable.

#### Scenario: Email contains reset link
- **WHEN** a password reset email is sent via the `sendResetPassword` callback
- **THEN** the email body contains a link in the format `{SITE_URL}/reset-password?token={token}` and instructions to reset the password

#### Scenario: Missing API key
- **WHEN** the system attempts to send a reset email without a configured `RESEND_API_KEY`
- **THEN** the system logs an error and the request fails gracefully without crashing

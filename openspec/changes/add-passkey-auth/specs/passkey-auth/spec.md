## ADDED Requirements

### Requirement: User can register a passkey
An authenticated user SHALL be able to register a passkey from the settings page. The system SHALL prompt the browser's WebAuthn ceremony and store the credential upon success.

#### Scenario: Successful passkey registration
- **WHEN** an authenticated user clicks "Add passkey" in settings and completes the browser WebAuthn prompt
- **THEN** the system stores the passkey and displays it in the user's passkey list with a default name

#### Scenario: User cancels WebAuthn prompt
- **WHEN** a user clicks "Add passkey" but cancels the browser's WebAuthn dialog
- **THEN** the system displays no error and returns to the settings page without changes

#### Scenario: User names their passkey
- **WHEN** a user registers a passkey
- **THEN** the system allows the user to provide an optional name for the passkey (e.g., "MacBook Touch ID")

### Requirement: User can sign in with a passkey
An unauthenticated user SHALL be able to sign in using a registered passkey from the login page.

#### Scenario: Successful passkey sign-in
- **WHEN** a user clicks "Sign in with passkey" on the login page and completes the browser WebAuthn prompt
- **THEN** the system authenticates the user and redirects to the dashboard

#### Scenario: User cancels passkey sign-in
- **WHEN** a user clicks "Sign in with passkey" but cancels the browser prompt
- **THEN** the system remains on the login page without showing an error

#### Scenario: Passkey not recognized
- **WHEN** a user attempts passkey sign-in with an unregistered credential
- **THEN** the system displays an error message indicating the passkey was not recognized

### Requirement: User can list their passkeys
An authenticated user SHALL be able to view all registered passkeys in the settings page.

#### Scenario: User has passkeys
- **WHEN** an authenticated user views the passkeys section in settings
- **THEN** the system displays a list showing each passkey's name, device type, and creation date

#### Scenario: User has no passkeys
- **WHEN** an authenticated user views the passkeys section and has no registered passkeys
- **THEN** the system displays a message indicating no passkeys are registered with a prompt to add one

### Requirement: User can rename a passkey
An authenticated user SHALL be able to rename any of their registered passkeys.

#### Scenario: Successful rename
- **WHEN** a user edits a passkey's name and saves
- **THEN** the system updates the passkey name and reflects the change in the list

### Requirement: User can delete a passkey
An authenticated user SHALL be able to delete any of their registered passkeys.

#### Scenario: Successful deletion
- **WHEN** a user deletes a passkey and confirms the action
- **THEN** the system removes the passkey and it no longer appears in the list or works for sign-in

### Requirement: Passkey sign-in button visibility
The "Sign in with passkey" button SHALL only be displayed when the browser supports WebAuthn (`PublicKeyCredential` is available).

#### Scenario: Browser supports WebAuthn
- **WHEN** the login page loads in a browser that supports WebAuthn
- **THEN** the "Sign in with passkey" button is visible

#### Scenario: Browser does not support WebAuthn
- **WHEN** the login page loads in a browser that does not support WebAuthn
- **THEN** the "Sign in with passkey" button is not rendered

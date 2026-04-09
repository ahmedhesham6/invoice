## ADDED Requirements

### Requirement: Synchronous HTML rendering for print

The system SHALL generate invoice template HTML using `renderToStaticMarkup` synchronously, eliminating any timing-dependent delays.

#### Scenario: Template renders without race condition

- **WHEN** user clicks "Print / Save PDF" button
- **THEN** the template HTML is generated synchronously before the print window is opened, with no `setTimeout` delays

#### Scenario: Complex template renders completely

- **WHEN** user clicks "Print / Save PDF" on an invoice using any of the 9 available templates
- **THEN** the generated HTML contains the full template markup including all line items, totals, and styling

### Requirement: Print dialog opens in correct window

The system SHALL trigger the browser print dialog in the newly opened print window containing the invoice content.

#### Scenario: Print dialog shows invoice content

- **WHEN** the print window opens and all resources (fonts, CSS) finish loading
- **THEN** the browser print dialog is triggered in that window showing the rendered invoice

#### Scenario: Original page is not printed

- **WHEN** user clicks "Print / Save PDF"
- **THEN** the print dialog SHALL NOT appear on the original application window

### Requirement: Popup-blocked feedback uses toast

The system SHALL display a toast notification (not a browser alert) when the print window is blocked by the browser's popup blocker.

#### Scenario: Browser blocks popup

- **WHEN** user clicks "Print / Save PDF" and the browser blocks the popup window
- **THEN** a toast notification is displayed informing the user to allow popups for this site

#### Scenario: Toast is non-blocking

- **WHEN** a popup-blocked toast is displayed
- **THEN** the user can continue interacting with the application without dismissing a modal dialog

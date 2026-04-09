## Why

The "Save to PDF" feature is broken. The current implementation uses `window.open('', '_blank')` to create a print window, then calls `window.print()` inside it — but `window.print()` is called on the **opener** window context (`window.print()` at line 129 fires on the original page, not the print window). Additionally, the approach relies on arbitrary `setTimeout` delays (100ms for React render, 300ms for print trigger) that are fragile across devices and network speeds. Users clicking "Print / Save PDF" either get a blank page, the wrong page printing, or inconsistent results depending on browser popup-blocker behavior.

## What Changes

- **Fix print target**: Ensure `print()` is called on the correct window (the print window, not the opener).
- **Replace timing hacks**: Use `renderToStaticMarkup` from `react-dom/server` instead of `createRoot` + `setTimeout` to generate template HTML synchronously — eliminating the race condition entirely.
- **Improve popup-block handling**: Provide better UX when the browser blocks the popup (e.g., toast notification instead of `alert()`).
- **Ensure font/CSS readiness**: Wait for `window.onload` in the print window before triggering print, which already exists but is undermined by the broken window reference.

## Capabilities

### New Capabilities

- `pdf-export`: Reliable client-side PDF export via browser print dialog with synchronous HTML rendering and correct print-window targeting.

### Modified Capabilities

_(none)_

## Impact

- **Code**: `apps/web/src/components/pdf/download-pdf-button.tsx` — primary file being fixed.
- **Dependencies**: Adds `react-dom/server` usage (already available as part of `react-dom` — no new install needed).
- **APIs**: No backend changes.
- **UX**: Users will see consistent, working PDF export across browsers. The print dialog will reliably open in the new window with the correct invoice content.

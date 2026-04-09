## Context

The invoice app has a "Print / Save PDF" button (`DownloadPDFButton`) that opens a new browser window, renders the selected invoice template as HTML, and triggers the browser print dialog. The current implementation has two critical bugs:

1. **Wrong print target**: `window.print()` is called inside a `<script>` in the print window via `window.onload`, which is correct — but the React HTML is generated using `createRoot` + a 100ms `setTimeout`, which is a race condition. On slower devices or complex templates, React may not finish rendering in 100ms, resulting in blank or partial content.

2. **Fragile async rendering**: `createRoot` is designed for interactive React trees, not static HTML extraction. The 100ms delay is an unreliable workaround.

The component lives at `apps/web/src/components/pdf/download-pdf-button.tsx` and is used in two routes: the public invoice view (`/i/$token`) and the invoice detail page (`/invoices/$id`).

## Goals / Non-Goals

**Goals:**
- Eliminate the race condition by generating template HTML synchronously
- Ensure the print dialog always shows the correct, fully-rendered invoice
- Replace `alert()` with a toast for blocked popups
- Keep the browser-native print-to-PDF approach (no new PDF libraries)

**Non-Goals:**
- Server-side PDF generation (future scope)
- Changing the template system or adding new templates
- Email PDF attachments

## Decisions

### 1. Use `renderToStaticMarkup` instead of `createRoot` + `setTimeout`

**Choice**: `react-dom/server.renderToStaticMarkup()` generates HTML synchronously from React components, returning a plain string with no React hydration markers.

**Why over alternatives**:
- `createRoot` + `setTimeout(100)` — current approach, race condition, breaks on slow devices
- `renderToString` — adds React hydration attributes (`data-reactroot`, etc.) unnecessarily since we don't hydrate
- `renderToStaticMarkup` — clean HTML, synchronous, zero timing issues. Already bundled with `react-dom`.

### 2. Keep `window.open` + `document.write` pattern

**Choice**: Continue using `window.open('', '_blank')` with `document.write()`.

**Why**: This is the simplest approach for cross-browser print-window creation. The popup-blocked case is already handled — we just improve the UX from `alert()` to a toast.

### 3. Use existing toast system for popup-blocked feedback

**Choice**: Use the app's existing toast/sonner system instead of `alert()`.

**Why**: Consistent with the rest of the app's notification patterns. Non-blocking UX.

## Risks / Trade-offs

- **[Risk] `renderToStaticMarkup` doesn't support client-side hooks** → Not an issue; invoice templates are purely presentational components with no state or effects.
- **[Risk] Popup blockers still block the window** → Mitigated by showing a helpful toast. This is a browser constraint we can't bypass.
- **[Risk] Tailwind CDN in print window may load slowly** → Existing issue, out of scope for this fix. The `window.onload` handler already waits for resources before printing.

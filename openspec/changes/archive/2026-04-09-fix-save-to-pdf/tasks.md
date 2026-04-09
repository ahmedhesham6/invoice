## 1. Replace async rendering with synchronous HTML generation

- [x] 1.1 Import `renderToStaticMarkup` from `react-dom/server` in `download-pdf-button.tsx`
- [x] 1.2 Replace `createRoot` + `setTimeout` with a single `renderToStaticMarkup()` call to generate template HTML synchronously
- [x] 1.3 Remove the `createRoot` and `react-dom/client` import (if no longer used elsewhere in the file)

## 2. Fix popup-blocked feedback

- [x] 2.1 Replace `alert('Please allow popups...')` with a toast notification using the app's existing toast/sonner system
- [x] 2.2 Import the toast utility in `download-pdf-button.tsx`

## 3. Clean up and verify

- [x] 3.1 Remove the unused `setTimeout` wrapper — HTML generation and `printWindow.document.write()` should happen synchronously in sequence
- [x] 3.2 Verify the `window.onload` + `setTimeout(print, 300)` in the print window script still fires correctly after `document.close()`
- [x] 3.3 Test with multiple templates to confirm full content renders in the print preview

# Invoice — Feature Reference

> Professional invoicing for freelancers — create, manage, and share invoices with ease.

---

## Table of Contents

- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [Invoices](#invoices)
- [Clients](#clients)
- [Invoice Templates](#invoice-templates)
- [PDF / Print](#pdf--print)
- [Public Invoice Links](#public-invoice-links)
- [Business Profile & Settings](#business-profile--settings)
- [UI & Design System](#ui--design-system)
- [Tech Stack](#tech-stack)

---

## Authentication

- **Email/password sign-up & sign-in** via Better Auth + Convex
- Server-side session validation on every route (JWT + session cookies)
- Protected routes with automatic redirect to `/login` for unauthenticated users
- Auto-creates a user profile on first sign-up with sensible defaults
- Persistent sessions across tabs and page refreshes
- Sign-out with full cookie cleanup

## Dashboard

| Stat | Description |
|------|-------------|
| **Outstanding** | Total amount across all `sent` + `overdue` invoices |
| **Paid This Month** | Revenue from invoices marked paid in the current month |
| **Overdue Count** | Number of invoices past their due date |
| **Total Clients** | Number of clients in the directory |
| **Total Invoices** | Lifetime invoice count |

- **Recent Invoices** — Last 5 invoices with client name, amount, status badge, and quick links
- **Status Breakdown** — Count of invoices per status (draft / sent / paid / overdue)
- **Auto-Overdue Detection** — On dashboard load, sent invoices past their due date are automatically marked overdue
- Quick-action buttons to create a new invoice or add a new client

## Invoices

### Create Invoice

- Select client from dropdown (or link to create one)
- Auto-generated invoice number from profile prefix + auto-incrementing counter (e.g. `INV-001`)
- Customizable invoice number (can override the suggestion)
- Issue date (defaults to today) and due date (defaults to today + payment terms)
- Currency selector (USD, EUR, GBP, CAD, AUD, JPY, CHF, INR)
- **Line items** — unlimited rows with:
  - Description (free text)
  - Quantity (supports decimals, e.g. 2.5)
  - Unit type: Hours, Days, Items, Project, Month, Custom
  - Unit rate (in dollars, stored as cents)
  - Auto-calculated line total
- Add / remove line items dynamically
- **Tax** — percentage-based tax rate, auto-calculated
- **Discount** — percentage or fixed amount, auto-calculated
- Live-updating subtotal / tax / discount / total preview
- Notes field (optional, pre-filled from profile default)
- Payment details field (optional, pre-filled from profile default)
- **Template selector** — choose from 9 invoice templates with live preview (see [Invoice Templates](#invoice-templates))
- Responsive mobile layout for line item editing

### Edit Invoice

- All fields from creation are editable (except invoice number)
- Only **draft** invoices can be edited
- Template can be changed on edit
- Full line item re-ordering / add / remove
- Saves via `fullUpdate` mutation (replaces all line items atomically)

### Invoice Detail View

- Full invoice breakdown: From/To addresses, dates, line items table, totals
- Status badge with color coding
- Action buttons based on status:
  - **Draft**: Edit, Mark as Sent, Delete, Duplicate, Preview, Copy Link, Print/PDF
  - **Sent/Overdue**: Mark as Paid, Duplicate, Preview, Copy Link, Print/PDF
  - **Paid**: Duplicate, Preview, Copy Link, Print/PDF
- Template-aware PDF printing (uses the selected template)

### Invoice List

- Filterable by status (All / Draft / Sent / Paid / Overdue)
- Filterable by client
- Sorted by creation date (newest first)
- Each row shows: invoice number, client name, issue date, due date, total amount, status badge
- Click to view invoice details
- Quick delete for draft invoices

### Status Workflow

```
Draft → Sent → Paid
              → Overdue → Paid
```

- **Draft** — editable and deletable
- **Sent** — triggered manually via "Mark as Sent" (records `sentAt` timestamp)
- **Overdue** — auto-detected when due date passes (checked on dashboard load)
- **Paid** — terminal state, triggered via "Mark as Paid" (records `paidAt` timestamp)

### Duplicate Invoice

- Creates a new draft copy of any invoice
- Prompts for a new invoice number (pre-filled with next auto-increment)
- Copies all line items, tax, discount, notes, payment details, and template
- New issue date (today) and due date (+30 days)

## Clients

### Create Client

- Name and email (required)
- Phone, street address, city, postal code, country (optional)
- Tax ID / VAT number (optional)
- Internal notes (optional)
- **Per-client invoice template** override (optional)

### Edit Client

- All fields editable
- Template override can be set or cleared
- Cannot delete a client that has existing invoices

### Client List

- All clients displayed with name, email, phone, creation date
- Search/filter by name or email
- Click to edit
- Delete with confirmation (blocked if client has invoices)
- Client count displayed

## Invoice Templates

9 distinct, production-grade invoice templates — each with a unique visual identity:

| # | Template | Aesthetic | Colors |
|---|----------|-----------|--------|
| 1 | **Classic** | Clean corporate, dark header band, structured grid | Black / white / blue |
| 2 | **Minimal** | Stark whitespace, Scandinavian simplicity, whisper-quiet | White / light gray |
| 3 | **Bold** | Heavy type, vibrant orange accent, brutalist energy | Black / orange `#ff5722` |
| 4 | **Elegant** | Serif typography, cream paper, gold accents | Cream `#faf8f3` / gold `#9c7c38` |
| 5 | **Retro** | Typewriter mono, warm earth tones, receipt vibes | Warm `#fdf6ee` / rust `#c5632d` |
| 6 | **Neon** | Dark background, glowing cyan/magenta, cyberpunk | Dark `#0a0a0f` / cyan `#00e5ff` |
| 7 | **Mono** | Pure B&W, editorial magazine, dramatic contrast | Black `#000` / white `#fff` |
| 8 | **Ocean** | Deep navy gradient, teal accents, calm & confident | Navy `#0c1f3f` / teal `#0ea5a0` |
| 9 | **Sunset** | Coral-to-violet gradient, warm & vibrant | Coral `#f97068` → violet `#7c3aed` |

### Template Resolution (priority order)

1. **Per-invoice override** — set when creating or editing an invoice
2. **Per-client override** — set on the client's profile, applies to all their invoices
3. **Profile default** — set in Settings, applies globally
4. **Fallback** — `classic` if nothing is configured

### Template Picker

- Visual grid of all 9 templates with mini color previews
- Active template highlighted with checkmark and primary ring
- Tags on each card (e.g. "professional", "dark", "gradient")
- **👁 Preview button** — opens a large dialog showing the full template rendered with realistic demo data (a fictional design agency billing a fictional corporation)
- Preview dialog does NOT select the template (events fully isolated)
- "Reset to default" link when an override is active
- Available on: Settings, New Invoice, Edit Invoice, Edit Client

## PDF / Print

- **Print / Save PDF** button on every invoice (detail view + public view)
- Opens a new print-ready window with the selected template rendered as full HTML
- Google Fonts loaded for template-specific typography
- Template-aware: prints using whichever of the 9 templates is selected
- Print dialog tip banner (set margins to None, uncheck headers/footers)
- Uses `window.print()` — works with browser's native Save as PDF

## Public Invoice Links

- Every invoice gets a unique UUID-based public token on creation
- **Public URL**: `/i/{token}` — viewable by anyone without authentication
- Sticky top bar with invoice number, status dot, and Print/PDF button
- Full template rendering (uses resolved template from invoice → client → profile)
- "Powered by Invoice" footer
- No sensitive data exposed (no user IDs, no edit capabilities)
- Copy Link button on invoice detail page

## Business Profile & Settings

### Profile Information

- Business name and email
- Phone number and website
- Tax ID / VAT number
- **Logo upload** — drag & drop or click to upload (PNG/JPG, max 5MB)
  - Stored in Convex file storage
  - Displayed on invoices and PDF output
  - Can be removed/replaced

### Address

- Street address, city, postal code, country
- Displayed on all invoice "From" sections

### Invoice Defaults

- **Default currency** — applied to new invoices (USD, EUR, GBP, CAD, AUD, JPY, CHF, INR)
- **Invoice prefix** — e.g. `INV-`, `PROJ-`, etc.
- **Payment terms** — default days until due (e.g. 30)
- **Default notes** — pre-filled on new invoices (e.g. "Thank you for your business!")

### Default Invoice Template

- Choose from all 9 templates with the visual picker
- Applies to all new invoices unless overridden per-client or per-invoice

### Payment Details

- Free-text field for bank info, PayPal, Stripe, etc.
- Pre-filled on new invoices and displayed on public invoice views
- Monospace formatting preserved

## UI & Design System

- **Dark mode** — full dark theme by default, toggleable light/dark via header button
- **Design tokens** — CSS variables for all colors, consistent across light/dark
- **Font** — Bricolage Grotesque (display + body), sharp and modern
- **No border radius** — all elements use sharp corners (`--radius: 0px`), except intentionally circular elements (status dots, avatars)
- **Animations** — entrance animations (`animate-in-up`, `animate-in-down`, `animate-in-scale`), staggered children, shimmer loading, pulse glow effects
- **Grain texture** — subtle SVG noise overlay for depth
- **Premium scrollbar** — thin, themed scrollbar across the app
- **Selection color** — primary-tinted text selection
- **Glass effects** — backdrop-blur glassmorphism utilities
- **Responsive** — mobile-friendly layout for all pages, collapsible navigation on small screens

### Component Library

Built on [Base UI](https://base-ui.com/) (unstyled primitives) + custom styling:

- Button (with `asChild` support for link composition)
- Card, CardHeader, CardContent, CardTitle, CardDescription
- Input, Textarea, Label
- Select (with search/filter)
- Dialog (with size variants: default, lg, xl, full)
- AlertDialog
- DropdownMenu
- Badge
- Separator
- Combobox
- Sonner (toast notifications)

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | TanStack Start (React 19, Vite, file-based routing) |
| **Backend** | Convex (real-time database, serverless functions) |
| **Auth** | Better Auth via `@convex-dev/better-auth` |
| **Styling** | Tailwind CSS v4 |
| **UI** | shadcn/ui + Base UI (unstyled) |
| **Forms** | TanStack Form |
| **Data** | TanStack Query + Convex React Query adapter |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Linting** | oxlint + oxfmt |
| **Types** | TypeScript 5 |
| **Deployment** | Cloudflare Workers (web) + Convex Cloud (backend) |

### Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User business profiles — name, logo, address, invoice defaults, default template |
| `clients` | Client directory — name, email, address, tax ID, notes, template override |
| `invoices` | Invoice records — client, dates, status, amounts, tax, discount, public token, template override |
| `lineItems` | Itemized line items per invoice — description, quantity, unit, rate, total, sort order |

All monetary values stored as **integers in cents** to avoid floating-point issues.

---

*Last updated: February 2026*

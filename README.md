<p align="center">
  <h1 align="center">Invoice</h1>
  <p align="center">
    Professional invoicing for freelancers — create, manage, and share invoices with ease.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#scripts">Scripts</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#license">License</a>
</p>

---

## Features

- **Invoice Management** — Create, edit, duplicate, and delete invoices with auto-generated invoice numbers and real-time calculations
- **Client Management** — Maintain a directory of clients with contact details, addresses, and internal notes
- **Line Items** — Add itemized line items with quantity, unit type (hours/days/items/project), rate, and auto-calculated totals
- **Tax & Discounts** — Apply tax percentages and discounts (fixed or percentage) with automatic subtotal/total calculations
- **PDF Generation** — Download professional PDF invoices directly from the browser using `@react-pdf/renderer`
- **Shareable Invoice Links** — Generate unique public URLs so clients can view invoices without logging in
- **Status Workflow** — Track invoices through Draft → Sent → Paid/Overdue with automatic overdue detection
- **Dashboard** — At-a-glance overview of outstanding revenue, monthly earnings, overdue count, and recent activity
- **Business Profile** — Configure your brand name, logo, address, default currency, invoice prefix, payment terms, and payment details
- **20 Currencies Supported** — USD, EUR, GBP, JPY, AUD, CAD, CHF, INR, BRL, AED, SAR, and more
- **Dark Mode** — Ships with a polished dark theme by default
- **Real-time** — Powered by Convex for instant data sync across tabs and devices

## Tech Stack

| Layer             | Technology                                                                        |
| ----------------- | --------------------------------------------------------------------------------- |
| **Framework**     | [TanStack Start](https://tanstack.com/start) (React 19, Vite, file-based routing) |
| **Backend**       | [Convex](https://convex.dev) (real-time database & serverless functions)          |
| **Auth**          | [Better Auth](https://www.better-auth.com/) via `@convex-dev/better-auth`         |
| **Styling**       | [Tailwind CSS v4](https://tailwindcss.com/)                                       |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/)             |
| **Forms**         | [TanStack Form](https://tanstack.com/form)                                        |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) + Convex React Query adapter         |
| **PDF**           | [@react-pdf/renderer](https://react-pdf.org/) (client-side)                       |
| **Monorepo**      | [Turborepo](https://turbo.build/) + [pnpm](https://pnpm.io/) workspaces           |
| **Linting**       | [oxlint](https://oxc.rs/) + [oxfmt](https://oxc.rs/)                              |
| **Language**      | TypeScript 5                                                                      |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 10

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/invoice.git
cd invoice

# Install dependencies
pnpm install
```

### Convex Setup

The backend runs on [Convex](https://convex.dev). Run the setup command to create a project and configure environment variables:

```bash
pnpm run dev:setup
```

This will walk you through creating a Convex project and generate `packages/backend/.env.local` with your deployment URL.

Copy the Convex URL into your web app env files:

```bash
# apps/web/.env.local
VITE_CONVEX_URL=<your-convex-url>          # WebSocket endpoint
VITE_CONVEX_SITE_URL=<your-convex-site-url> # HTTP endpoint (for auth)
```

Set the required Convex environment variables:

```bash
npx convex env set SITE_URL http://localhost:3001
npx convex env set BETTER_AUTH_SECRET <your-secret>
```

### Development

```bash
# Start everything (frontend + Convex backend)
pnpm run dev
```

The app will be available at [http://localhost:3001](http://localhost:3001).

## Project Structure

```
invoice/
├── apps/
│   └── web/                          # TanStack Start frontend
│       ├── src/
│       │   ├── components/           # React components
│       │   │   ├── pdf/              # PDF template & download button
│       │   │   ├── header.tsx        # App header/navigation
│       │   │   ├── protected-route.tsx
│       │   │   ├── sign-in-form.tsx
│       │   │   └── sign-up-form.tsx
│       │   ├── lib/                  # Auth client, utilities
│       │   └── routes/               # File-based routes
│       │       ├── dashboard.tsx     # Dashboard with stats
│       │       ├── invoices/         # Invoice CRUD routes
│       │       ├── clients/          # Client CRUD routes
│       │       ├── settings.tsx      # Business profile settings
│       │       ├── i/$token.tsx      # Public invoice view
│       │       ├── login.tsx
│       │       └── signup.tsx
│       └── vite.config.ts
├── packages/
│   ├── backend/                      # Convex backend
│   │   └── convex/
│   │       ├── schema.ts            # Database schema
│   │       ├── invoices.ts          # Invoice functions
│   │       ├── clients.ts           # Client functions
│   │       ├── lineItems.ts         # Line item functions
│   │       ├── profiles.ts          # User profile functions
│   │       ├── dashboard.ts         # Dashboard queries
│   │       └── auth.ts             # Auth configuration
│   ├── ui/                           # Shared UI component library
│   │   └── src/components/          # Button, Card, Input, Select, etc.
│   ├── env/                          # Type-safe environment variables
│   └── config/                       # Shared TypeScript configs
├── turbo.json                        # Turborepo pipeline config
├── pnpm-workspace.yaml              # Workspace configuration
└── package.json
```

## Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm dev`         | Start all apps and backend in development mode   |
| `pnpm build`       | Build all packages and apps for production       |
| `pnpm dev:web`     | Start only the web frontend                      |
| `pnpm dev:server`  | Start only the Convex backend                    |
| `pnpm dev:setup`   | Initialize and configure Convex project          |
| `pnpm check-types` | Run TypeScript type checking across all packages |
| `pnpm check`       | Run oxlint and oxfmt (lint + format)             |

## Environment Variables

### Web App (`apps/web/.env.local`)

| Variable               | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `VITE_CONVEX_URL`      | Convex WebSocket endpoint (e.g., `http://127.0.0.1:3210`)     |
| `VITE_CONVEX_SITE_URL` | Convex HTTP endpoint for auth (e.g., `http://127.0.0.1:3211`) |

### Convex Environment (set via `npx convex env set`)

| Variable             | Description                                  |
| -------------------- | -------------------------------------------- |
| `SITE_URL`           | Your app URL (e.g., `http://localhost:3001`) |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth session signing   |

## Database Schema

The app uses four core tables in Convex:

- **`profiles`** — User business profiles (name, logo, address, invoice defaults, payment details)
- **`clients`** — Client directory (name, email, address, tax ID, notes)
- **`invoices`** — Invoice records (client, dates, status, amounts, tax, discount, public token)
- **`lineItems`** — Itemized line items per invoice (description, quantity, unit, rate, total)

All monetary values are stored as **integers in cents** to avoid floating-point precision issues.

## Invoice Status Flow

```
┌───────┐     mark sent     ┌──────┐     mark paid     ┌──────┐
│ Draft │ ──────────────── → │ Sent │ ──────────────── → │ Paid │
└───────┘                    └──────┘                    └──────┘
                                │                           ↑
                                │  past due date            │
                                ▼                           │
                           ┌─────────┐    mark paid         │
                           │ Overdue │ ─────────────────────┘
                           └─────────┘
```

- Only **Draft** invoices can be edited or deleted
- **Overdue** status is automatically applied when the due date passes
- **Paid** is a terminal state

## License

This project is private and not licensed for public use.

---

<p align="center">
  Built with <a href="https://github.com/AmanVarshney01/create-better-t-stack">Better-T-Stack</a>
</p>

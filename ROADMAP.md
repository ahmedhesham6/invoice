# Invoice — Product Roadmap & Market Strategy

> Last updated: February 6, 2026
> Status: Open source — all features ship for everyone, forever

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Current State Audit](#current-state-audit)
- [Competitive Landscape](#competitive-landscape)
- [Open Source Positioning & Monetization](#open-source-positioning--monetization)
- [Feature Prioritization Framework](#feature-prioritization-framework)
- [Phase 1 — Foundation Fixes (Week 1)](#phase-1--foundation-fixes-week-1)
- [Phase 2 — Payment Collection (Weeks 2–3)](#phase-2--payment-collection-weeks-23)
- [Phase 3 — Email & Automation (Weeks 4–5)](#phase-3--email--automation-weeks-45)
- [Phase 4 — Workflow Completeness (Weeks 6–8)](#phase-4--workflow-completeness-weeks-68)
- [Phase 5 — Growth & Expansion (Months 3–6)](#phase-5--growth--expansion-months-36)
- [Phase 6 — Platform Play (Months 6+)](#phase-6--platform-play-months-6)
- [Features NOT Building (& Why)](#features-not-building--why)
- [Technical Implementation Notes](#technical-implementation-notes)
- [Success Metrics](#success-metrics)
- [SEO & Distribution Notes](#seo--distribution-notes)

---

## Executive Summary

Invoice is a fully open-source invoicing platform for freelancers. Every feature ships for everyone — cloud users and self-hosters alike. No feature gating, no artificial limits, no "upgrade to Pro" walls.

**What's built:** 9 invoice templates, PDF export, shareable links, client management, multi-currency, auto-overdue detection, business profiles with logo upload, and a polished landing page with comprehensive SEO.

**What's missing:** The features that make freelancers _rely_ on an invoicing tool daily — online payments, email delivery, automated reminders, recurring invoices, and estimates. Without these, Invoice is a pretty PDF generator. With them, it's a complete invoicing workflow.

**The strategy:** Ship everything open source. Monetize through hosted convenience (cloud hosting at $5/mo) and/or a small cut on payment processing. The open-source completeness IS the competitive advantage — no other open-source invoicing tool matches Invoice Ninja's feature set with a modern stack. We will.

**Target timeline:** 8 weeks to a feature-complete open-source invoicing platform.

---

## Current State Audit

### ✅ What's Built & Working

| Feature                     | Status      | Notes                                                      |
| --------------------------- | ----------- | ---------------------------------------------------------- |
| Auth (email/password)       | ✅ Complete | Better Auth + Convex, server-side sessions                 |
| Dashboard                   | ✅ Complete | 5 stat cards, recent invoices, status breakdown            |
| Invoice CRUD                | ✅ Complete | Create, edit (draft only), delete, duplicate               |
| Invoice status workflow     | ✅ Complete | Draft → Sent → Paid/Overdue                                |
| Client management           | ✅ Complete | CRUD, per-client template override                         |
| 9 invoice templates         | ✅ Complete | Visual picker, preview dialog, template resolution chain   |
| PDF/Print export            | ✅ Complete | Browser-based via `window.print()` + `@react-pdf/renderer` |
| Public invoice links        | ✅ Complete | `/i/{token}`, no auth required                             |
| Business profile & settings | ✅ Complete | Logo upload, address, defaults, payment details            |
| Multi-currency              | ✅ Complete | 8 currencies (USD, EUR, GBP, CAD, AUD, JPY, CHF, INR)      |
| Tax & discount calculations | ✅ Complete | Percentage tax, percentage/fixed discount                  |
| Landing page + SEO          | ✅ Complete | JSON-LD, Open Graph, sitemap, robots.txt, FAQ schema       |

### ❌ What's Missing

| Feature                | Current State                  | Impact                                                      |
| ---------------------- | ------------------------------ | ----------------------------------------------------------- |
| Auto-overdue detection | ⚠️ Only runs on dashboard load | Invoices sit un-marked for weeks if user doesn't log in     |
| Data export            | ❌ Missing                     | Landing page promises "no vendor lock-in" — currently a lie |
| Online payments        | ❌ Missing                     | No "Pay Now" button on public invoices                      |
| Email delivery         | ❌ Missing                     | Users must copy/paste links manually                        |
| Automated reminders    | ❌ Missing                     | Landing page claims "Auto Reminders" — doesn't exist        |
| Recurring invoices     | ❌ Missing                     | No schema support, no automation                            |
| Estimates/quotes       | ❌ Missing                     | No estimate entity or workflow                              |
| Expense tracking       | ❌ Missing                     | Not in schema                                               |
| Reporting              | ❌ Minimal                     | Basic dashboard stats only                                  |
| Client archive         | ❌ Missing                     | Can't delete or hide clients with invoices                  |
| Per-client currency    | ❌ Missing                     | Must set currency manually per invoice                      |
| Data import            | ❌ Missing                     | No way to migrate from other tools                          |
| Partial payments       | ❌ Missing                     | All-or-nothing payments only                                |

### Known UX Gaps

1. **Client with invoices can't be deleted or hidden** — users hit this within the first week
2. **Overdue detection is unreliable** — only triggers on dashboard load
3. **No per-client currency default** — friction for freelancers with international clients
4. **No "Send Reminder" button** — overdue invoices have no action path
5. **Landing page claims "Auto Reminders" in features section** — misleading, doesn't exist yet

---

## Competitive Landscape

### Direct Competitors — Freelancer Invoicing Tools

| Tool                 | Pricing                 | Payments                | Recurring | Estimates    | Expenses | Reminders | Open Source |
| -------------------- | ----------------------- | ----------------------- | --------- | ------------ | -------- | --------- | ----------- |
| **FreshBooks**       | $17–55/mo               | ✅ Stripe, PayPal, bank | ✅        | ✅           | ✅       | ✅ Auto   | ❌          |
| **Wave**             | Free (2.9% on payments) | ✅ Stripe, bank         | ✅        | ✅           | ✅       | ✅ Auto   | ❌          |
| **Invoice Ninja**    | Free / $10/mo Pro       | ✅ Stripe, PayPal, 15+  | ✅        | ✅ Proposals | ✅       | ✅ Auto   | ✅          |
| **Zoho Invoice**     | Free (≤5 clients)       | ✅ Stripe, PayPal       | ✅        | ✅           | ❌       | ✅ Auto   | ❌          |
| **Bonsai**           | $21–52/mo               | ✅ Stripe, PayPal       | ✅        | ✅ Proposals | ✅       | ✅ Auto   | ❌          |
| **HoneyBook**        | $16–66/mo               | ✅ Built-in             | ✅        | ✅           | ❌       | ✅ Auto   | ❌          |
| **Hiveage**          | Free / $16/mo           | ✅ Stripe, PayPal       | ✅        | ✅           | ✅       | ✅ Auto   | ❌          |
| **Stripe Invoicing** | 0.4%/invoice            | ✅ Native               | ✅        | ❌           | ❌       | ✅ Auto   | ❌          |
| **PayPal Invoicing** | Free (2.99% on pay)     | ✅ Native               | ✅        | ❌           | ❌       | ✅ Auto   | ❌          |
| **AND CO / Fiverr**  | Free                    | ✅ Stripe, PayPal       | ✅        | ✅ Proposals | ✅       | ✅ Auto   | ❌          |
| **Invoice (us)**     | Free / $5/mo cloud      | ❌                      | ❌        | ❌           | ❌       | ❌        | ✅          |

### Key Competitive Insights

1. **Online payments are universal.** Every single competitor offers them. A "Pay Now" button on `/i/{token}` is not a premium feature — it's the baseline. Without it, Invoice feels like a PDF generator, not an invoicing tool.

2. **Automated reminders reduce late payments by 30–50%.** FreshBooks reports auto-reminders cut average payment time from 21 days to 14 days. Zoho claims 47% fewer overdue invoices. Every competitor has this. Our landing page falsely claims we do too.

3. **Recurring invoices are the #2 retention driver.** 62% of freelancers have at least one recurring client (Payoneer 2025 Freelancer Report). FreshBooks lists recurring invoices as their second most-used feature after invoice creation.

4. **Estimates → Invoice conversion is a workflow differentiator.** 80% of freelancers do project-based work. The workflow is: estimate → client approval → invoice. One-click conversion eliminates double data entry.

5. **Email delivery is table stakes.** "Copy this link and paste it in Gmail" is a dealbreaker. Every competitor sends branded emails with payment links and PDF attachments.

6. **Invoice Ninja is the real benchmark.** As the only other serious open-source invoicing tool, Invoice Ninja defines what "open source invoicing" means. Their free tier includes payments, recurring invoices, proposals, expenses, and a client portal. We need to match and exceed this with a better DX, modern stack, and superior design.

7. **Wave proved "free tool + payment processing fees" works.** Wave is 100% free and makes money on payment processing (2.9% + $0.60 per transaction). Acquired by H&R Block for over $400M. This model aligns perfectly with open source.

### What Every Competitor Has That We Don't (Yet)

| Capability                  | Who Has It                                               | Our Priority     |
| --------------------------- | -------------------------------------------------------- | ---------------- |
| Online payment collection   | Everyone                                                 | Phase 2 — Week 2 |
| Email invoice delivery      | Everyone                                                 | Phase 3 — Week 4 |
| Automated overdue reminders | Everyone                                                 | Phase 3 — Week 5 |
| Recurring invoices          | FreshBooks, Wave, Invoice Ninja, Zoho, Bonsai, HoneyBook | Phase 4 — Week 6 |
| Estimates/quotes            | FreshBooks, Invoice Ninja, Bonsai, HoneyBook             | Phase 4 — Week 7 |
| Expense tracking            | FreshBooks, Wave, Invoice Ninja, Bonsai                  | Phase 4 — Week 8 |
| Revenue/aging reports       | FreshBooks, Wave, Zoho, Invoice Ninja                    | Phase 4 — Week 8 |
| Data export                 | Wave, Invoice Ninja, FreshBooks                          | Phase 1 — Week 1 |

---

## Open Source Positioning & Monetization

### Philosophy

> **Every feature ships open source. No feature gating. No "Pro-only" walls. Self-hosters get the full product, forever.**

This is the competitive moat. FreshBooks charges $17/mo for features we give away. Invoice Ninja gates automation and reminders behind their $10/mo Pro tier. We don't. The open-source completeness and modern developer experience is what makes Invoice worth choosing.

### Positioning

> **Invoice is the most complete open-source invoicing platform — built with a modern stack, designed for solo freelancers, and free forever. Self-host it or let us host it.**

### How We Make Money

Since all features are open source, revenue comes from **convenience, not lock-in**:

#### Model 1: Managed Cloud Hosting ($5/mo)

|                         | Self-Hosted               | Cloud ($5/mo)          |
| ----------------------- | ------------------------- | ---------------------- |
| All features            | ✅                        | ✅                     |
| You manage infra        | ✅ You                    | ✅ We handle it        |
| Automatic updates       | ❌ Manual                 | ✅ Automatic           |
| Backups                 | ❌ Your responsibility    | ✅ Daily automated     |
| Custom domain           | ✅                        | ✅                     |
| Uptime SLA              | ❌                        | ✅ 99.9%               |
| Email delivery (Resend) | ❌ Bring your own API key | ✅ Included            |
| Support                 | Community (GitHub Issues) | Priority email support |

**Why this works:**

- Most freelancers don't want to manage servers — $5/mo is cheaper than their time
- Self-hosters are power users who contribute back (bug reports, PRs, docs)
- $5/mo is impulse pricing — cheaper than every hosted competitor
- No resentment — self-hosters aren't second-class citizens, they have the same product

#### Model 2: Payment Processing Fee (Wave Model)

- Tool is 100% free for everyone (cloud + self-hosted)
- When clients pay invoices via Stripe through our cloud platform, we add a small platform fee (e.g., 0.5–1%) on top of Stripe's standard 2.9% + $0.30
- Self-hosters connect their own Stripe account directly — no platform fee
- Revenue scales with user success: we only earn when freelancers get paid

**Why this works:**

- Perfectly aligned incentives — we make money only when users make money
- No upfront cost barrier — easier to acquire users
- Wave built a $400M+ company on this exact model
- Self-hosters aren't affected — they keep 100% (minus standard Stripe fees)

#### Model 3: Hybrid (Recommended)

- **Cloud free tier:** All features, limited to 10 invoices/month, 5 clients
- **Cloud paid tier ($5/mo):** Unlimited everything, priority support, included email delivery
- **Self-hosted:** Unlimited everything, bring your own API keys, community support
- **Payment processing fee:** Optional 0.5% platform fee on cloud (waived for paid tier)

**This is the recommended model** because it:

- Keeps the open-source promise intact (self-host = full product)
- Gives a free entry point for cloud users (try before you buy)
- Creates a clear reason to pay ($5/mo removes limits + included email infra)
- Generates payment processing revenue that scales with GMV
- Doesn't punish self-hosters

### Competitive Pricing Comparison

| Tool                      | Price for Unlimited Invoices + Payments + Reminders |
| ------------------------- | --------------------------------------------------- |
| FreshBooks                | $17/mo (minimum)                                    |
| Bonsai                    | $21/mo (minimum)                                    |
| HoneyBook                 | $16/mo (minimum)                                    |
| Invoice Ninja Pro         | $10/mo                                              |
| Zoho Invoice              | Free (≤5 clients), then $9/mo                       |
| Wave                      | Free (2.9% + $0.60 per payment)                     |
| **Invoice (cloud)**       | **$5/mo** (all features)                            |
| **Invoice (self-hosted)** | **$0** (all features, forever)                      |

At $5/mo for the hosted version — with all features included and no feature gating — Invoice is the cheapest hosted invoicing solution with online payments, and the only one where you can walk away with the full codebase at any time.

---

## Feature Prioritization Framework

Every feature is scored on four dimensions:

| Dimension                | Weight | Question                                                 |
| ------------------------ | ------ | -------------------------------------------------------- |
| **Product Completeness** | 35%    | Does this close a critical gap vs. competitors?          |
| **User Value**           | 30%    | How much time/friction does this save freelancers daily? |
| **Retention Impact**     | 20%    | Does this keep users coming back weekly?                 |
| **Build Effort**         | 15%    | Can we ship it quickly with Convex + TanStack Start?     |

### Scored Feature Matrix

| #   | Feature                     | Completeness | User Value | Retention | Effort (inverse) | **Score** | **Phase** |
| --- | --------------------------- | ------------ | ---------- | --------- | ---------------- | --------- | --------- |
| 1   | Stripe Payment Integration  | 10           | 10         | 8         | 5                | **8.85**  | **2**     |
| 3b  | Automated Email Reminders   | 9            | 9          | 8         | 6                | **8.35**  | **3**     |
| 4   | Recurring Invoices          | 9            | 9          | 10        | 4                | **8.35**  | **4**     |
| 2   | Email Delivery (Resend)     | 9            | 9          | 7         | 7                | **8.30**  | **3**     |
| 5   | Estimates / Quotes          | 8            | 8          | 8         | 5                | **7.55**  | **4**     |
| 7   | Reporting Improvements      | 7            | 7          | 7         | 6                | **6.90**  | **4**     |
| 6   | Expense Tracking            | 6            | 6          | 9         | 4                | **6.35**  | **4**     |
| 3a  | Overdue Cron Job            | 7            | 6          | 6         | 10               | **6.85**  | **1**     |
| 10  | PayPal Integration          | 6            | 6          | 5         | 4                | **5.55**  | **5**     |
| 18  | Partial Payments            | 5            | 5          | 5         | 4                | **4.85**  | **5**     |
| 9   | Data Export (JSON + CSV)    | 5            | 4          | 3         | 9                | **4.70**  | **1**     |
| 11  | Client Portal               | 5            | 5          | 6         | 3                | **4.95**  | **6**     |
| 8   | Data Import (CSV)           | 4            | 5          | 4         | 4                | **4.25**  | **5**     |
| 16  | Client Archive              | 3            | 5          | 5         | 9                | **4.70**  | **1**     |
| 17  | Per-Client Currency Default | 3            | 4          | 4         | 9                | **4.20**  | **1**     |
| 12  | Multi-language Invoices     | 4            | 4          | 5         | 5                | **4.35**  | **6**     |
| 13  | Webhook Support             | 3            | 3          | 3         | 7                | **3.50**  | **6**     |
| 14  | Zapier Integration          | 3            | 3          | 4         | 3                | **3.25**  | **6**     |
| 15  | 2FA (TOTP)                  | 3            | 2          | 2         | 6                | **2.85**  | **6**     |

---

## Phase 1 — Foundation Fixes (Week 1)

**Goal:** Fix credibility issues and UX papercuts before building the big features. These are quick wins that unblock everything else.

### 1.1 Data Export (JSON + CSV)

**Why now:** The landing page promises "no vendor lock-in" and "own your data forever." Without export, that's broken trust. For an open-source project, data portability isn't a nice-to-have — it's a core principle.

**Scope:**

- New Convex query: `export.fullExport` — returns all user data (profile, clients, invoices + line items)
- Settings page: "Export Data" section with two buttons
  - **Export JSON** — full structured data dump, single file
  - **Export CSV** — separate CSV files for invoices, clients, line items (zipped)
- Include all fields, human-readable dates, amounts in dollars (not cents)
- No pagination needed at this scale (freelancers have <500 invoices typically)

**Effort:** ~3–4 hours

### 1.2 Overdue Cron Job

**Why now:** Current auto-overdue detection only runs when the user opens the dashboard. Invoices can sit in "sent" status for weeks after their due date. For an open-source tool that people will self-host, this must work without user interaction.

**Scope:**

- New file: `packages/backend/convex/crons.ts`
- Convex cron job: runs every hour
- Internal mutation: queries ALL sent invoices across all users where `dueDate < Date.now()`
- Patches matching invoices to `status: 'overdue'`
- No auth required (internal function)
- Keep the existing dashboard-load check as a fallback

**Effort:** ~1 hour

### 1.3 Client Archive

**Why now:** The app throws an error when you try to delete a client with invoices. Users hit this within the first week. Archive is the correct pattern — hide from active use, preserve for historical records.

**Scope:**

- Schema: add `archived: v.optional(v.boolean())` to `clients` table
- `clients.list` — filter out archived by default, add `includeArchived` arg
- New mutations: `clients.archive` and `clients.unarchive`
- Client list UI: "Archived" tab or toggle, archive button in dropdown menu
- Archived clients still appear on existing invoices (read-only)
- Archived clients hidden from "Select Client" dropdown on new invoice form
- Bulk archive option for cleaning up old clients

**Effort:** ~2–3 hours

### 1.4 Per-Client Currency Default

**Why now:** Quick win that eliminates daily friction for freelancers billing international clients. We already have multi-currency — this just saves the preference.

**Scope:**

- Schema: add `defaultCurrency: v.optional(v.string())` to `clients` table
- Client create/edit form: currency selector (reuse from invoice form)
- New invoice form: when client is selected, pre-fill currency from `client.defaultCurrency ?? profile.defaultCurrency`

**Effort:** ~1–2 hours

### Phase 1 Total: ~1 week

---

## Phase 2 — Payment Collection (Weeks 2–3)

**Goal:** Add a "Pay Now" button to public invoices. This single feature transforms Invoice from a static document viewer into a complete payment tool.

### 2.1 Stripe Payment Integration

**Why this is the #1 feature:** Every competitor has online payments. Without a "Pay Now" button on `/i/{token}`, the public invoice page is just a pretty picture. With it, the entire invoicing loop closes: create → send → collect → reconcile — all automated.

**The freelancer's current workflow without this:**

1. Create invoice in Invoice
2. Copy the link, paste it in Gmail
3. Client views invoice, sees bank details, maybe pays eventually
4. Freelancer checks bank manually, comes back to Invoice, clicks "Mark as Paid"

**The workflow WITH Stripe:**

1. Create invoice in Invoice
2. Share link (or email — Phase 3)
3. Client clicks "Pay Now" on the invoice page
4. Stripe Checkout handles the payment
5. Webhook fires → invoice auto-marked as paid
6. Client gets a receipt, freelancer gets the money. Done.

**Architecture: Stripe Connect Express**

```
Freelancer                    Invoice (platform)              Client
     │                              │                              │
     │  1. Connect Stripe ─────────►│                              │
     │     (OAuth Express)           │                              │
     │◄──── stripeAccountId ────────│                              │
     │                              │                              │
     │  2. Create invoice ─────────►│                              │
     │                              │  3. Share link ─────────────►│
     │                              │                              │
     │                              │◄─── 4. "Pay Now" click ─────│
     │                              │                              │
     │                              │  5. Checkout Session ───────►│
     │                              │     (on freelancer's          │
     │                              │      connected account)       │
     │                              │                              │
     │   Money goes directly  ◄─────│◄─── 6. Payment complete ────│
     │   to freelancer's Stripe     │      (webhook → mark paid)   │
```

**Why Connect Express:**

- Payments go directly to the freelancer's Stripe account — we never hold funds
- Express accounts handle disputes, refunds, and compliance on the freelancer's side
- Simplest integration path, least regulatory burden for us
- We can optionally add a small platform fee (for cloud monetization — see Monetization section)
- Self-hosters connect their own Stripe account directly with zero platform fee

**Scope:**

#### Schema Changes

```
profiles: add
  - stripeAccountId: v.optional(v.string())     // Stripe Connect account ID
  - stripeOnboardingComplete: v.optional(v.boolean())

invoices: add
  - stripePaymentIntentId: v.optional(v.string())
  - stripeCheckoutSessionId: v.optional(v.string())
  - paymentMethod: v.optional(v.string())        // "stripe", "manual", "paypal" (future)
```

#### Backend (Convex)

```
New file: stripe.ts
  Mutations:
  - connectStripe() — initiates Stripe Connect OAuth, returns onboarding URL
  - handleConnectCallback(code) — exchanges OAuth code for account ID
  - disconnectStripe() — removes Stripe connection
  - getStripeStatus() — returns connection state

  Actions (external API calls):
  - createCheckoutSession(invoiceId) — creates Stripe Checkout on connected account
  - handleWebhook(payload, signature) — processes Stripe events:
      • checkout.session.completed → mark invoice as paid, record payment details
      • payment_intent.payment_failed → log failure
      • account.updated → update onboarding status

HTTP routes (http.ts additions):
  - POST /stripe/webhook — Stripe webhook endpoint (signature verification)
  - GET /stripe/connect/callback — OAuth return URL
```

#### Frontend

- **Settings page:** "Payments" section
  - "Connect Stripe" button → redirects to Stripe Connect onboarding
  - Connected state: shows Stripe account email, green badge, disconnect option
  - Stripe onboarding incomplete state: "Complete setup" link

- **Public invoice page (`/i/{token}`):**
  - "Pay Now" button (prominent, primary color)
  - Only visible when: freelancer has Stripe connected AND invoice status is sent/overdue
  - Click → redirects to Stripe Checkout (Stripe-hosted page)
  - Success → redirect back to `/i/{token}?status=success` → shows animated payment confirmation
  - Cancel → redirect back to `/i/{token}` with no changes

- **Invoice detail page (authenticated):**
  - "Payment received via Stripe" badge when auto-reconciled
  - Payment details: amount, date, Stripe payment ID
  - For invoices without Stripe: "Mark as Paid" button still works (manual reconciliation)

**Effort:** ~5–6 days

### Phase 2 Total: ~2 weeks

---

## Phase 3 — Email & Automation (Weeks 4–5)

**Goal:** Complete the automated invoice lifecycle. After this phase, the full flow works end-to-end: create → email to client → client pays via Stripe → auto-marked paid → receipt sent. If overdue → auto-reminders at configurable intervals.

### 3.1 Email Delivery via Resend

**Why Resend:**

- Modern API with excellent DX
- React Email for building templates in JSX (matches our stack)
- Generous free tier (100 emails/day — enough for most freelancers)
- $20/mo for 50K emails if needed at scale
- Great deliverability out of the box
- Self-hosters can plug in their own Resend API key (or swap for any SMTP provider)

**Email Templates (React Email):**

1. **Invoice delivery email**
   - From: freelancer's business name (via configured domain)
   - To: client email address
   - Subject: `Invoice {INV-001} from {Business Name} — ${amount} due {date}`
   - Body: branded HTML email with:
     - Business logo (if uploaded)
     - Invoice summary (number, amount, due date, line item count)
     - "View Invoice" button → `/i/{token}`
     - "Pay Now" button → Stripe Checkout URL (if Stripe connected)
     - Payment details text (bank info, as fallback)
     - Personal message (optional, added by freelancer when sending)
   - Attachment: PDF of the invoice (generated via `@react-pdf/renderer`)

2. **Payment receipt email**
   - Auto-sent when Stripe payment succeeds (via webhook)
   - To: client email
   - Subject: `Payment received — Invoice {INV-001} from {Business Name}`
   - Body: payment confirmation with amount, date, link to invoice

3. **Overdue reminder email** (see 3.2 below)

**Scope:**

#### New Monorepo Package

```
packages/email/
  - src/templates/invoice-delivery.tsx    (React Email template)
  - src/templates/payment-receipt.tsx
  - src/templates/overdue-reminder.tsx
  - src/lib/send.ts                       (Resend API wrapper)
  - package.json
```

#### Backend (Convex)

```
New file: email.ts
  Actions (external — calls Resend API):
  - sendInvoiceEmail(invoiceId, personalMessage?) — sends delivery email
  - sendReminderEmail(invoiceId, reminderNumber) — sends reminder
  - sendPaymentReceiptEmail(invoiceId) — sends receipt

  Mutations:
  - recordEmailSent(invoiceId, type, recipientEmail) — logs email in DB

Schema changes:
  invoices: add
  - emailSentAt: v.optional(v.number())       // when invoice email was sent
  - emailSentTo: v.optional(v.string())        // recipient email

  New table: emailLog
  - invoiceId, type (delivery|reminder|receipt), sentAt, recipientEmail, status
```

#### Frontend

- **Invoice detail page:**
  - "Send Invoice" button replaces current "Mark as Sent"
  - Opens dialog: shows recipient (client email), optional personal message textarea
  - "Send" → calls `email.sendInvoiceEmail` + marks invoice as sent
  - For already-sent invoices: "Resend" button
  - Email history: expandable section showing all sent emails with timestamps

- **Overdue invoices:**
  - "Send Reminder" button (manual, sends immediately)

- **Settings page:**
  - "Email" section: reply-to address, default personal message template
  - For self-hosters: Resend API key input field

**Effort:** ~4–5 days

### 3.2 Automated Overdue Reminders

**Why:** FreshBooks data shows auto-reminders cut average payment time from 21 days to 14 days. This is consistently cited as a top-3 reason freelancers pay for invoicing tools. We're shipping it free.

**Default Reminder Schedule:**

- **Day 1 overdue** — Friendly: "Just a reminder — Invoice {INV-001} was due yesterday"
- **Day 7 overdue** — Firm: "Invoice {INV-001} is now 7 days past due"
- **Day 14 overdue** — Urgent: "Second reminder — Invoice {INV-001} is 14 days overdue"
- **Day 30 overdue** — Final: "Final notice — Invoice {INV-001} is 30 days past due"

Fully configurable per user. Can add/remove days, enable/disable entirely.

**Scope:**

#### Schema Changes

```
profiles: add
  - remindersEnabled: v.optional(v.boolean())         // default: true
  - reminderDays: v.optional(v.array(v.number()))     // default: [1, 7, 14, 30]

invoices: add
  - lastReminderSentAt: v.optional(v.number())
  - reminderCount: v.optional(v.number())              // how many reminders sent
```

#### Backend (Convex)

```
Extend crons.ts:
  - New cron: runs every 6 hours
  - For each user with remindersEnabled === true:
    - For each overdue invoice:
      - Calculate days overdue
      - Check if current day matches any reminderDays entry
      - Check if lastReminderSentAt was recent enough (don't double-send)
      - If due: schedule email.sendReminderEmail action
      - Update lastReminderSentAt + increment reminderCount
```

#### Frontend

- **Settings page:** "Reminders" section
  - Toggle: enable/disable automatic reminders
  - Day selector: checkboxes for common intervals [1, 3, 7, 14, 21, 30, 45, 60, 90]
  - Custom day input for non-standard intervals
  - Preview of reminder email copy

- **Invoice detail page:**
  - "Reminders" section showing history (dates, which reminder #)
  - Manual "Send Reminder Now" button (overrides schedule, sends immediately)
  - "Pause reminders for this invoice" toggle (for invoices in dispute, etc.)

**Effort:** ~3 days

### Phase 3 Total: ~1.5 weeks

---

## Phase 4 — Workflow Completeness (Weeks 6–8)

**Goal:** Ship the features that make freelancers _live_ in Invoice — recurring invoices for retainer clients, estimates for project-based work, expenses for tax tracking, and real reports.

### 4.1 Recurring Invoices

**Why:** 62% of freelancers have at least one recurring client (Payoneer 2025). Without recurring invoices, those freelancers spend 30+ minutes every month manually recreating the same invoices. This is the #2 retention feature after payments.

**Invoice Ninja gives this away free. FreshBooks charges $17/mo for it. We give it away free too.**

**Scope:**

#### Schema

```
New table: recurringInvoices
  - userId: v.string()
  - clientId: v.id('clients')
  - templateInvoiceId: v.id('invoices')          // source invoice for amounts/items
  - frequency: weekly | biweekly | monthly | quarterly | yearly
  - startDate: v.number()
  - nextRunDate: v.number()
  - endCondition: never | afterCount | onDate
  - endAfterCount: v.optional(v.number())
  - endOnDate: v.optional(v.number())
  - generatedCount: v.number()                    // how many invoices generated so far
  - status: active | paused | completed
  - autoSend: v.boolean()                         // true = send immediately, false = create as draft
  - createdAt, updatedAt

Invoices table: add
  - recurringInvoiceId: v.optional(v.id('recurringInvoices'))  // links back to schedule
```

#### Backend

```
New file: recurring.ts
  Mutations:
  - create(clientId, templateInvoiceId, frequency, startDate, endCondition, autoSend)
  - update(id, fields)
  - pause(id) / resume(id)
  - cancel(id) — sets status to completed
  - generateInvoice(recurringId) — creates invoice from template (internal)

  Queries:
  - list() — all recurring schedules for user
  - get(id) — detail with generated invoice history
  - upcoming() — next 5 scheduled generations across all schedules

Extend crons.ts:
  - New daily cron (6:00 AM UTC):
    - For each active recurring schedule where nextRunDate <= now:
      - Call generateInvoice(recurringId)
      - If autoSend: mark as sent + trigger email delivery
      - Calculate and set nextRunDate based on frequency
      - Increment generatedCount
      - Check end conditions (count reached? date passed?)
      - If ended: set status to completed
```

#### Frontend

- New route: `/recurring` — list of all recurring schedules
  - Shows: client name, frequency, next run date, status, generated count
  - Actions: pause, resume, cancel, edit
- Create flow: from any invoice detail page, "Make Recurring" button
  - Dialog: frequency selector, start date, end condition, auto-send toggle
- Dashboard widget: "Upcoming Recurring" — shows next 3 scheduled generations
- Invoice detail: "Generated from recurring schedule" badge with link to schedule
- Recurring detail page: list of all generated invoices with their statuses

**Effort:** ~5–6 days

### 4.2 Estimates / Quotes

**Why:** Project-based freelancers (designers, developers, consultants) need to quote before they invoice. Without estimates, they create quotes in Google Docs, get approval over email, then manually recreate everything in Invoice. One-click estimate → invoice conversion eliminates this entirely.

**Status workflow:**

```
Draft → Sent → Accepted → Converted to Invoice
                 ↓
              Declined
                 ↓
              Expired (auto, if expiry date passes)
```

**Scope:**

#### Schema

```
New table: estimates
  - Same fields as invoices: userId, clientId, lineItems (reference), dates, amounts, currency
  - Status: draft | sent | accepted | declined | expired | converted
  - expiresAt: v.optional(v.number())
  - convertedInvoiceId: v.optional(v.id('invoices'))
  - acceptedAt, declinedAt: v.optional(v.number())
  - publicToken: v.string()                        // for shareable estimate links
  - estimateNumber: v.string()                     // e.g., "EST-001"

New table: estimateLineItems
  - Same structure as lineItems, linked to estimateId

Profile: add
  - estimatePrefix: v.optional(v.string())         // default: "EST-"
  - nextEstimateNumber: v.optional(v.number())     // default: 1
```

#### Backend

```
New file: estimates.ts
  - Full CRUD: create, get, list, update, remove
  - send(id) — mark as sent, optionally send email
  - getByToken(token) — public query (no auth, like invoices.getByToken)
  - accept(token) — client accepts from public page (no auth required)
  - decline(token) — client declines from public page
  - convertToInvoice(id) — creates draft invoice from accepted estimate:
    - Copies all line items, amounts, client, currency, notes
    - Sets estimate status to "converted"
    - Links estimate.convertedInvoiceId to new invoice

Extend crons.ts:
  - Auto-expire: sent estimates past expiresAt → set status to "expired"
```

#### Frontend

- New routes: `/estimates`, `/estimates/new`, `/estimates/$id`, `/estimates/$id/edit`
- Reuse invoice form component — same line items UI, same template picker
- Public estimate page: `/e/{token}`
  - Client sees full estimate with "Accept" and "Decline" buttons
  - Accept → records acceptance, notifies freelancer
  - Decline → records decline with optional reason
- Estimate detail page:
  - "Convert to Invoice" button (one click, only on accepted estimates)
  - Status badge with color coding
- Navigation: add "Estimates" to sidebar between Invoices and Clients
- Dashboard: "Pending Estimates" stat (estimates sent but not yet accepted/declined)

**Effort:** ~4–5 days

### 4.3 Basic Expense Tracking

**Why:** Without expenses, users only open Invoice when they send a bill. With expenses, they're tracking costs weekly — dramatically better retention. Plus, come tax season, having income + expenses in one place is genuinely valuable.

**Keeping it simple:** This is NOT an accounting tool. No double-entry bookkeeping, no chart of accounts, no bank reconciliation. Just: "I spent $X on Y, here's the receipt."

**Scope:**

#### Schema

```
New table: expenses
  - userId: v.string()
  - clientId: v.optional(v.id('clients'))          // optional link to client
  - amount: v.number()                              // in cents
  - currency: v.string()
  - date: v.number()                                // expense date
  - category: v.string()                            // enum-like: software, hardware, travel, meals, office, marketing, professional_services, subscriptions, other
  - vendor: v.string()                              // who you paid
  - description: v.optional(v.string())
  - receiptId: v.optional(v.id('_storage'))         // receipt photo/PDF
  - createdAt, updatedAt
```

#### Backend

```
New file: expenses.ts
  - create, get, list (with date range + category + client filters), update, remove
  - generateReceiptUploadUrl() — for receipt upload
  - saveReceipt(expenseId, storageId)
  - summary(startDate, endDate) — totals by category
  - exportCSV(startDate, endDate) — for tax prep
```

#### Frontend

- New routes: `/expenses`, `/expenses/new`
- Expense list: table with date, vendor, category, amount, receipt icon
  - Filterable by date range, category, client
  - Sortable by date or amount
- Create form: amount, currency, date, category (dropdown), vendor, description, receipt upload (drag & drop)
- Receipt viewer: click receipt icon to view uploaded photo/PDF in dialog
- Dashboard: "Expenses This Month" stat card (or integrate into existing stats)
- Quick-add: floating "+" button on expenses page for rapid entry

**Effort:** ~3–4 days

### 4.4 Reporting Improvements

**Why:** Dashboard stats answer "what happened today." Reports answer "what happened this quarter, and what should I tell my accountant?" Freelancers need the latter for taxes, financial planning, and client profitability analysis.

**Scope:**

#### Reports Page (`/reports`)

1. **Revenue by Client**
   - Bar chart + table
   - Filterable by date range (this month, quarter, year, custom)
   - Shows: client name, invoices count, total billed, total paid, outstanding
   - Sorted by revenue (highest first)

2. **Revenue by Month**
   - Line chart showing monthly paid revenue over the past 12 months
   - Comparison with previous period (optional)

3. **Invoice Aging Report**
   - Outstanding invoices grouped by: current (not yet due), 1–30 days, 31–60 days, 61–90 days, 90+ days
   - Total amount in each bucket
   - Click into any bucket to see individual invoices

4. **Tax Summary**
   - Date range selector (month, quarter, year)
   - Total income (paid invoices)
   - Total expenses (from expense tracking)
   - Net profit (income − expenses)
   - Breakdown by category (expenses) and by client (income)
   - **Export as CSV** — one-click download for accountants
   - **Export as PDF** — formatted summary report

5. **All reports: CSV + PDF export buttons**

#### Backend

```
New file: reports.ts
  Queries:
  - revenueByClient(startDate, endDate) — aggregated revenue per client
  - revenueByMonth(year) — monthly totals for a given year
  - invoiceAging() — outstanding invoices grouped by age buckets
  - taxSummary(startDate, endDate) — income, expenses, net, by category
```

**Effort:** ~3–4 days

### Phase 4 Total: ~2.5 weeks

---

## Phase 5 — Growth & Expansion (Months 3–6)

Features that expand the addressable market and reduce barriers to switching.

### 5.1 PayPal Integration

**Why:** Stripe operates in 47 countries. PayPal operates in 200+. Many freelancers in Africa, Southeast Asia, Eastern Europe, and Latin America rely on PayPal as their primary payment method. Adding PayPal as a second payment option significantly expands our addressable market.

**Scope:**

- PayPal Checkout SDK integration on public invoice page
- Freelancer connects PayPal in Settings (OAuth)
- `/i/{token}` shows both: "Pay with Card" (Stripe) and "Pay with PayPal"
- PayPal webhook for auto-reconciliation
- Schema: add `paypalEmail` to profiles, `paypalOrderId` to invoices

**Effort:** ~4–5 days

### 5.2 Data Import (CSV + Platform Importers)

**Why:** Only matters once we have enough features to justify switching. Import removes the #1 barrier: "I have 3 years of invoices in FreshBooks, I can't re-enter them all."

**Scope:**

- **CSV import wizard:** upload → column mapping UI → preview → confirm → import
- **Pre-built importers for:**
  - Invoice Ninja (JSON export format)
  - FreshBooks (CSV export format)
  - Wave (CSV export format)
- Import targets: clients, invoices, line items
- Conflict handling: skip duplicates, update existing, or create new
- Import log: shows what was imported, skipped, or errored

**Effort:** ~5–6 days

### 5.3 Partial Payments

**Why:** Freelancers billing large projects ($5K–$50K) often work with clients who pay in installments — 50% upfront, 50% on delivery. Without partial payments, the only option is to create separate invoices for each installment, which breaks the audit trail.

**Scope:**

- Schema: add `amountPaid` and `amountDue` to invoices, new `payments` table for individual payment records
- Public invoice page: "Pay Custom Amount" option alongside "Pay Full Amount" in Stripe Checkout
- Invoice detail: payment history timeline showing each partial payment
- New status: `partially_paid` between sent and paid
- Auto-transition to `paid` when `amountPaid >= total`
- Remaining balance shown prominently on public invoice page

**Effort:** ~3–4 days

### 5.4 Expanded Currency Support

**Why:** Currently 8 currencies. README claims 20. Expanding to 20+ covers the long tail of freelancer markets.

**Add:** BRL (Brazilian Real), AED (UAE Dirham), SAR (Saudi Riyal), ZAR (South African Rand), MXN (Mexican Peso), SGD (Singapore Dollar), HKD (Hong Kong Dollar), SEK (Swedish Krona), NOK (Norwegian Krone), DKK (Danish Krone), PLN (Polish Zloty), TRY (Turkish Lira)

**Effort:** ~2 hours (add to currency arrays + formatters)

### Phase 5 Total: ~3–4 weeks

---

## Phase 6 — Platform Play (Months 6+)

Features that turn Invoice into a platform ecosystem.

### 6.1 Client Portal

Clients get their own dashboard showing all invoices from a freelancer + payment history. Access via magic link (email-based, no signup). Token-based auth tied to client email.

**Effort:** ~5–6 days

### 6.2 Multi-Language Invoices

Generate invoices and emails in the client's language. Priority languages: Spanish, French, German, Portuguese, Arabic, Japanese. Affects: invoice templates, email templates, public invoice page UI, and estimate pages.

**Effort:** ~4–5 days

### 6.3 Webhook Support

Fire webhooks on key events: `invoice.created`, `invoice.sent`, `invoice.paid`, `invoice.overdue`, `payment.received`, `estimate.accepted`. Settings page for managing webhook URLs. Retry logic with exponential backoff. Webhook logs with payload inspection.

**Effort:** ~3 days

### 6.4 Zapier / Make Integration

Connects Invoice to 5,000+ tools via Zapier (and Make.com). Triggers: invoice created, paid, overdue, estimate accepted. Actions: create invoice, create client. Listed on Zapier marketplace = free distribution channel.

**Effort:** ~4–5 days

### 6.5 Two-Factor Authentication (TOTP)

TOTP-based 2FA via authenticator apps (Google Authenticator, Authy, 1Password). Better Auth supports this via plugin. Increasingly expected for tools that handle financial data.

**Effort:** ~2–3 days

### 6.6 Public API

REST API for power users, integrators, and developers building on top of Invoice. API key management in Settings. Rate limiting. OpenAPI spec. Auto-generated docs page at `/api/docs`.

**Effort:** ~1–2 weeks

---

## Features NOT Building (& Why)

| Feature                           | Why Not                                                                                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time tracking**                 | Different product. 80%+ of freelancers already use Toggl, Clockify, or Harvest. Building a worse time tracker doesn't help. Our line items support hourly billing already — freelancers enter hours manually. |
| **Contract management**           | Bonsai/HoneyBook territory. Adding contracts bloats the product into an "all-in-one" that does nothing well. Stay focused on invoicing.                                                                       |
| **Full accounting / bookkeeping** | Wave/QuickBooks territory. Double-entry bookkeeping, chart of accounts, bank reconciliation — different product entirely. Our expense tracking is intentionally simple.                                       |
| **Team / multi-user**             | Invoice is for solo freelancers. Multi-user adds massive complexity (permissions, roles, shared clients, team billing). If teams need invoicing, they use FreshBooks or QuickBooks.                           |
| **Inventory management**          | Product-based businesses need this, service-based freelancers don't. Not our market.                                                                                                                          |
| **CRM / Sales pipeline**          | Client management is enough. Adding deals, pipelines, and lead tracking is scope creep into HubSpot territory.                                                                                                |
| **Bank account linking**          | Plaid integration for automatic payment detection. Cool but complex, expensive (Plaid costs), and solves a problem Stripe webhooks already solve for online payments.                                         |

---

## Technical Implementation Notes

### Convex Cron Jobs

```typescript
// packages/backend/convex/crons.ts
import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Phase 1: Mark overdue invoices (every hour)
crons.interval('check overdue invoices', { hours: 1 }, internal.invoices.autoCheckOverdue);

// Phase 3: Send overdue reminders (every 6 hours)
crons.interval('send overdue reminders', { hours: 6 }, internal.email.processReminders);

// Phase 4: Generate recurring invoices (daily at 6 AM UTC)
crons.daily(
  'process recurring invoices',
  { hourUTC: 6, minuteUTC: 0 },
  internal.recurring.processAll
);

// Phase 4: Auto-expire estimates (daily at midnight UTC)
crons.daily('expire old estimates', { hourUTC: 0, minuteUTC: 0 }, internal.estimates.autoExpire);

export default crons;
```

### External API Calls in Convex

Convex mutations/queries cannot call external APIs. Use **actions** for Stripe and Resend:

```typescript
// Pattern: mutation validates → schedules action → action calls API → internal mutation saves result
//
// 1. User clicks "Send Invoice" (frontend)
// 2. Frontend calls mutation: invoices.markSent(id)
// 3. Mutation validates ownership, updates status
// 4. Mutation schedules action: ctx.scheduler.runAfter(0, internal.email.sendInvoiceAction, { invoiceId })
// 5. Action calls Resend API, generates PDF, sends email
// 6. Action calls internal mutation to log the email send
```

### Stripe Connect Architecture

```
Self-hosted:
  - Freelancer creates their own Stripe account
  - Connects directly via API keys in .env
  - Zero platform fee — direct charges to their own account

Cloud-hosted:
  - Uses Stripe Connect Express
  - Freelancer onboards through Stripe's hosted OAuth
  - Payments go to freelancer's connected account
  - Optional platform fee (Model 2/3 monetization)
  - We handle webhook routing per connected account
```

### Email Infrastructure

```
Cloud:
  - Resend account managed by us
  - Send from: noreply@mail.invoice.ahmedhesham.dev (or custom domain)
  - React Email templates in packages/email/

Self-hosted:
  - User provides their own Resend API key (or any SMTP config)
  - Environment variable: RESEND_API_KEY
  - Same React Email templates, just different sender config
```

### New Monorepo Package

```
packages/email/
  ├── src/
  │   ├── templates/
  │   │   ├── invoice-delivery.tsx      # React Email template
  │   │   ├── payment-receipt.tsx
  │   │   ├── overdue-reminder.tsx
  │   │   └── estimate-delivery.tsx
  │   └── lib/
  │       └── send.ts                    # Resend API wrapper
  ├── package.json
  └── tsconfig.json
```

---

## Success Metrics

### Phase 1–3 (Pre-launch — Feature Completeness)

| Metric                                    | Target |
| ----------------------------------------- | ------ |
| All Phase 1–3 features shipped            | ✅     |
| Self-host documentation complete          | ✅     |
| Zero known critical bugs                  | ✅     |
| Landing page accurately reflects features | ✅     |
| Stripe payment flow tested end-to-end     | ✅     |
| Email delivery tested end-to-end          | ✅     |

### Post-Launch (Month 1–6)

| Metric                    | Month 1 | Month 3 | Month 6 |
| ------------------------- | ------- | ------- | ------- |
| GitHub stars              | 200     | 1,000   | 3,000   |
| Registered users (cloud)  | 100     | 500     | 2,000   |
| Monthly invoices created  | 300     | 2,000   | 10,000  |
| Stripe payments processed | 50      | 500     | 3,000   |
| Payment volume (GMV)      | $10K    | $100K   | $500K   |
| Cloud paid subscribers    | 10      | 80      | 400     |
| MRR                       | $50     | $400    | $2,000  |
| Self-host Docker pulls    | 50      | 300     | 1,000   |
| Contributors (GitHub)     | 3       | 10      | 25      |

### North Star Metric

**Total payment volume (GMV) processed through Invoice.** This captures: users are signing up (acquisition), creating invoices (activation), their clients are paying through the platform (value delivery), and they're coming back to invoice again (retention). It works for both cloud and self-hosted users.

---

## SEO & Distribution Notes

### Current SEO State — Audit

**✅ What's working well:**

- JSON-LD structured data (Organization, SoftwareApplication, HowTo, FAQ, BreadcrumbList)
- Open Graph + Twitter Card meta tags on all public pages
- Sitemap at `/sitemap.xml`
- Robots.txt with AI bot permissions (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- Canonical URLs set correctly
- Google Site Verification active
- `noindex` on authenticated pages (dashboard, settings, invoices, clients)
- `noindex, nofollow` on public invoice pages (don't index client data)
- Semantic HTML with proper heading hierarchy (h1 → h2 → h3)
- FAQ section with schema markup for rich results
- HowTo schema for "How to create an invoice" steps

**🔧 What needs improvement:**

1. **Only 3 pages in sitemap** — Landing, login, signup. Need to add: pricing, features, changelog, blog posts as we build them.

2. **No blog / content marketing** — The #1 organic growth channel for open-source SaaS tools. Target keywords:
   - "free invoice generator" — 90K monthly searches
   - "invoice template" — 74K monthly searches
   - "how to create an invoice" — 22K monthly searches
   - "freelance invoice" — 12K monthly searches
   - "open source invoicing" — 1.2K monthly searches
   - "invoice generator for freelancers" — 8K monthly searches
   - "send invoice online" — 6K monthly searches

3. **No dedicated pricing page** — `/pricing` as a standalone route. Pricing pages rank for "[tool] pricing" queries and convert comparison shoppers.

4. **No changelog / updates page** — Builds trust, shows active development, fresh content for crawlers.

5. **SoftwareApplication schema says `price: "0"`** — Correct for open source. When cloud paid tier launches, add pricing tiers to schema.

6. **No `alternate` / `hreflang` tags** — Needed when multi-language launches (Phase 6).

7. **Single OG image for all pages** — Consider dynamic OG images per page type (pricing, features, blog posts).

8. **Missing structured data for pricing** — Add `Offer` schema with `priceSpecification` for free + paid tiers.

### Distribution Channels

#### Open Source Channels (High Impact)

1. **GitHub** — README optimization, topics (`invoicing`, `freelancer`, `open-source`), awesome-lists
2. **Hacker News "Show HN"** — Time with major feature launch (Phase 2 or 3 completion)
3. **Product Hunt** — Open-source category launch
4. **r/selfhosted** — Self-hosting community actively seeks tools like this
5. **r/opensource, r/webdev, r/freelance** — Targeted communities

#### Content Marketing (Medium-term)

6. **Dev.to / Hashnode** — Technical posts about the architecture (Convex + TanStack Start + React Email)
7. **Blog on main site** — SEO-targeted content for invoice-related keywords
8. **YouTube** — "Building an open-source SaaS" series, feature demos

#### Community (Long-term)

9. **Twitter/X** — Build-in-public thread, feature announcements, milestone celebrations
10. **Indie Hackers** — Monthly updates on growth
11. **Discord community** — User feedback, feature requests, self-hosting support
12. **GitHub Discussions** — Feature requests and roadmap voting

### Open Source Advantages for Distribution

- **GitHub stars = social proof** — Every star is a potential user, contributor, or advocate
- **Self-hosters become evangelists** — They recommend the tool in their communities
- **Contributors fix bugs and add features** — Free labor that improves the product
- **Forks validate demand** — Active forks mean people care enough to customize
- **"Open source" in meta descriptions** improves CTR — differentiation from closed-source competitors

---

## Timeline Summary

```
Week 1        Phase 1 — Foundation Fixes
              ├── Data export (JSON + CSV)
              ├── Overdue cron job
              ├── Client archive
              └── Per-client currency default

Weeks 2–3     Phase 2 — Payment Collection
              └── Stripe Connect integration (Pay Now button on /i/{token})

Weeks 4–5     Phase 3 — Email & Automation
              ├── Email delivery via Resend (send invoices + receipts)
              └── Automated overdue reminders (configurable schedule)

Weeks 6–8     Phase 4 — Workflow Completeness
              ├── Recurring invoices (auto-generate on schedule)
              ├── Estimates / quotes (with client accept/decline + convert to invoice)
              ├── Basic expense tracking (with receipt upload)
              └── Reporting improvements (revenue by client, aging, tax summary)

Months 3–6    Phase 5 — Growth & Expansion
              ├── PayPal integration
              ├── Data import (CSV + FreshBooks/Wave/Invoice Ninja)
              ├── Partial payments
              └── Expanded currency support (20+ currencies)

Months 6+     Phase 6 — Platform Play
              ├── Client portal (magic link access)
              ├── Multi-language invoices
              ├── Webhook support
              ├── Zapier / Make integration
              ├── Two-factor authentication
              └── Public REST API
```

**After Phase 3 (Week 5):** Invoice is a feature-complete open-source invoicing platform with online payments, email delivery, and automated reminders. This is the "launchable" milestone — ready for Product Hunt, Hacker News, and r/selfhosted.

**After Phase 4 (Week 8):** Invoice matches or exceeds Invoice Ninja's free tier feature set with a modern stack, superior design, and better DX. This is the "competitive" milestone.

---

_This is a living document. Priorities shift based on community feedback, GitHub issues, and contributor interest. Updated monthly._

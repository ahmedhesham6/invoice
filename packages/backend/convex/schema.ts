import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Invoice template IDs
const invoiceTemplateValidator = v.union(
  v.literal('classic'),
  v.literal('minimal'),
  v.literal('bold'),
  v.literal('elegant'),
  v.literal('retro'),
  v.literal('neon'),
  v.literal('mono'),
  v.literal('ocean'),
  v.literal('sunset')
);

export default defineSchema({
  // User profiles (extends WorkOS user)
  profiles: defineTable({
    // Link to WorkOS user
    userId: v.string(), // WorkOS user ID

    // Profile info
    displayName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),

    // Address
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),

    // Business info
    taxId: v.optional(v.string()),
    logoId: v.optional(v.id('_storage')), // Convex file storage

    // Invoice defaults
    defaultCurrency: v.string(), // Default: "USD"
    invoicePrefix: v.string(), // Default: "INV-"
    nextInvoiceNumber: v.number(), // Auto-increment, default: 1
    defaultPaymentTerms: v.number(), // Days, default: 30
    paymentDetails: v.optional(v.string()), // Bank info, PayPal, etc.
    defaultNotes: v.optional(v.string()), // Default invoice footer
    defaultInvoiceTemplate: v.optional(invoiceTemplateValidator), // Default template

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  // Clients
  clients: defineTable({
    userId: v.string(), // Owner (WorkOS user ID)

    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),

    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),

    taxId: v.optional(v.string()),
    notes: v.optional(v.string()), // Internal notes
    invoiceTemplate: v.optional(invoiceTemplateValidator), // Per-client template override

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_name', ['userId', 'name']),

  // Invoices
  invoices: defineTable({
    userId: v.string(), // Owner
    clientId: v.id('clients'),

    // Identity
    invoiceNumber: v.string(), // "INV-001"
    publicToken: v.string(), // UUID for public URL

    // Dates
    issueDate: v.number(), // Unix timestamp
    dueDate: v.number(), // Unix timestamp

    // Status
    status: v.union(v.literal('draft'), v.literal('sent'), v.literal('paid'), v.literal('overdue')),
    sentAt: v.optional(v.number()),
    paidAt: v.optional(v.number()),

    // Money (all amounts in cents)
    currency: v.string(), // "USD", "EUR", etc.
    subtotal: v.number(), // Sum of line items
    taxRate: v.number(), // Percentage (e.g., 10 for 10%)
    taxAmount: v.number(), // Calculated
    discountType: v.optional(v.union(v.literal('percentage'), v.literal('fixed'))),
    discountValue: v.optional(v.number()),
    discountAmount: v.number(), // Calculated
    total: v.number(), // Final amount

    // Content
    notes: v.optional(v.string()),
    paymentDetails: v.optional(v.string()), // Per-invoice payment instructions
    invoiceTemplate: v.optional(invoiceTemplateValidator), // Per-invoice template override

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_userId_clientId', ['userId', 'clientId'])
    .index('by_publicToken', ['publicToken']),

  // Line Items
  lineItems: defineTable({
    invoiceId: v.id('invoices'),

    description: v.string(),
    quantity: v.number(), // Supports decimals
    unit: v.optional(v.string()), // "hours", "days", "items", etc.
    unitPrice: v.number(), // In cents
    total: v.number(), // quantity * unitPrice (in cents)

    order: v.number(), // For sorting

    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_invoiceId', ['invoiceId']),
});

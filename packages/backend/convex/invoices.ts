import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

// List all invoices for the current user with optional filters
export const list = query({
  args: {
    status: v.optional(
      v.union(v.literal('draft'), v.literal('sent'), v.literal('paid'), v.literal('overdue'))
    ),
    clientId: v.optional(v.id('clients')),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    // Get all invoices for user and filter in memory for flexibility
    const allInvoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .order('desc')
      .collect();

    // Apply filters
    let filteredInvoices = allInvoices;
    if (args.status) {
      filteredInvoices = filteredInvoices.filter((inv) => inv.status === args.status);
    }
    if (args.clientId) {
      filteredInvoices = filteredInvoices.filter((inv) => inv.clientId === args.clientId);
    }

    // Get client info for each invoice
    const invoicesWithClients = await Promise.all(
      filteredInvoices.map(async (invoice) => {
        const client = await ctx.db.get(invoice.clientId);
        return { ...invoice, client };
      })
    );

    return invoicesWithClients;
  },
});

// Get a single invoice by ID with line items
export const get = query({
  args: { id: v.id('invoices') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      return null;
    }

    const client = await ctx.db.get(invoice.clientId);
    const lineItems = await ctx.db
      .query('lineItems')
      .withIndex('by_invoiceId', (q) => q.eq('invoiceId', args.id))
      .collect();

    // Sort by order
    lineItems.sort((a, b) => a.order - b.order);

    return { ...invoice, client, lineItems };
  },
});

// Get invoice by public token (for public view - no auth required)
export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invoice = await ctx.db
      .query('invoices')
      .withIndex('by_publicToken', (q) => q.eq('publicToken', args.token))
      .first();

    if (!invoice) {
      return null;
    }

    const client = await ctx.db.get(invoice.clientId);
    const lineItems = await ctx.db
      .query('lineItems')
      .withIndex('by_invoiceId', (q) => q.eq('invoiceId', invoice._id))
      .collect();

    lineItems.sort((a, b) => a.order - b.order);

    // Get profile for business info
    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', invoice.userId))
      .first();

    let profileWithLogo: (typeof profile & { logoUrl?: string | null }) | null = profile;
    if (profile && profile.logoId) {
      const logoUrl = await ctx.storage.getUrl(profile.logoId);
      profileWithLogo = { ...profile, logoUrl };
    }

    // Resolve template: invoice > client > profile default > 'classic'
    const resolvedTemplate =
      invoice.invoiceTemplate ||
      client?.invoiceTemplate ||
      profile?.defaultInvoiceTemplate ||
      'classic';

    return { ...invoice, client, lineItems, profile: profileWithLogo, resolvedTemplate };
  },
});

// Create a new invoice
export const create = mutation({
  args: {
    clientId: v.id('clients'),
    invoiceNumber: v.string(),
    issueDate: v.number(),
    dueDate: v.number(),
    currency: v.string(),
    taxRate: v.number(),
    discountType: v.optional(v.union(v.literal('percentage'), v.literal('fixed'))),
    discountValue: v.optional(v.number()),
    notes: v.optional(v.string()),
    paymentDetails: v.optional(v.string()),
    invoiceTemplate: v.optional(
      v.union(
        v.literal('classic'),
        v.literal('minimal'),
        v.literal('bold'),
        v.literal('elegant'),
        v.literal('retro'),
        v.literal('neon'),
        v.literal('mono'),
        v.literal('ocean'),
        v.literal('sunset')
      )
    ),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unit: v.optional(v.string()),
        unitPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    // Verify client belongs to user
    const client = await ctx.db.get(args.clientId);
    if (!client || client.userId !== authUser._id) {
      throw new Error('Client not found');
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of args.lineItems) {
      subtotal += Math.round(item.quantity * item.unitPrice);
    }

    const taxAmount = Math.round(subtotal * (args.taxRate / 100));

    let discountAmount = 0;
    if (args.discountType && args.discountValue) {
      if (args.discountType === 'percentage') {
        discountAmount = Math.round(subtotal * (args.discountValue / 100));
      } else {
        discountAmount = args.discountValue;
      }
    }

    const total = subtotal + taxAmount - discountAmount;

    // Generate public token
    const publicToken = crypto.randomUUID();

    const now = Date.now();
    const invoiceId = await ctx.db.insert('invoices', {
      userId: authUser._id,
      clientId: args.clientId,
      invoiceNumber: args.invoiceNumber,
      publicToken,
      issueDate: args.issueDate,
      dueDate: args.dueDate,
      status: 'draft',
      currency: args.currency,
      subtotal,
      taxRate: args.taxRate,
      taxAmount,
      discountType: args.discountType,
      discountValue: args.discountValue,
      discountAmount,
      total,
      notes: args.notes,
      paymentDetails: args.paymentDetails,
      invoiceTemplate: args.invoiceTemplate,
      createdAt: now,
      updatedAt: now,
    });

    // Create line items
    for (let i = 0; i < args.lineItems.length; i++) {
      const item = args.lineItems[i];
      await ctx.db.insert('lineItems', {
        invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: Math.round(item.quantity * item.unitPrice),
        order: i,
        createdAt: now,
        updatedAt: now,
      });
    }

    return invoiceId;
  },
});

// Update an invoice (draft only) - basic fields
export const update = mutation({
  args: {
    id: v.id('invoices'),
    clientId: v.optional(v.id('clients')),
    issueDate: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    currency: v.optional(v.string()),
    taxRate: v.optional(v.number()),
    discountType: v.optional(v.union(v.literal('percentage'), v.literal('fixed'))),
    discountValue: v.optional(v.number()),
    notes: v.optional(v.string()),
    paymentDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    if (invoice.status !== 'draft') {
      throw new Error('Can only edit draft invoices');
    }

    // If changing client, verify it belongs to user
    if (args.clientId) {
      const client = await ctx.db.get(args.clientId);
      if (!client || client.userId !== authUser._id) {
        throw new Error('Client not found');
      }
    }

    const { id: _id, ...updateFields } = args;
    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Full update an invoice with line items (draft only)
export const fullUpdate = mutation({
  args: {
    id: v.id('invoices'),
    clientId: v.id('clients'),
    issueDate: v.number(),
    dueDate: v.number(),
    currency: v.string(),
    taxRate: v.number(),
    discountType: v.optional(v.union(v.literal('percentage'), v.literal('fixed'))),
    discountValue: v.optional(v.number()),
    notes: v.optional(v.string()),
    paymentDetails: v.optional(v.string()),
    invoiceTemplate: v.optional(
      v.union(
        v.literal('classic'),
        v.literal('minimal'),
        v.literal('bold'),
        v.literal('elegant'),
        v.literal('retro'),
        v.literal('neon'),
        v.literal('mono'),
        v.literal('ocean'),
        v.literal('sunset')
      )
    ),
    lineItems: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unit: v.optional(v.string()),
        unitPrice: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    if (invoice.status !== 'draft') {
      throw new Error('Can only edit draft invoices');
    }

    // Verify client belongs to user
    const client = await ctx.db.get(args.clientId);
    if (!client || client.userId !== authUser._id) {
      throw new Error('Client not found');
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of args.lineItems) {
      subtotal += Math.round(item.quantity * item.unitPrice);
    }

    const taxAmount = Math.round(subtotal * (args.taxRate / 100));

    let discountAmount = 0;
    if (args.discountType && args.discountValue) {
      if (args.discountType === 'percentage') {
        discountAmount = Math.round(subtotal * (args.discountValue / 100));
      } else {
        discountAmount = args.discountValue;
      }
    }

    const total = subtotal + taxAmount - discountAmount;
    const now = Date.now();

    // Update invoice
    await ctx.db.patch(args.id, {
      clientId: args.clientId,
      issueDate: args.issueDate,
      dueDate: args.dueDate,
      currency: args.currency,
      subtotal,
      taxRate: args.taxRate,
      taxAmount,
      discountType: args.discountType,
      discountValue: args.discountValue,
      discountAmount,
      total,
      notes: args.notes,
      paymentDetails: args.paymentDetails,
      invoiceTemplate: args.invoiceTemplate,
      updatedAt: now,
    });

    // Delete existing line items
    const existingLineItems = await ctx.db
      .query('lineItems')
      .withIndex('by_invoiceId', (q) => q.eq('invoiceId', args.id))
      .collect();

    for (const item of existingLineItems) {
      await ctx.db.delete(item._id);
    }

    // Create new line items
    for (let i = 0; i < args.lineItems.length; i++) {
      const item = args.lineItems[i];
      await ctx.db.insert('lineItems', {
        invoiceId: args.id,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: Math.round(item.quantity * item.unitPrice),
        order: i,
        createdAt: now,
        updatedAt: now,
      });
    }

    return args.id;
  },
});

// Recalculate invoice totals (call after updating line items)
export const recalculateTotals = mutation({
  args: { id: v.id('invoices') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    const lineItems = await ctx.db
      .query('lineItems')
      .withIndex('by_invoiceId', (q) => q.eq('invoiceId', args.id))
      .collect();

    let subtotal = 0;
    for (const item of lineItems) {
      subtotal += item.total;
    }

    const taxAmount = Math.round(subtotal * (invoice.taxRate / 100));

    let discountAmount = 0;
    if (invoice.discountType && invoice.discountValue) {
      if (invoice.discountType === 'percentage') {
        discountAmount = Math.round(subtotal * (invoice.discountValue / 100));
      } else {
        discountAmount = invoice.discountValue;
      }
    }

    const total = subtotal + taxAmount - discountAmount;

    await ctx.db.patch(args.id, {
      subtotal,
      taxAmount,
      discountAmount,
      total,
      updatedAt: Date.now(),
    });
  },
});

// Delete an invoice (draft only)
export const remove = mutation({
  args: { id: v.id('invoices') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    if (invoice.status !== 'draft') {
      throw new Error('Can only delete draft invoices');
    }

    // Delete line items first
    const lineItems = await ctx.db
      .query('lineItems')
      .withIndex('by_invoiceId', (q) => q.eq('invoiceId', args.id))
      .collect();

    for (const item of lineItems) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Duplicate an invoice
export const duplicate = mutation({
  args: { id: v.id('invoices'), newInvoiceNumber: v.string() },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    const lineItems = await ctx.db
      .query('lineItems')
      .withIndex('by_invoiceId', (q) => q.eq('invoiceId', args.id))
      .collect();

    const now = Date.now();
    const publicToken = crypto.randomUUID();

    // Create new invoice
    const newInvoiceId = await ctx.db.insert('invoices', {
      userId: authUser._id,
      clientId: invoice.clientId,
      invoiceNumber: args.newInvoiceNumber,
      publicToken,
      issueDate: now,
      dueDate: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      status: 'draft',
      currency: invoice.currency,
      subtotal: invoice.subtotal,
      taxRate: invoice.taxRate,
      taxAmount: invoice.taxAmount,
      discountType: invoice.discountType,
      discountValue: invoice.discountValue,
      discountAmount: invoice.discountAmount,
      total: invoice.total,
      notes: invoice.notes,
      paymentDetails: invoice.paymentDetails,
      invoiceTemplate: invoice.invoiceTemplate,
      createdAt: now,
      updatedAt: now,
    });

    // Duplicate line items
    for (const item of lineItems) {
      await ctx.db.insert('lineItems', {
        invoiceId: newInvoiceId,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: item.total,
        order: item.order,
        createdAt: now,
        updatedAt: now,
      });
    }

    return newInvoiceId;
  },
});

// Mark invoice as sent
export const markSent = mutation({
  args: { id: v.id('invoices') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    if (invoice.status !== 'draft') {
      throw new Error('Invoice is already sent');
    }

    await ctx.db.patch(args.id, {
      status: 'sent',
      sentAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Mark invoice as paid
export const markPaid = mutation({
  args: { id: v.id('invoices') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const invoice = await ctx.db.get(args.id);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === 'draft') {
      throw new Error('Cannot mark draft invoice as paid');
    }

    if (invoice.status === 'paid') {
      throw new Error('Invoice is already paid');
    }

    await ctx.db.patch(args.id, {
      status: 'paid',
      paidAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Check and mark overdue invoices (can be called periodically)
export const checkOverdue = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const now = Date.now();
    const sentInvoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId_status', (q) => q.eq('userId', authUser._id).eq('status', 'sent'))
      .collect();

    let markedCount = 0;
    for (const invoice of sentInvoices) {
      if (invoice.dueDate < now) {
        await ctx.db.patch(invoice._id, {
          status: 'overdue',
          updatedAt: now,
        });
        markedCount++;
      }
    }

    return markedCount;
  },
});

// Get recent invoices for dashboard
export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    const limit = args.limit ?? 5;

    const invoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .order('desc')
      .take(limit);

    const invoicesWithClients = await Promise.all(
      invoices.map(async (invoice) => {
        const client = await ctx.db.get(invoice.clientId);
        return { ...invoice, client };
      })
    );

    return invoicesWithClients;
  },
});

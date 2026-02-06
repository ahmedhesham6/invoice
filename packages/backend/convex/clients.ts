import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

// List all clients for the current user
export const list = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    return await ctx.db
      .query('clients')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .order('desc')
      .collect();
  },
});

// Get a single client by ID
export const get = query({
  args: { id: v.id('clients') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    const client = await ctx.db.get(args.id);
    if (!client || client.userId !== authUser._id) {
      return null;
    }

    return client;
  },
});

// Search clients by name
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    const clients = await ctx.db
      .query('clients')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower)
    );
  },
});

// Create a new client
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    taxId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const now = Date.now();
    const clientId = await ctx.db.insert('clients', {
      userId: authUser._id,
      name: args.name,
      email: args.email,
      phone: args.phone,
      address: args.address,
      city: args.city,
      country: args.country,
      postalCode: args.postalCode,
      taxId: args.taxId,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return clientId;
  },
});

// Update a client
export const update = mutation({
  args: {
    id: v.id('clients'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    taxId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const client = await ctx.db.get(args.id);
    if (!client || client.userId !== authUser._id) {
      throw new Error('Client not found');
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

// Delete a client
export const remove = mutation({
  args: { id: v.id('clients') },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const client = await ctx.db.get(args.id);
    if (!client || client.userId !== authUser._id) {
      throw new Error('Client not found');
    }

    // Check if client has invoices
    const invoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId_clientId', (q) => q.eq('userId', authUser._id).eq('clientId', args.id))
      .first();

    if (invoices) {
      throw new Error('Cannot delete client with existing invoices');
    }

    await ctx.db.delete(args.id);
  },
});

// Get client count
export const count = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return 0;
    }

    const clients = await ctx.db
      .query('clients')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .collect();

    return clients.length;
  },
});

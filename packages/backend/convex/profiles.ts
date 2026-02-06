import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

// Get the current user's profile
export const get = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .first();

    if (profile && profile.logoId) {
      const logoUrl = await ctx.storage.getUrl(profile.logoId);
      return { ...profile, logoUrl };
    }

    return profile;
  },
});

// Create a new profile (called after signup)
export const create = mutation({
  args: {
    displayName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .first();

    if (existingProfile) {
      return existingProfile._id;
    }

    const now = Date.now();
    const profileId = await ctx.db.insert('profiles', {
      userId: authUser._id,
      displayName: args.displayName,
      email: args.email,
      defaultCurrency: 'USD',
      invoicePrefix: 'INV-',
      nextInvoiceNumber: 1,
      defaultPaymentTerms: 30,
      createdAt: now,
      updatedAt: now,
    });

    return profileId;
  },
});

// Update profile (creates if doesn't exist)
export const update = mutation({
  args: {
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    taxId: v.optional(v.string()),
    defaultCurrency: v.optional(v.string()),
    invoicePrefix: v.optional(v.string()),
    defaultPaymentTerms: v.optional(v.number()),
    paymentDetails: v.optional(v.string()),
    defaultNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .first();

    const now = Date.now();

    // Create profile if it doesn't exist (upsert)
    if (!profile) {
      const profileId = await ctx.db.insert('profiles', {
        userId: authUser._id,
        displayName: args.displayName || authUser.name || 'User',
        email: args.email || authUser.email || '',
        phone: args.phone,
        website: args.website,
        address: args.address,
        city: args.city,
        country: args.country,
        postalCode: args.postalCode,
        taxId: args.taxId,
        defaultCurrency: args.defaultCurrency || 'USD',
        invoicePrefix: args.invoicePrefix || 'INV-',
        nextInvoiceNumber: 1,
        defaultPaymentTerms: args.defaultPaymentTerms || 30,
        paymentDetails: args.paymentDetails,
        defaultNotes: args.defaultNotes,
        createdAt: now,
        updatedAt: now,
      });
      return profileId;
    }

    // Filter out undefined values
    const updates: Record<string, unknown> = { updatedAt: now };
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }

    await ctx.db.patch(profile._id, updates);
    return profile._id;
  },
});

// Generate upload URL for logo
export const generateLogoUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Save logo after upload
export const saveLogo = mutation({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .first();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Delete old logo if exists
    if (profile.logoId) {
      await ctx.storage.delete(profile.logoId);
    }

    await ctx.db.patch(profile._id, {
      logoId: args.storageId,
      updatedAt: Date.now(),
    });

    return await ctx.storage.getUrl(args.storageId);
  },
});

// Delete logo
export const deleteLogo = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .first();

    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.logoId) {
      await ctx.storage.delete(profile.logoId);
      await ctx.db.patch(profile._id, {
        logoId: undefined,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get next invoice number and increment
export const getAndIncrementInvoiceNumber = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error('Not authenticated');
    }

    const profile = await ctx.db
      .query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .first();

    if (!profile) {
      throw new Error('Profile not found');
    }

    const currentNumber = profile.nextInvoiceNumber;
    const invoiceNumber = `${profile.invoicePrefix}${String(currentNumber).padStart(3, '0')}`;

    await ctx.db.patch(profile._id, {
      nextInvoiceNumber: currentNumber + 1,
      updatedAt: Date.now(),
    });

    return invoiceNumber;
  },
});

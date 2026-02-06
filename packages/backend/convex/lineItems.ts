import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";

// Get line items for an invoice
export const listByInvoice = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    // Verify invoice belongs to user
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== authUser._id) {
      return [];
    }

    const lineItems = await ctx.db
      .query("lineItems")
      .withIndex("by_invoiceId", (q) => q.eq("invoiceId", args.invoiceId))
      .collect();

    return lineItems.sort((a, b) => a.order - b.order);
  },
});

// Add a line item to an invoice
export const create = mutation({
  args: {
    invoiceId: v.id("invoices"),
    description: v.string(),
    quantity: v.number(),
    unit: v.optional(v.string()),
    unitPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify invoice belongs to user and is draft
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error("Invoice not found");
    }

    if (invoice.status !== "draft") {
      throw new Error("Can only add items to draft invoices");
    }

    // Get current max order
    const existingItems = await ctx.db
      .query("lineItems")
      .withIndex("by_invoiceId", (q) => q.eq("invoiceId", args.invoiceId))
      .collect();

    const maxOrder = existingItems.length > 0
      ? Math.max(...existingItems.map((item) => item.order))
      : -1;

    const now = Date.now();
    const total = Math.round(args.quantity * args.unitPrice);

    const lineItemId = await ctx.db.insert("lineItems", {
      invoiceId: args.invoiceId,
      description: args.description,
      quantity: args.quantity,
      unit: args.unit,
      unitPrice: args.unitPrice,
      total,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    });

    // Recalculate invoice totals
    await recalculateInvoiceTotals(ctx, args.invoiceId);

    return lineItemId;
  },
});

// Update a line item
export const update = mutation({
  args: {
    id: v.id("lineItems"),
    description: v.optional(v.string()),
    quantity: v.optional(v.number()),
    unit: v.optional(v.string()),
    unitPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const lineItem = await ctx.db.get(args.id);
    if (!lineItem) {
      throw new Error("Line item not found");
    }

    // Verify invoice belongs to user and is draft
    const invoice = await ctx.db.get(lineItem.invoiceId);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error("Invoice not found");
    }

    if (invoice.status !== "draft") {
      throw new Error("Can only edit items on draft invoices");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.description !== undefined) updates.description = args.description;
    if (args.quantity !== undefined) updates.quantity = args.quantity;
    if (args.unit !== undefined) updates.unit = args.unit;
    if (args.unitPrice !== undefined) updates.unitPrice = args.unitPrice;

    // Recalculate line item total
    const quantity = args.quantity ?? lineItem.quantity;
    const unitPrice = args.unitPrice ?? lineItem.unitPrice;
    updates.total = Math.round(quantity * unitPrice);

    await ctx.db.patch(args.id, updates);

    // Recalculate invoice totals
    await recalculateInvoiceTotals(ctx, lineItem.invoiceId);

    return args.id;
  },
});

// Delete a line item
export const remove = mutation({
  args: { id: v.id("lineItems") },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const lineItem = await ctx.db.get(args.id);
    if (!lineItem) {
      throw new Error("Line item not found");
    }

    // Verify invoice belongs to user and is draft
    const invoice = await ctx.db.get(lineItem.invoiceId);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error("Invoice not found");
    }

    if (invoice.status !== "draft") {
      throw new Error("Can only remove items from draft invoices");
    }

    const invoiceId = lineItem.invoiceId;
    await ctx.db.delete(args.id);

    // Recalculate invoice totals
    await recalculateInvoiceTotals(ctx, invoiceId);
  },
});

// Reorder line items
export const reorder = mutation({
  args: {
    invoiceId: v.id("invoices"),
    itemIds: v.array(v.id("lineItems")),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify invoice belongs to user and is draft
    const invoice = await ctx.db.get(args.invoiceId);
    if (!invoice || invoice.userId !== authUser._id) {
      throw new Error("Invoice not found");
    }

    if (invoice.status !== "draft") {
      throw new Error("Can only reorder items on draft invoices");
    }

    // Update order for each item
    for (let i = 0; i < args.itemIds.length; i++) {
      await ctx.db.patch(args.itemIds[i], {
        order: i,
        updatedAt: Date.now(),
      });
    }
  },
});

// Helper function to recalculate invoice totals
async function recalculateInvoiceTotals(
  ctx: MutationCtx,
  invoiceId: Id<"invoices">
) {
  const invoice = await ctx.db.get(invoiceId);
  if (!invoice) return;

  const lineItems = await ctx.db
    .query("lineItems")
    .withIndex("by_invoiceId", (q) => q.eq("invoiceId", invoiceId))
    .collect();

  let subtotal = 0;
  for (const item of lineItems) {
    subtotal += item.total;
  }

  const taxAmount = Math.round(subtotal * ((invoice as { taxRate: number }).taxRate / 100));

  let discountAmount = 0;
  const inv = invoice as { discountType?: string; discountValue?: number };
  if (inv.discountType && inv.discountValue) {
    if (inv.discountType === "percentage") {
      discountAmount = Math.round(subtotal * (inv.discountValue / 100));
    } else {
      discountAmount = inv.discountValue;
    }
  }

  const total = subtotal + taxAmount - discountAmount;

  await ctx.db.patch(invoiceId, {
    subtotal,
    taxAmount,
    discountAmount,
    total,
    updatedAt: Date.now(),
  });
}

import { query } from './_generated/server';
import { authComponent } from './auth';

// Get dashboard statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return {
        outstanding: 0,
        paidThisMonth: 0,
        overdueCount: 0,
        totalClients: 0,
        totalInvoices: 0,
      };
    }

    const invoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .collect();

    const clients = await ctx.db
      .query('clients')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .collect();

    // Calculate outstanding (sent + overdue)
    const outstanding = invoices
      .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    // Calculate paid this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const paidThisMonth = invoices
      .filter((inv) => inv.status === 'paid' && inv.paidAt && inv.paidAt >= startOfMonth)
      .reduce((sum, inv) => sum + inv.total, 0);

    // Count overdue
    const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;

    return {
      outstanding,
      paidThisMonth,
      overdueCount,
      totalClients: clients.length,
      totalInvoices: invoices.length,
    };
  },
});

// Get recent invoices for dashboard
export const getRecent = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return [];
    }

    const invoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .order('desc')
      .take(5);

    const invoicesWithClients = await Promise.all(
      invoices.map(async (invoice) => {
        const client = await ctx.db.get(invoice.clientId);
        return { ...invoice, client };
      })
    );

    return invoicesWithClients;
  },
});

// Get invoices by status for dashboard widgets
export const getByStatus = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return {
        draft: 0,
        sent: 0,
        paid: 0,
        overdue: 0,
      };
    }

    const invoices = await ctx.db
      .query('invoices')
      .withIndex('by_userId', (q) => q.eq('userId', authUser._id))
      .collect();

    return {
      draft: invoices.filter((inv) => inv.status === 'draft').length,
      sent: invoices.filter((inv) => inv.status === 'sent').length,
      paid: invoices.filter((inv) => inv.status === 'paid').length,
      overdue: invoices.filter((inv) => inv.status === 'overdue').length,
    };
  },
});

import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { Badge } from '@invoice/ui/components/badge';
import { Button } from '@invoice/ui/components/button';
import { Card, CardContent } from '@invoice/ui/components/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  FileText,
  Plus,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

import { ProtectedRoute } from '@/components/protected-route';
import { SITE_NAME } from '@/lib/seo';

export const Route = createFileRoute('/_app/dashboard')({
  head: () => ({
    meta: [
      { title: `Dashboard | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'Your invoicing dashboard — track outstanding payments, revenue, overdue invoices, and recent activity.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function formatCurrency(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatCurrencyFull(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}

function DashboardContent() {
  const stats = useQuery(convexQuery(api.dashboard.getStats, {}));
  const recentInvoices = useQuery(convexQuery(api.dashboard.getRecent, {}));
  const profile = useQuery(convexQuery(api.profiles.get, {}));
  const checkOverdue = useConvexMutation(api.invoices.checkOverdue);
  const queryClient = useQueryClient();
  const checkedOverdue = useRef(false);

  useEffect(() => {
    if (!checkedOverdue.current && profile.data) {
      checkedOverdue.current = true;
      checkOverdue()
        .then((count) => {
          if (count > 0) {
            queryClient.invalidateQueries();
          }
        })
        .catch(() => {});
    }
  }, [checkOverdue, queryClient, profile.data]);

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    draft: {
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      label: 'Draft',
    },
    sent: {
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Pending',
    },
    paid: {
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Paid',
    },
    overdue: {
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-500/10',
      label: 'Overdue',
    },
  };

  const firstName = profile.data?.displayName?.split(' ')[0] || '';
  const greeting = getGreeting();

  return (
    <div className="min-h-full relative">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-primary/[0.03] blur-[200px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-10">
        {/* Hero Section */}
        <header className="mb-14 animate-in-up">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/60">
                {greeting}
              </p>
              <h1 className="font-display text-5xl lg:text-6xl tracking-tight leading-[0.95]">
                {firstName ? (
                  <>
                    Welcome back,
                    <br />
                    <span className="text-gradient">{firstName}</span>
                  </>
                ) : (
                  'Your Dashboard'
                )}
              </h1>
              <p className="text-muted-foreground text-[15px] max-w-md">
                Here's an overview of your invoicing activity and outstanding payments.
              </p>
            </div>

            <div className="flex gap-2.5">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="group h-10 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <Link to="/clients/new">
                  <Users className="h-3.5 w-3.5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  Add Client
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="group h-10 shadow-lg shadow-primary/15 hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Link to="/invoices/new">
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  New Invoice
                  <Sparkles className="h-3 w-3 ml-1.5 opacity-50" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="mb-14">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 stagger-children">
            {/* Outstanding */}
            <Card className="card-premium group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2 bg-warning-muted">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                    Outstanding
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-3xl tracking-tight">
                    {stats.data ? formatCurrency(stats.data.outstanding) : '$0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </div>
              </CardContent>
            </Card>

            {/* Paid This Month */}
            <Card className="card-premium group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2 bg-success-muted">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                    This Month
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-3xl tracking-tight text-success">
                    {stats.data ? formatCurrency(stats.data.paidThisMonth) : '$0'}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue collected</p>
                </div>
              </CardContent>
            </Card>

            {/* Overdue */}
            <Card className="card-premium group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`p-2 ${(stats.data?.overdueCount ?? 0) > 0 ? 'bg-destructive/10' : 'bg-muted'}`}
                  >
                    <AlertTriangle
                      className={`h-4 w-4 ${(stats.data?.overdueCount ?? 0) > 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                    Overdue
                  </span>
                </div>
                <div className="space-y-1">
                  <p
                    className={`font-display text-3xl tracking-tight ${(stats.data?.overdueCount ?? 0) > 0 ? 'text-destructive' : ''}`}
                  >
                    {stats.data?.overdueCount ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(stats.data?.overdueCount ?? 0) === 1 ? 'Invoice' : 'Invoices'} past due
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Clients */}
            <Card className="card-premium group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2 bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                    Clients
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-3xl tracking-tight">
                    {stats.data?.totalClients ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Active relationships</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Invoices */}
        <section className="animate-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-2xl tracking-tight">Recent Invoices</h2>
              <p className="text-muted-foreground text-xs mt-1">Your latest billing activity</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="group text-muted-foreground hover:text-foreground h-8 text-xs"
            >
              <Link to="/invoices">
                View all
                <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </div>

          <Card className="card-premium overflow-hidden">
            {recentInvoices.isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-28 bg-muted animate-pulse" />
                      <div className="h-3 w-20 bg-muted animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : recentInvoices.data && recentInvoices.data.length > 0 ? (
              <div className="divide-y divide-border/50">
                {recentInvoices.data.map((invoice, index) => (
                  <Link
                    key={invoice._id}
                    to="/invoices/$id"
                    params={{ id: invoice._id }}
                    className="group flex items-center gap-5 px-5 py-4 hover:bg-muted/20 transition-all duration-200"
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  >
                    {/* Invoice Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted/40 group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    {/* Invoice Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                          {invoice.invoiceNumber}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`${statusConfig[invoice.status].bg} ${statusConfig[invoice.status].color} border-0 text-[10px] font-medium px-1.5 py-0`}
                        >
                          {statusConfig[invoice.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {invoice.client?.name ?? 'Unknown client'}
                      </p>
                    </div>

                    {/* Amount & Date */}
                    <div className="text-right shrink-0">
                      <p className="font-display text-lg tabular-nums tracking-tight">
                        {formatCurrencyFull(invoice.total, invoice.currency)}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="h-3.5 w-3.5 text-transparent group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-muted/40">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2">No invoices yet</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  Create your first invoice to start tracking your revenue and getting paid.
                </p>
                <Button asChild size="lg" className="h-10 shadow-lg shadow-primary/15">
                  <Link to="/invoices/new">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Create Invoice
                  </Link>
                </Button>
              </div>
            )}
          </Card>
        </section>

        {/* Quick Actions — Mobile */}
        <div className="fixed bottom-5 left-5 right-5 md:hidden z-50">
          <div className="flex gap-2.5 p-3 bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl shadow-black/20">
            <Button asChild className="flex-1 h-10" size="lg">
              <Link to="/invoices/new">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Invoice
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 h-10 border-border/60" size="lg">
              <Link to="/clients/new">
                <Users className="mr-2 h-3.5 w-3.5" />
                Client
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

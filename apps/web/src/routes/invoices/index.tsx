import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { Badge } from '@invoice/ui/components/badge';
import { Button } from '@invoice/ui/components/button';
import { Card, CardContent } from '@invoice/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@invoice/ui/components/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  Copy,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
  CheckCircle,
  Send,
  Eye,
  ArrowRight,
  Files,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ProtectedRoute } from '@/components/protected-route';

export const Route = createFileRoute('/invoices/')({
  component: InvoicesPage,
});

function InvoicesPage() {
  return (
    <ProtectedRoute>
      <InvoicesContent />
    </ProtectedRoute>
  );
}

function formatCurrency(cents: number, currency = 'USD') {
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

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

function InvoicesContent() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const invoices = useQuery(
    convexQuery(
      api.invoices.list,
      statusFilter === 'all' ? {} : { status: statusFilter as InvoiceStatus }
    )
  );
  const markSent = useConvexMutation(api.invoices.markSent);
  const markPaid = useConvexMutation(api.invoices.markPaid);
  const deleteInvoice = useConvexMutation(api.invoices.remove);
  const duplicateInvoice = useConvexMutation(api.invoices.duplicate);
  const getInvoiceNumber = useConvexMutation(api.profiles.getAndIncrementInvoiceNumber);

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    draft: { color: 'text-muted-foreground', bg: 'bg-muted', label: 'Draft' },
    sent: { color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10', label: 'Pending' },
    paid: {
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      label: 'Paid',
    },
    overdue: { color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10', label: 'Overdue' },
  };

  const handleMarkSent = async (id: string) => {
    try {
      await markSent({ id: id as any });
      toast.success('Invoice marked as sent');
    } catch {
      toast.error('Failed to update invoice');
    }
  };
  const handleMarkPaid = async (id: string) => {
    try {
      await markPaid({ id: id as any });
      toast.success('Invoice marked as paid');
    } catch {
      toast.error('Failed to update invoice');
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await deleteInvoice({ id: id as any });
      toast.success('Invoice deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice');
    }
  };
  const handleDuplicate = async (id: string) => {
    try {
      const suggestedNumber = await getInvoiceNumber();
      const newInvoiceNumber = window.prompt('Enter invoice number:', suggestedNumber);
      if (!newInvoiceNumber) return;
      const newId = await duplicateInvoice({ id: id as any, newInvoiceNumber });
      toast.success('Invoice duplicated');
      navigate({ to: '/invoices/$id', params: { id: newId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to duplicate invoice');
    }
  };
  const copyPublicLink = (token: string) => {
    const url = `${window.location.origin}/i/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const totals = {
    all: invoices.data?.length ?? 0,
    draft: invoices.data?.filter((i) => i.status === 'draft').length ?? 0,
    sent: invoices.data?.filter((i) => i.status === 'sent').length ?? 0,
    paid: invoices.data?.filter((i) => i.status === 'paid').length ?? 0,
    overdue: invoices.data?.filter((i) => i.status === 'overdue').length ?? 0,
  };

  return (
    <div className="min-h-full relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-primary/[0.02] blur-[200px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <header className="mb-10 animate-in-up">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="space-y-2">
              <h1 className="font-display text-5xl tracking-tight">Invoices</h1>
              <p className="text-muted-foreground text-[15px]">
                Manage and track all your invoices
              </p>
            </div>
            <Button
              size="lg"
              asChild
              className="h-10 group shadow-lg shadow-primary/15 hover:shadow-primary/25 hover:-translate-y-0.5 transition-all"
            >
              <Link to="/invoices/new">
                <Plus className="h-3.5 w-3.5 mr-2" />
                New Invoice
              </Link>
            </Button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="mb-7 animate-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-wrap gap-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  statusFilter === filter.value
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                {filter.label}
                {statusFilter === 'all' &&
                  filter.value !== 'all' &&
                  totals[filter.value as keyof typeof totals] > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-50">
                      {totals[filter.value as keyof typeof totals]}
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice List */}
        <div className="animate-in-up" style={{ animationDelay: '0.15s' }}>
          {invoices.isLoading ? (
            <Card className="card-premium">
              <CardContent className="p-0 divide-y divide-border/50">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-5 px-5 py-4">
                    <div className="h-10 w-10 bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-28 bg-muted animate-pulse" />
                      <div className="h-3 w-20 bg-muted animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-muted animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : invoices.data && invoices.data.length > 0 ? (
            <Card className="card-premium overflow-hidden">
              <CardContent className="p-0 divide-y divide-border/50">
                {invoices.data.map((invoice, index) => (
                  <div
                    key={invoice._id}
                    className="group flex items-center gap-5 px-5 py-4 hover:bg-muted/20 transition-colors"
                    style={{ animationDelay: `${0.2 + index * 0.03}s` }}
                  >
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-muted/40 group-hover:bg-primary/10 transition-colors">
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <Link
                          to="/invoices/$id"
                          params={{ id: invoice._id }}
                          className="font-mono text-xs font-medium hover:text-primary transition-colors"
                        >
                          {invoice.invoiceNumber}
                        </Link>
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

                    {/* Amount */}
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="font-display text-lg tabular-nums tracking-tight">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60">
                        Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate({ to: '/invoices/$id', params: { id: invoice._id } })
                        }
                        className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
                      >
                        View
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({ to: '/invoices/$id', params: { id: invoice._id } })
                            }
                            className="cursor-pointer text-xs"
                          >
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => copyPublicLink(invoice.publicToken)}
                            className="cursor-pointer text-xs"
                          >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(invoice._id)}
                            className="cursor-pointer text-xs"
                          >
                            <Files className="h-3.5 w-3.5 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {invoice.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => handleMarkSent(invoice._id)}
                              className="cursor-pointer text-xs"
                            >
                              <Send className="h-3.5 w-3.5 mr-2" />
                              Mark as Sent
                            </DropdownMenuItem>
                          )}
                          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                            <DropdownMenuItem
                              onClick={() => handleMarkPaid(invoice._id)}
                              className="cursor-pointer text-xs text-emerald-500"
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status === 'draft' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(invoice._id)}
                                className="cursor-pointer text-xs text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="card-premium">
              <CardContent className="py-20 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-muted/40">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2">
                  {statusFilter === 'all' ? 'No invoices yet' : `No ${statusFilter} invoices`}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  {statusFilter === 'all'
                    ? 'Create your first invoice to start getting paid.'
                    : `You don't have any ${statusFilter} invoices.`}
                </p>
                {statusFilter === 'all' && (
                  <Button asChild size="lg" className="h-10">
                    <Link to="/invoices/new">
                      <Plus className="mr-2 h-3.5 w-3.5" />
                      Create Invoice
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {invoices.data && invoices.data.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-[11px] text-muted-foreground/50">
              Showing {invoices.data.length} invoice{invoices.data.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

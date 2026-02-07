import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { Badge } from '@invoice/ui/components/badge';
import { Button } from '@invoice/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@invoice/ui/components/card';
import { Separator } from '@invoice/ui/components/separator';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  Send,
  Trash2,
  Calendar,
  Building2,
  User,
  FileText,
  CreditCard,
  ExternalLink,
  Pencil,
  Files,
} from 'lucide-react';
import { toast } from 'sonner';

import { resolveTemplate } from '@/components/invoice-templates';
import { ProtectedRoute } from '@/components/protected-route';

import { DownloadPDFButton } from '../../../../components/pdf/download-pdf-button';

export const Route = createFileRoute('/_app/invoices/$id/')({
  head: () => ({
    meta: [
      { title: 'Invoice Details | Invoice' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: InvoiceDetailPage,
});

function InvoiceDetailPage() {
  return (
    <ProtectedRoute>
      <InvoiceDetailContent />
    </ProtectedRoute>
  );
}

function formatCurrency(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

function InvoiceDetailContent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const invoice = useQuery(convexQuery(api.invoices.get, { id: id as any }));
  const profile = useQuery(convexQuery(api.profiles.get, {}));
  const markSent = useConvexMutation(api.invoices.markSent);
  const markPaid = useConvexMutation(api.invoices.markPaid);
  const deleteInvoice = useConvexMutation(api.invoices.remove);
  const duplicateInvoice = useConvexMutation(api.invoices.duplicate);
  const getInvoiceNumber = useConvexMutation(api.profiles.getAndIncrementInvoiceNumber);

  const statusConfig: Record<string, { color: string; dot: string; bg: string }> = {
    draft: {
      color: 'bg-muted text-muted-foreground',
      dot: 'bg-muted-foreground',
      bg: 'bg-muted/30',
    },
    sent: { color: 'bg-blue-500/10 text-blue-500', dot: 'bg-blue-500', bg: 'bg-blue-500/5' },
    paid: {
      color: 'bg-emerald-500/10 text-emerald-500',
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-500/5',
    },
    overdue: {
      color: 'bg-destructive/10 text-destructive',
      dot: 'bg-destructive',
      bg: 'bg-destructive/5',
    },
  };

  const handleMarkSent = async () => {
    try {
      await markSent({ id: id as any });
      toast.success('Invoice marked as sent');
    } catch {
      toast.error('Failed to update invoice');
    }
  };
  const handleMarkPaid = async () => {
    try {
      await markPaid({ id: id as any });
      toast.success('Invoice marked as paid');
    } catch {
      toast.error('Failed to update invoice');
    }
  };
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await deleteInvoice({ id: id as any });
      toast.success('Invoice deleted');
      navigate({ to: '/invoices' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invoice');
    }
  };
  const handleDuplicate = async () => {
    try {
      const suggestedNumber = await getInvoiceNumber();
      const newInvoiceNumber = window.prompt('Enter invoice number:', suggestedNumber);
      if (!newInvoiceNumber) return;
      const newId = await duplicateInvoice({ id: id as any, newInvoiceNumber });
      toast.success('Invoice duplicated as draft');
      navigate({ to: '/invoices/$id', params: { id: newId } });
    } catch (error: any) {
      toast.error(error.message || 'Failed to duplicate invoice');
    }
  };
  const copyPublicLink = () => {
    if (!invoice.data) return;
    navigator.clipboard.writeText(`${window.location.origin}/i/${invoice.data.publicToken}`);
    toast.success('Link copied to clipboard');
  };

  if (invoice.isLoading) {
    return (
      <div className="min-h-full">
        <div className="container mx-auto max-w-4xl px-6 py-10">
          <div className="space-y-5 animate-pulse">
            <div className="h-8 w-32 bg-muted" />
            <div className="h-12 w-64 bg-muted" />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="h-48 bg-muted" />
              <div className="h-48 bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice.data) {
    return (
      <div className="min-h-full">
        <div className="container mx-auto max-w-4xl px-6 py-10">
          <div className="text-center py-20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-muted/40">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl mb-2">Invoice not found</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This invoice may have been deleted.
            </p>
            <Button
              onClick={() => navigate({ to: '/invoices' })}
              variant="outline"
              className="h-10"
            >
              Back to Invoices
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inv = invoice.data;
  const templateId = resolveTemplate(
    inv.invoiceTemplate,
    inv.client?.invoiceTemplate,
    (profile.data as any)?.defaultInvoiceTemplate
  );

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <Button
          variant="ghost"
          className="mb-5 gap-2 text-muted-foreground hover:text-foreground h-8 text-xs"
          onClick={() => navigate({ to: '/invoices' })}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Invoices
        </Button>

        {/* Header */}
        <div className="mb-8 animate-in-up">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-4xl tracking-tight">{inv.invoiceNumber}</h1>
                <Badge
                  className={`${statusConfig[inv.status].color} border-0 gap-1.5 text-xs px-2.5 py-0.5`}
                >
                  <span className={`h-1.5 w-1.5 ${statusConfig[inv.status].dot}`} />
                  {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[15px]">
                {inv.client?.name ?? 'Unknown client'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.data && (
                <DownloadPDFButton
                  invoice={{
                    ...inv,
                    client: inv.client ?? undefined,
                    discountType: inv.discountType ?? undefined,
                    discountValue: inv.discountValue ?? undefined,
                    notes: inv.notes ?? undefined,
                    paymentDetails: inv.paymentDetails ?? profile.data.paymentDetails ?? undefined,
                    lineItems: inv.lineItems?.map((item) => ({
                      ...item,
                      unit: item.unit ?? undefined,
                    })),
                  }}
                  profile={{
                    ...profile.data,
                    logoUrl: (profile.data as any).logoUrl ?? undefined,
                    phone: profile.data.phone ?? undefined,
                    address: profile.data.address ?? undefined,
                    city: profile.data.city ?? undefined,
                    country: profile.data.country ?? undefined,
                    postalCode: profile.data.postalCode ?? undefined,
                    website: profile.data.website ?? undefined,
                    paymentDetails: profile.data.paymentDetails ?? undefined,
                  }}
                  templateId={templateId}
                  className="gap-2 h-8 text-xs"
                />
              )}
              <Button
                variant="outline"
                onClick={copyPublicLink}
                className="gap-2 h-8 text-xs border-border/60"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </Button>
              <Button variant="outline" asChild className="gap-2 h-8 text-xs border-border/60">
                <Link to="/i/$token" params={{ token: inv.publicToken }} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Preview
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleDuplicate}
                className="gap-2 h-8 text-xs border-border/60"
              >
                <Files className="h-3.5 w-3.5" />
                Duplicate
              </Button>
              {inv.status === 'draft' && (
                <>
                  <Button
                    variant="outline"
                    className="gap-2 h-8 text-xs border-border/60"
                    onClick={() => navigate({ to: '/invoices/$id/edit', params: { id } })}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleMarkSent}
                    className="gap-2 h-8 text-xs border-border/60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Mark as Sent
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="gap-2 h-8 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </>
              )}
              {(inv.status === 'sent' || inv.status === 'overdue') && (
                <Button
                  onClick={handleMarkPaid}
                  className="gap-2 h-8 text-xs shadow-lg shadow-primary/15"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* From / To */}
        <div className="grid gap-5 md:grid-cols-2 stagger-children">
          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-[10px] font-medium text-muted-foreground/60 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                <Building2 className="h-3 w-3" />
                From
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {profile.data && (
                <div className="space-y-0.5">
                  <p className="font-semibold text-[15px]">{profile.data.displayName}</p>
                  {profile.data.address && (
                    <p className="text-xs text-muted-foreground">{profile.data.address}</p>
                  )}
                  {(profile.data.city || profile.data.country) && (
                    <p className="text-xs text-muted-foreground">
                      {[profile.data.city, profile.data.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {profile.data.email && (
                    <p className="text-xs text-muted-foreground">{profile.data.email}</p>
                  )}
                  {profile.data.phone && (
                    <p className="text-xs text-muted-foreground">{profile.data.phone}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card">
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-[10px] font-medium text-muted-foreground/60 flex items-center gap-1.5 uppercase tracking-[0.15em]">
                <User className="h-3 w-3" />
                Bill To
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {inv.client && (
                <div className="space-y-0.5">
                  <p className="font-semibold text-[15px]">{inv.client.name}</p>
                  {inv.client.address && (
                    <p className="text-xs text-muted-foreground">{inv.client.address}</p>
                  )}
                  {(inv.client.city || inv.client.country) && (
                    <p className="text-xs text-muted-foreground">
                      {[inv.client.city, inv.client.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">{inv.client.email}</p>
                  {inv.client.phone && (
                    <p className="text-xs text-muted-foreground">{inv.client.phone}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Dates */}
        <Card
          className="mt-5 border-border/60 bg-card animate-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          <CardContent className="py-4 px-5">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-muted/40">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em]">
                    Invoice Number
                  </p>
                  <p className="text-sm font-medium font-mono">{inv.invoiceNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-muted/40">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em]">
                    Issue Date
                  </p>
                  <p className="text-sm font-medium">{formatDate(inv.issueDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center ${inv.status === 'overdue' ? 'bg-destructive/10' : 'bg-muted/40'}`}
                >
                  <Calendar
                    className={`h-4 w-4 ${inv.status === 'overdue' ? 'text-destructive' : 'text-muted-foreground'}`}
                  />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.15em]">
                    Due Date
                  </p>
                  <p
                    className={`text-sm font-medium ${inv.status === 'overdue' ? 'text-destructive' : ''}`}
                  >
                    {formatDate(inv.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card
          className="mt-5 border-border/60 bg-card overflow-hidden animate-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <CardHeader className="border-b border-border/40 bg-muted/20 py-3 px-5">
            <CardTitle className="text-sm">Line Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/10">
                    <th className="px-5 py-3 text-left text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                      Description
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                      Qty
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                      Unit
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                      Rate
                    </th>
                    <th className="px-5 py-3 text-right text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.15em]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inv.lineItems?.map((item) => (
                    <tr key={item._id} className="border-b border-border/30 last:border-0">
                      <td className="px-5 py-3.5 text-sm font-medium">{item.description}</td>
                      <td className="px-5 py-3.5 text-sm text-right tabular-nums text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{item.unit}</td>
                      <td className="px-5 py-3.5 text-sm text-right tabular-nums text-muted-foreground">
                        {formatCurrency(item.unitPrice, inv.currency)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right font-medium tabular-nums">
                        {formatCurrency(item.total, inv.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-border/40 bg-muted/10 p-5">
              <div className="flex justify-end">
                <div className="w-64 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(inv.subtotal, inv.currency)}
                    </span>
                  </div>
                  {inv.taxRate > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tax ({inv.taxRate}%)</span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(inv.taxAmount, inv.currency)}
                      </span>
                    </div>
                  )}
                  {inv.discountAmount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium tabular-nums text-destructive">
                        -{formatCurrency(inv.discountAmount, inv.currency)}
                      </span>
                    </div>
                  )}
                  <Separator className="bg-border/40" />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="font-display text-2xl text-primary tabular-nums">
                      {formatCurrency(inv.total, inv.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {inv.notes && (
          <Card
            className="mt-5 border-border/60 bg-card animate-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            <CardHeader className="py-3 px-5">
              <CardTitle className="text-sm">Notes</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{inv.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Payment Details */}
        {(inv.paymentDetails || profile.data?.paymentDetails) && (
          <Card
            className="mt-5 border-primary/20 bg-primary/5 animate-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <CardHeader className="pb-2 pt-4 px-5">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <p className="whitespace-pre-wrap text-xs font-mono text-foreground/80">
                {inv.paymentDetails || profile.data?.paymentDetails}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

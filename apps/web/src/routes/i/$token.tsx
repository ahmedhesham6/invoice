import { convexQuery } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { Badge } from '@invoice/ui/components/badge';
import { Card, CardContent } from '@invoice/ui/components/card';
import { Separator } from '@invoice/ui/components/separator';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  User,
} from 'lucide-react';

import { SITE_NAME } from '@/lib/seo';

import { DownloadPDFButton } from '../../components/pdf/download-pdf-button';

export const Route = createFileRoute('/i/$token')({
  head: () => ({
    meta: [
      { title: `Invoice | ${SITE_NAME}` },
      {
        name: 'description',
        content:
          'View and download this professional invoice. Powered by Invoice — the open-source invoicing platform for freelancers.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: PublicInvoicePage,
});

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

function PublicInvoicePage() {
  const { token } = Route.useParams();
  const invoice = useQuery(convexQuery(api.invoices.getByToken, { token }));

  const statusConfig: Record<
    string,
    { color: string; dot: string; icon: React.ElementType; label: string }
  > = {
    draft: {
      color: 'bg-muted text-muted-foreground',
      dot: 'bg-muted-foreground',
      icon: Clock,
      label: 'Draft',
    },
    sent: {
      color: 'bg-blue-500/10 text-blue-500',
      dot: 'bg-blue-500',
      icon: Clock,
      label: 'Awaiting Payment',
    },
    paid: {
      color: 'bg-emerald-500/10 text-emerald-500',
      dot: 'bg-emerald-500',
      icon: CheckCircle,
      label: 'Paid',
    },
    overdue: {
      color: 'bg-destructive/10 text-destructive',
      dot: 'bg-destructive',
      icon: AlertTriangle,
      label: 'Overdue',
    },
  };

  if (invoice.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 bg-muted animate-pulse mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice.data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-muted/40">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mb-2 font-display text-2xl">Invoice Not Found</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            This invoice may have been deleted or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  const inv = invoice.data;
  const profile = inv.profile;
  const StatusIcon = statusConfig[inv.status].icon;

  return (
    <div className="min-h-screen bg-background py-8 px-4 relative">
      {/* Subtle ambient glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.03] blur-[200px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-3xl">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between animate-in-down">
          <Badge className={`${statusConfig[inv.status].color} border-0 gap-2 text-xs px-3 py-1.5`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig[inv.status].label}
          </Badge>
          {profile && (
            <DownloadPDFButton
              invoice={{
                ...inv,
                client: inv.client ?? undefined,
                discountType: inv.discountType ?? undefined,
                discountValue: inv.discountValue ?? undefined,
                notes: inv.notes ?? undefined,
                paymentDetails: inv.paymentDetails ?? profile.paymentDetails ?? undefined,
                lineItems: inv.lineItems?.map((item) => ({
                  ...item,
                  unit: item.unit ?? undefined,
                })),
              }}
              profile={{
                ...profile,
                logoUrl: profile.logoUrl ?? undefined,
                phone: profile.phone ?? undefined,
                address: profile.address ?? undefined,
                city: profile.city ?? undefined,
                country: profile.country ?? undefined,
                postalCode: profile.postalCode ?? undefined,
                website: profile.website ?? undefined,
                paymentDetails: profile.paymentDetails ?? undefined,
              }}
              className="gap-2 h-8 text-xs shadow-lg shadow-primary/15"
            />
          )}
        </div>

        {/* Invoice Card */}
        <Card
          className="border-border/60 bg-card shadow-xl shadow-black/5 dark:shadow-black/20 overflow-hidden animate-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <CardContent className="p-0">
            {/* Invoice Header */}
            <div className="p-8 pb-6 border-b border-border/40 relative">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  {profile?.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt="Logo"
                      className="h-12 w-auto object-contain mb-4"
                    />
                  ) : null}
                  <h1 className="font-display text-4xl tracking-tight text-foreground">INVOICE</h1>
                  <p className="text-lg text-muted-foreground mt-1 font-mono">
                    {inv.invoiceNumber}
                  </p>
                </div>
                <div className="text-left md:text-right space-y-2">
                  <div className="flex items-center gap-2 md:justify-end text-xs">
                    <Calendar className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-muted-foreground/60">Issued:</span>
                    <span className="font-medium">{formatDate(inv.issueDate)}</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 md:justify-end text-xs ${inv.status === 'overdue' ? 'text-destructive' : ''}`}
                  >
                    <Calendar className="h-3 w-3" />
                    <span className={inv.status === 'overdue' ? '' : 'text-muted-foreground/60'}>
                      Due:
                    </span>
                    <span className="font-medium">{formatDate(inv.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* From / To */}
            <div className="p-8 grid gap-8 md:grid-cols-2 border-b border-border/40">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Building2 className="h-3 w-3 text-muted-foreground/40" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
                    From
                  </p>
                </div>
                {profile && (
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[15px]">{profile.displayName}</p>
                    {profile.address && (
                      <p className="text-xs text-muted-foreground">{profile.address}</p>
                    )}
                    {(profile.city || profile.country) && (
                      <p className="text-xs text-muted-foreground">
                        {[profile.city, profile.postalCode, profile.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {profile.email && (
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    )}
                    {profile.phone && (
                      <p className="text-xs text-muted-foreground">{profile.phone}</p>
                    )}
                    {profile.taxId && (
                      <p className="text-[10px] text-muted-foreground/60 mt-2">
                        Tax ID: {profile.taxId}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <User className="h-3 w-3 text-muted-foreground/40" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
                    Bill To
                  </p>
                </div>
                {inv.client && (
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[15px]">{inv.client.name}</p>
                    {inv.client.address && (
                      <p className="text-xs text-muted-foreground">{inv.client.address}</p>
                    )}
                    {(inv.client.city || inv.client.country) && (
                      <p className="text-xs text-muted-foreground">
                        {[inv.client.city, inv.client.postalCode, inv.client.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{inv.client.email}</p>
                    {inv.client.phone && (
                      <p className="text-xs text-muted-foreground">{inv.client.phone}</p>
                    )}
                    {inv.client.taxId && (
                      <p className="text-[10px] text-muted-foreground/60 mt-2">
                        Tax ID: {inv.client.taxId}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-8 py-3.5 text-left text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
                      Description
                    </th>
                    <th className="px-4 py-3.5 text-right text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
                      Qty
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
                      Unit
                    </th>
                    <th className="px-4 py-3.5 text-right text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
                      Rate
                    </th>
                    <th className="px-8 py-3.5 text-right text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inv.lineItems?.map((item) => (
                    <tr key={item._id} className="border-b border-border/20 last:border-0">
                      <td className="px-8 py-4 text-sm font-medium">{item.description}</td>
                      <td className="px-4 py-4 text-sm text-right tabular-nums text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {item.unit || '—'}
                      </td>
                      <td className="px-4 py-4 text-sm text-right tabular-nums text-muted-foreground">
                        {formatCurrency(item.unitPrice, inv.currency)}
                      </td>
                      <td className="px-8 py-4 text-sm text-right font-medium tabular-nums">
                        {formatCurrency(item.total, inv.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-8 bg-muted/10 border-t border-border/40">
              <div className="flex justify-end">
                <div className="w-72 space-y-2.5">
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
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-semibold">Total Due</span>
                    <span className="font-display text-3xl text-primary tabular-nums">
                      {formatCurrency(inv.total, inv.currency)}
                    </span>
                  </div>

                  {/* Status Banner */}
                  {inv.status === 'paid' && (
                    <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-emerald-500">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-semibold text-sm tracking-wide uppercase">Paid</span>
                      </div>
                    </div>
                  )}
                  {inv.status === 'overdue' && (
                    <div className="mt-4 bg-destructive/10 border border-destructive/20 p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-semibold text-sm tracking-wide uppercase">
                          Payment Overdue
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {inv.notes && (
              <div className="px-8 py-5 border-t border-border/40">
                <p className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">
                  Notes
                </p>
                <p className="whitespace-pre-wrap text-sm text-foreground/80">{inv.notes}</p>
              </div>
            )}

            {/* Payment Details */}
            {(inv.paymentDetails || profile?.paymentDetails) && (
              <div className="px-8 py-5 border-t border-border/40 bg-primary/5">
                <p className="text-[10px] font-medium text-primary/60 uppercase tracking-[0.2em] mb-2">
                  Payment Details
                </p>
                <p className="whitespace-pre-wrap text-xs font-mono text-foreground/80">
                  {inv.paymentDetails || profile?.paymentDetails}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-[11px] text-muted-foreground/40">Thank you for your business</p>
        </div>
      </div>
    </div>
  );
}

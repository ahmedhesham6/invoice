import { convexQuery } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { FileText } from 'lucide-react';

import { SITE_NAME } from '@/lib/seo';

import { InvoiceTemplate, resolveTemplate } from '../../components/invoice-templates';
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

function PublicInvoicePage() {
  const { token } = Route.useParams();
  const invoice = useQuery(convexQuery(api.invoices.getByToken, { token }));

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
  const templateId = resolveTemplate(
    inv.invoiceTemplate,
    inv.client?.invoiceTemplate,
    profile?.defaultInvoiceTemplate
  );

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating action bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="container mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">{inv.invoiceNumber}</span>
            <StatusDot status={inv.status} />
          </div>
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
              templateId={templateId}
              className="gap-2 h-8 text-xs shadow-lg shadow-primary/15"
            />
          )}
        </div>
      </div>

      {/* Invoice Template */}
      <div className="container mx-auto max-w-3xl py-6 px-4">
        <div className="shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in-up">
          <InvoiceTemplate
            templateId={templateId}
            invoice={{
              ...inv,
              client: inv.client ?? undefined,
              discountType: inv.discountType ?? undefined,
              discountValue: inv.discountValue ?? undefined,
              notes: inv.notes ?? undefined,
              paymentDetails: inv.paymentDetails ?? profile?.paymentDetails ?? undefined,
              lineItems: inv.lineItems?.map((item) => ({
                ...item,
                unit: item.unit ?? undefined,
              })),
            }}
            profile={
              profile
                ? {
                    ...profile,
                    logoUrl: profile.logoUrl ?? undefined,
                    phone: profile.phone ?? undefined,
                    address: profile.address ?? undefined,
                    city: profile.city ?? undefined,
                    country: profile.country ?? undefined,
                    postalCode: profile.postalCode ?? undefined,
                    website: profile.website ?? undefined,
                    paymentDetails: profile.paymentDetails ?? undefined,
                    taxId: profile.taxId ?? undefined,
                  }
                : { displayName: '', email: '' }
            }
          />
        </div>

        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-[10px] text-muted-foreground/40">Powered by Invoice</p>
        </div>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'bg-muted-foreground',
    sent: 'bg-blue-500',
    paid: 'bg-emerald-500',
    overdue: 'bg-destructive',
  };
  const labels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Awaiting Payment',
    paid: 'Paid',
    overdue: 'Overdue',
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span
        className={`h-1.5 w-1.5 ${colors[status] || colors.draft}`}
        style={{ borderRadius: '50%' }}
      />
      {labels[status] || status}
    </span>
  );
}

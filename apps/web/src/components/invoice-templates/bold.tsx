/**
 * BOLD — Heavy type, vibrant orange accent, brutalist grid energy.
 * Think: creative agency billing. Unapologetically loud.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

const ACCENT = '#ff5722';
const DARK = '#111';

export function BoldTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="bg-white text-[#111] min-h-full"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      {/* Massive header */}
      <div className="px-10 pt-10 pb-8" style={{ background: DARK }}>
        <div className="flex justify-between items-start">
          <div>
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt=""
                className="h-10 w-auto object-contain mb-4 brightness-0 invert"
              />
            )}
            <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
              INVOICE
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm font-mono text-white/60">{invoice.invoiceNumber}</span>
              <StatusPill status={invoice.status} />
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-6xl font-black tabular-nums tracking-tighter leading-none"
              style={{ color: ACCENT }}
            >
              {formatCurrency(invoice.total, invoice.currency)}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-2">Total Due</p>
          </div>
        </div>
      </div>

      {/* Orange date strip */}
      <div
        className="px-10 py-3 flex gap-8 text-xs text-white font-medium"
        style={{ background: ACCENT }}
      >
        <span>Issued: {formatDate(invoice.issueDate)}</span>
        <span>Due: {formatDate(invoice.dueDate)}</span>
        <span className="ml-auto">{invoice.currency}</span>
      </div>

      {/* Addresses */}
      <div className="px-10 py-8 grid grid-cols-2 gap-10">
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
            style={{ color: ACCENT }}
          >
            From
          </p>
          <p className="text-base font-bold">{profile.displayName}</p>
          <div className="text-xs text-[#666] mt-1 space-y-px">
            {profile.address && <p>{profile.address}</p>}
            {(profile.city || profile.country) && (
              <p>
                {[profile.city, profile.postalCode, profile.country].filter(Boolean).join(', ')}
              </p>
            )}
            {profile.email && <p>{profile.email}</p>}
            {profile.phone && <p>{profile.phone}</p>}
          </div>
        </div>
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.25em] mb-2"
            style={{ color: ACCENT }}
          >
            Bill To
          </p>
          {invoice.client && (
            <>
              <p className="text-base font-bold">{invoice.client.name}</p>
              <div className="text-xs text-[#666] mt-1 space-y-px">
                {invoice.client.address && <p>{invoice.client.address}</p>}
                {(invoice.client.city || invoice.client.country) && (
                  <p>
                    {[invoice.client.city, invoice.client.postalCode, invoice.client.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                <p>{invoice.client.email}</p>
                {invoice.client.phone && <p>{invoice.client.phone}</p>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Line Items — bold header */}
      <div className="px-10">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `3px solid ${DARK}` }}>
              <th className="pb-2 text-left text-[10px] font-black uppercase tracking-[0.15em]">
                Item
              </th>
              <th className="pb-2 text-right text-[10px] font-black uppercase tracking-[0.15em]">
                Qty
              </th>
              <th className="pb-2 text-left text-[10px] font-black uppercase tracking-[0.15em]">
                Unit
              </th>
              <th className="pb-2 text-right text-[10px] font-black uppercase tracking-[0.15em]">
                Rate
              </th>
              <th className="pb-2 text-right text-[10px] font-black uppercase tracking-[0.15em]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems?.map((item) => (
              <tr key={item._id} className="border-b border-[#eee]">
                <td className="py-3.5 text-sm font-semibold">{item.description}</td>
                <td className="py-3.5 text-sm text-right text-[#555] tabular-nums">
                  {item.quantity}
                </td>
                <td className="py-3.5 text-xs text-[#999]">{item.unit || '—'}</td>
                <td className="py-3.5 text-sm text-right text-[#555] tabular-nums">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="py-3.5 text-sm text-right font-bold tabular-nums">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-10 py-6">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#999]">Subtotal</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Tax ({invoice.taxRate}%)</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.taxAmount, invoice.currency)}
                </span>
              </div>
            )}
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#999]">Discount</span>
                <span className="tabular-nums text-red-500">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div style={{ borderTop: `3px solid ${DARK}` }} className="pt-3 mt-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black tabular-nums" style={{ color: ACCENT }}>
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 pb-10 space-y-4">
        {invoice.notes && (
          <div className="border-l-4 pl-4" style={{ borderColor: ACCENT }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#bbb] mb-1">
              Notes
            </p>
            <p className="text-xs text-[#666] whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
        {(invoice.paymentDetails || profile.paymentDetails) && (
          <div className="bg-[#111] text-white p-5">
            <p
              className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
              style={{ color: ACCENT }}
            >
              Payment Details
            </p>
            <p className="text-xs font-mono text-white/70 whitespace-pre-wrap">
              {invoice.paymentDetails || profile.paymentDetails}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    draft: { bg: '#333', text: '#999' },
    sent: { bg: '#1e40af', text: '#93c5fd' },
    paid: { bg: '#065f46', text: '#6ee7b7' },
    overdue: { bg: '#991b1b', text: '#fca5a5' },
  };
  const s = styles[status] || styles.draft;
  return (
    <span
      className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

/**
 * MONO — Pure black & white, editorial magazine aesthetic.
 * Think: Kinfolk magazine meets Swiss design. Dramatic contrast, rigid grid.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

export function MonoTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="bg-white text-black min-h-full"
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* Giant stacked header */}
      <div className="bg-black text-white px-10 pt-12 pb-10">
        <div className="flex justify-between items-end">
          <div>
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt=""
                className="h-8 w-auto object-contain mb-6 brightness-0 invert"
              />
            )}
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-2">Invoice</p>
            <h1 className="text-6xl font-bold tracking-tighter leading-none">
              {invoice.invoiceNumber}
            </h1>
          </div>
          <div className="text-right">
            <MonoStatus status={invoice.status} />
            <p className="text-4xl font-bold tabular-nums mt-4 tracking-tight">
              {formatCurrency(invoice.total, invoice.currency)}
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-1">Total Due</p>
          </div>
        </div>
      </div>

      {/* Dates bar */}
      <div className="px-10 py-3 flex gap-10 text-[10px] uppercase tracking-[0.2em] text-black/40 border-b border-black/10 bg-[#fafafa]">
        <span>Issued {formatDate(invoice.issueDate)}</span>
        <span>Due {formatDate(invoice.dueDate)}</span>
        <span className="ml-auto">{invoice.currency}</span>
      </div>

      {/* Addresses — two column, extremely stark */}
      <div className="px-10 py-8 grid grid-cols-2 gap-16 border-b border-black/10">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-black/30 mb-3">From</p>
          <p className="text-sm font-bold leading-tight">{profile.displayName}</p>
          <div className="text-[11px] text-black/50 mt-1.5 space-y-px leading-relaxed">
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
          <p className="text-[9px] uppercase tracking-[0.4em] text-black/30 mb-3">To</p>
          {invoice.client && (
            <>
              <p className="text-sm font-bold leading-tight">{invoice.client.name}</p>
              <div className="text-[11px] text-black/50 mt-1.5 space-y-px leading-relaxed">
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

      {/* Line Items — strict grid */}
      <div className="px-10 py-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="pb-2 text-left text-[9px] font-bold uppercase tracking-[0.15em]">
                Description
              </th>
              <th className="pb-2 text-right text-[9px] font-bold uppercase tracking-[0.15em]">
                Qty
              </th>
              <th className="pb-2 text-left text-[9px] font-bold uppercase tracking-[0.15em] pl-4">
                Unit
              </th>
              <th className="pb-2 text-right text-[9px] font-bold uppercase tracking-[0.15em]">
                Rate
              </th>
              <th className="pb-2 text-right text-[9px] font-bold uppercase tracking-[0.15em]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems?.map((item) => (
              <tr key={item._id} className="border-b border-black/8">
                <td className="py-3 text-[13px]">{item.description}</td>
                <td className="py-3 text-[13px] text-right tabular-nums text-black/50">
                  {item.quantity}
                </td>
                <td className="py-3 text-[11px] text-black/35 pl-4">{item.unit || '—'}</td>
                <td className="py-3 text-[13px] text-right tabular-nums text-black/50">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="py-3 text-[13px] text-right tabular-nums font-bold">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-10 pb-8">
        <div className="flex justify-end">
          <div className="w-56 space-y-1.5 text-[12px]">
            <div className="flex justify-between text-black/40">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-black/40">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.taxAmount, invoice.currency)}
                </span>
              </div>
            )}
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-black/40">
                <span>Discount</span>
                <span className="tabular-nums">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div className="border-t-2 border-black pt-2 mt-2" />
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] uppercase tracking-[0.3em] text-black/40">Total</span>
              <span className="text-2xl font-bold tabular-nums tracking-tight">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 pb-10 space-y-5">
        {invoice.notes && (
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-black/30 mb-1.5">Notes</p>
            <p className="text-[12px] text-black/50 whitespace-pre-wrap leading-relaxed">
              {invoice.notes}
            </p>
          </div>
        )}
        {(invoice.paymentDetails || profile.paymentDetails) && (
          <div className="bg-black text-white p-5">
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-2">Payment</p>
            <p className="text-[11px] font-mono text-white/70 whitespace-pre-wrap leading-relaxed">
              {invoice.paymentDetails || profile.paymentDetails}
            </p>
          </div>
        )}
      </div>

      <div className="h-1 bg-black" />
    </div>
  );
}

function MonoStatus({ status }: { status: string }) {
  const isPaid = status === 'paid';
  const isOverdue = status === 'overdue';
  return (
    <span
      className="inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border"
      style={{
        borderColor: isPaid ? '#fff' : isOverdue ? '#ff4444' : 'rgba(255,255,255,0.3)',
        color: isPaid ? '#fff' : isOverdue ? '#ff4444' : 'rgba(255,255,255,0.5)',
      }}
    >
      {status}
    </span>
  );
}

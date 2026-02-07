/**
 * MINIMAL — Stark whitespace, ultra-thin lines, whisper-quiet hierarchy.
 * Think: Scandinavian design studio. Lots of air.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

export function MinimalTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="bg-white text-[#2c2c2c] min-h-full"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', system-ui, sans-serif" }}
    >
      <div className="px-12 py-12">
        {/* Header — extreme simplicity */}
        <div className="flex justify-between items-baseline mb-16">
          <div>
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt=""
                className="h-8 w-auto object-contain mb-6 opacity-80"
              />
            ) : null}
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#b0b0b0]">Invoice</p>
            <p className="text-xs text-[#999] mt-0.5 font-mono">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right text-xs text-[#aaa] space-y-0.5">
            <p>{formatDate(invoice.issueDate)}</p>
            <p>Due {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Addresses — side by side, very minimal */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#ccc] mb-3">From</p>
            <p className="text-[13px] font-medium">{profile.displayName}</p>
            <div className="text-[11px] text-[#999] mt-1 space-y-px leading-relaxed">
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
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#ccc] mb-3">To</p>
            {invoice.client && (
              <>
                <p className="text-[13px] font-medium">{invoice.client.name}</p>
                <div className="text-[11px] text-[#999] mt-1 space-y-px leading-relaxed">
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

        {/* Line Items — ultra clean */}
        <div className="mb-12">
          <div className="border-b border-[#eee] pb-2 mb-0">
            <div className="grid grid-cols-[1fr_60px_60px_80px_90px] gap-4 text-[9px] uppercase tracking-[0.25em] text-[#ccc]">
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span>Unit</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
            </div>
          </div>
          {invoice.lineItems?.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_60px_60px_80px_90px] gap-4 py-3.5 border-b border-[#f5f5f5]"
            >
              <span className="text-[13px]">{item.description}</span>
              <span className="text-[13px] text-right text-[#999] tabular-nums">
                {item.quantity}
              </span>
              <span className="text-[11px] text-[#bbb]">{item.unit || '—'}</span>
              <span className="text-[13px] text-right text-[#999] tabular-nums">
                {formatCurrency(item.unitPrice, invoice.currency)}
              </span>
              <span className="text-[13px] text-right tabular-nums">
                {formatCurrency(item.total, invoice.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals — right-aligned, quiet */}
        <div className="flex justify-end mb-16">
          <div className="w-56 space-y-2">
            <div className="flex justify-between text-[12px] text-[#999]">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-[12px] text-[#999]">
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.taxAmount, invoice.currency)}
                </span>
              </div>
            )}
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-[12px] text-[#999]">
                <span>Discount</span>
                <span className="tabular-nums">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div className="border-t border-[#e0e0e0] pt-3 mt-3" />
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#aaa]">Total</span>
              <span className="text-2xl font-light tabular-nums tracking-tight">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer content */}
        <div className="space-y-6 pt-8 border-t border-[#f0f0f0]">
          {invoice.notes && (
            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#ccc] mb-1.5">Notes</p>
              <p className="text-[12px] text-[#888] whitespace-pre-wrap leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}
          {(invoice.paymentDetails || profile.paymentDetails) && (
            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] text-[#ccc] mb-1.5">Payment</p>
              <p className="text-[11px] font-mono text-[#888] whitespace-pre-wrap leading-relaxed">
                {invoice.paymentDetails || profile.paymentDetails}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * RETRO — Warm earth tones, rounded shapes, vintage receipt vibes.
 * Think: indie coffee shop or vinyl record store invoice. Nostalgic warmth.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

const BROWN = '#6b4423';
const WARM_BG = '#fdf6ee';
const RUST = '#c5632d';

export function RetroTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="min-h-full"
      style={{ fontFamily: "'Courier New', Courier, monospace", background: WARM_BG, color: BROWN }}
    >
      {/* Dashed top border — like a receipt tear */}
      <div className="px-8 pt-2">
        <div className="border-t-2 border-dashed" style={{ borderColor: `${BROWN}30` }} />
      </div>

      <div className="px-10 py-8">
        {/* Header — retro centered */}
        <div className="text-center mb-10">
          {profile.logoUrl && (
            <img
              src={profile.logoUrl}
              alt=""
              className="h-10 w-auto object-contain mx-auto mb-4 sepia"
            />
          )}
          <div className="inline-block border-2 px-6 py-3" style={{ borderColor: BROWN }}>
            <h1 className="text-2xl font-bold tracking-[0.3em] uppercase">Invoice</h1>
          </div>
          <p className="text-sm mt-3 tracking-widest">{invoice.invoiceNumber}</p>
          <div
            className="flex items-center justify-center gap-2 mt-4 text-xs"
            style={{ color: `${BROWN}88` }}
          >
            <span>✦</span>
            <span>{formatDate(invoice.issueDate)}</span>
            <span>—</span>
            <span>Due: {formatDate(invoice.dueDate)}</span>
            <span>✦</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          <span
            className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] border-2 border-dashed"
            style={{
              borderColor:
                invoice.status === 'paid'
                  ? '#2e7d32'
                  : invoice.status === 'overdue'
                    ? '#c62828'
                    : RUST,
              color:
                invoice.status === 'paid'
                  ? '#2e7d32'
                  : invoice.status === 'overdue'
                    ? '#c62828'
                    : RUST,
            }}
          >
            ● {invoice.status} ●
          </span>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="p-4 border border-dashed" style={{ borderColor: `${BROWN}30` }}>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
              style={{ color: RUST }}
            >
              ★ From
            </p>
            <p className="text-sm font-bold">{profile.displayName}</p>
            <div className="text-xs mt-1 space-y-px" style={{ color: `${BROWN}bb` }}>
              {profile.address && <p>{profile.address}</p>}
              {(profile.city || profile.country) && (
                <p>
                  {[profile.city, profile.postalCode, profile.country].filter(Boolean).join(', ')}
                </p>
              )}
              {profile.email && <p>{profile.email}</p>}
              {profile.phone && <p>Tel: {profile.phone}</p>}
            </div>
          </div>
          <div className="p-4 border border-dashed" style={{ borderColor: `${BROWN}30` }}>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
              style={{ color: RUST }}
            >
              ★ Bill To
            </p>
            {invoice.client && (
              <>
                <p className="text-sm font-bold">{invoice.client.name}</p>
                <div className="text-xs mt-1 space-y-px" style={{ color: `${BROWN}bb` }}>
                  {invoice.client.address && <p>{invoice.client.address}</p>}
                  {(invoice.client.city || invoice.client.country) && (
                    <p>
                      {[invoice.client.city, invoice.client.postalCode, invoice.client.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                  <p>{invoice.client.email}</p>
                  {invoice.client.phone && <p>Tel: {invoice.client.phone}</p>}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Decorative divider */}
        <div className="text-center text-xs mb-6" style={{ color: `${BROWN}44` }}>
          ═══════════════════════════════════
        </div>

        {/* Line Items — typewriter style */}
        <div className="mb-8">
          <div className="border-b-2 pb-2 mb-0" style={{ borderColor: BROWN }}>
            <div className="grid grid-cols-[1fr_50px_50px_80px_90px] gap-2 text-[10px] font-bold uppercase tracking-wider">
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
              className="grid grid-cols-[1fr_50px_50px_80px_90px] gap-2 py-3 border-b border-dotted"
              style={{ borderColor: `${BROWN}25` }}
            >
              <span className="text-xs font-medium">{item.description}</span>
              <span className="text-xs text-right tabular-nums" style={{ color: `${BROWN}aa` }}>
                {item.quantity}
              </span>
              <span className="text-[10px]" style={{ color: `${BROWN}88` }}>
                {item.unit || '—'}
              </span>
              <span className="text-xs text-right tabular-nums" style={{ color: `${BROWN}aa` }}>
                {formatCurrency(item.unitPrice, invoice.currency)}
              </span>
              <span className="text-xs text-right font-bold tabular-nums">
                {formatCurrency(item.total, invoice.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals — receipt style */}
        <div className="flex justify-end mb-10">
          <div className="w-60">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span style={{ color: `${BROWN}88` }}>Subtotal ..........</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: `${BROWN}88` }}>Tax ({invoice.taxRate}%) .....</span>
                  <span className="tabular-nums">
                    {formatCurrency(invoice.taxAmount, invoice.currency)}
                  </span>
                </div>
              )}
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: `${BROWN}88` }}>Discount ........</span>
                  <span className="tabular-nums" style={{ color: '#c62828' }}>
                    -{formatCurrency(invoice.discountAmount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-double pt-2 mt-2" style={{ borderColor: BROWN }} />
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-[11px]">Total</span>
                <span className="text-xl font-bold tabular-nums" style={{ color: RUST }}>
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Payment */}
        <div className="space-y-5">
          {invoice.notes && (
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1"
                style={{ color: RUST }}
              >
                ✎ Notes
              </p>
              <p
                className="text-xs whitespace-pre-wrap leading-relaxed"
                style={{ color: `${BROWN}bb` }}
              >
                {invoice.notes}
              </p>
            </div>
          )}
          {(invoice.paymentDetails || profile.paymentDetails) && (
            <div
              className="p-4 border-2 border-dashed"
              style={{ borderColor: `${RUST}40`, background: `${RUST}08` }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                style={{ color: RUST }}
              >
                $ Payment Info
              </p>
              <p
                className="text-[11px] whitespace-pre-wrap leading-relaxed"
                style={{ color: `${BROWN}bb` }}
              >
                {invoice.paymentDetails || profile.paymentDetails}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-[10px]" style={{ color: `${BROWN}55` }}>
          <p>✦ Thank you kindly for your business ✦</p>
        </div>
      </div>

      <div className="px-8 pb-2">
        <div className="border-b-2 border-dashed" style={{ borderColor: `${BROWN}30` }} />
      </div>
    </div>
  );
}

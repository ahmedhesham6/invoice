/**
 * NEON — Dark background, glowing cyan/magenta accents, cyberpunk vibes.
 * Think: tech startup, game studio, digital agency. Electric and futuristic.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

const BG = '#0a0a0f';
const SURFACE = '#12121a';
const CYAN = '#00e5ff';
const MAGENTA = '#ff2d78';
const TEXT = '#e0e0e8';
const MUTED = '#555568';

export function NeonTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="min-h-full"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        background: BG,
        color: TEXT,
      }}
    >
      {/* Glow bar */}
      <div
        className="h-0.5"
        style={{ background: `linear-gradient(90deg, ${MAGENTA}, ${CYAN})` }}
      />

      <div className="px-10 py-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt=""
                className="h-9 w-auto object-contain mb-4 brightness-110"
              />
            )}
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: CYAN, textShadow: `0 0 20px ${CYAN}40, 0 0 40px ${CYAN}20` }}
            >
              INVOICE
            </h1>
            <p className="text-xs mt-1.5" style={{ color: MUTED }}>
              {invoice.invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <NeonStatus status={invoice.status} />
            <div className="mt-4 space-y-0.5 text-[11px]" style={{ color: MUTED }}>
              <p>Issued: {formatDate(invoice.issueDate)}</p>
              <p>Due: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="p-5 border" style={{ background: SURFACE, borderColor: `${CYAN}20` }}>
            <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: CYAN }}>
              // FROM
            </p>
            <p className="text-sm font-semibold">{profile.displayName}</p>
            <div className="text-[11px] mt-1.5 space-y-px" style={{ color: MUTED }}>
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
          <div className="p-5 border" style={{ background: SURFACE, borderColor: `${MAGENTA}20` }}>
            <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: MAGENTA }}>
              // BILL TO
            </p>
            {invoice.client && (
              <>
                <p className="text-sm font-semibold">{invoice.client.name}</p>
                <div className="text-[11px] mt-1.5 space-y-px" style={{ color: MUTED }}>
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

        {/* Line Items */}
        <div className="mb-10">
          <div className="mb-0">
            <div
              className="grid grid-cols-[1fr_60px_60px_90px_100px] gap-3 py-2.5 px-4 text-[9px] uppercase tracking-[0.2em]"
              style={{ background: SURFACE, color: CYAN, borderBottom: `1px solid ${CYAN}30` }}
            >
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
              className="grid grid-cols-[1fr_60px_60px_90px_100px] gap-3 py-3 px-4 border-b"
              style={{ borderColor: `${MUTED}20` }}
            >
              <span className="text-xs">{item.description}</span>
              <span className="text-xs text-right tabular-nums" style={{ color: MUTED }}>
                {item.quantity}
              </span>
              <span className="text-[10px]" style={{ color: MUTED }}>
                {item.unit || '—'}
              </span>
              <span className="text-xs text-right tabular-nums" style={{ color: MUTED }}>
                {formatCurrency(item.unitPrice, invoice.currency)}
              </span>
              <span className="text-xs text-right font-semibold tabular-nums">
                {formatCurrency(item.total, invoice.currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-72 p-5" style={{ background: SURFACE, border: `1px solid ${CYAN}15` }}>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between" style={{ color: MUTED }}>
                <span>Subtotal</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between" style={{ color: MUTED }}>
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span className="tabular-nums">
                    {formatCurrency(invoice.taxAmount, invoice.currency)}
                  </span>
                </div>
              )}
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: MUTED }}>Discount</span>
                  <span className="tabular-nums" style={{ color: MAGENTA }}>
                    -{formatCurrency(invoice.discountAmount, invoice.currency)}
                  </span>
                </div>
              )}
              <div
                className="h-px my-2"
                style={{ background: `linear-gradient(90deg, ${CYAN}50, ${MAGENTA}50)` }}
              />
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: MUTED }}>
                  Total
                </span>
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: CYAN, textShadow: `0 0 15px ${CYAN}30` }}
                >
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Payment */}
        <div className="space-y-5">
          {invoice.notes && (
            <div className="pl-4 border-l-2" style={{ borderColor: CYAN }}>
              <p className="text-[9px] uppercase tracking-[0.3em] mb-1.5" style={{ color: CYAN }}>
                // Notes
              </p>
              <p
                className="text-[11px] whitespace-pre-wrap leading-relaxed"
                style={{ color: MUTED }}
              >
                {invoice.notes}
              </p>
            </div>
          )}
          {(invoice.paymentDetails || profile.paymentDetails) && (
            <div className="p-5" style={{ background: SURFACE, border: `1px solid ${MAGENTA}20` }}>
              <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: MAGENTA }}>
                // Payment
              </p>
              <p
                className="text-[11px] whitespace-pre-wrap leading-relaxed"
                style={{ color: MUTED }}
              >
                {invoice.paymentDetails || profile.paymentDetails}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-[9px]" style={{ color: `${MUTED}80` }}>
          <p>
            {'< '} Thank you for your business {' />'}
          </p>
        </div>
      </div>

      <div
        className="h-0.5"
        style={{ background: `linear-gradient(90deg, ${CYAN}, ${MAGENTA})` }}
      />
    </div>
  );
}

function NeonStatus({ status }: { status: string }) {
  const config: Record<string, { color: string; glow: string }> = {
    draft: { color: MUTED, glow: 'none' },
    sent: { color: CYAN, glow: `0 0 8px ${CYAN}40` },
    paid: { color: '#00e676', glow: `0 0 8px #00e67640` },
    overdue: { color: MAGENTA, glow: `0 0 8px ${MAGENTA}40` },
  };
  const s = config[status] || config.draft;
  return (
    <span
      className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider border"
      style={{ color: s.color, borderColor: s.color, boxShadow: s.glow }}
    >
      [{status}]
    </span>
  );
}

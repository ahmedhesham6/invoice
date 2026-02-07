/**
 * SUNSET — Warm coral-to-violet gradient header, soft pastels, rounded feel.
 * Think: modern SaaS, lifestyle brand. Friendly, vibrant, approachable.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

const CORAL = '#f97068';
const VIOLET = '#7c3aed';
const WARM_GRAY = '#4a4458';
const SOFT_BG = '#fefbf9';
const MUTED = '#9a8fa6';

export function SunsetTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="min-h-full"
      style={{
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        background: SOFT_BG,
        color: WARM_GRAY,
      }}
    >
      {/* Gradient header */}
      <div
        className="px-10 pt-10 pb-8 text-white"
        style={{ background: `linear-gradient(135deg, ${CORAL} 0%, #e0568a 40%, ${VIOLET} 100%)` }}
      >
        <div className="flex justify-between items-start">
          <div>
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt=""
                className="h-9 w-auto object-contain mb-5 brightness-0 invert opacity-90"
              />
            )}
            <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
            <p className="text-sm text-white/50 font-mono mt-1">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <SunsetStatus status={invoice.status} />
            <div className="mt-3 space-y-0.5 text-[11px] text-white/50">
              <p>Issued {formatDate(invoice.issueDate)}</p>
              <p>Due {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Soft wave transition */}
      <div
        style={{
          height: 6,
          background: `linear-gradient(90deg, ${CORAL}20, ${VIOLET}20, transparent)`,
        }}
      />

      <div className="px-10 py-8">
        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.3em] mb-3 font-semibold"
              style={{ color: CORAL }}
            >
              From
            </p>
            <p className="text-sm font-semibold" style={{ color: WARM_GRAY }}>
              {profile.displayName}
            </p>
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
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.3em] mb-3 font-semibold"
              style={{ color: VIOLET }}
            >
              Bill To
            </p>
            {invoice.client && (
              <>
                <p className="text-sm font-semibold" style={{ color: WARM_GRAY }}>
                  {invoice.client.name}
                </p>
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
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr>
                <th
                  className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    color: CORAL,
                    background: `${CORAL}08`,
                    borderBottom: `2px solid ${CORAL}20`,
                  }}
                >
                  Description
                </th>
                <th
                  className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    color: CORAL,
                    background: `${CORAL}08`,
                    borderBottom: `2px solid ${CORAL}20`,
                  }}
                >
                  Qty
                </th>
                <th
                  className="px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    color: CORAL,
                    background: `${CORAL}08`,
                    borderBottom: `2px solid ${CORAL}20`,
                  }}
                >
                  Unit
                </th>
                <th
                  className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    color: CORAL,
                    background: `${CORAL}08`,
                    borderBottom: `2px solid ${CORAL}20`,
                  }}
                >
                  Rate
                </th>
                <th
                  className="px-4 py-3 text-right text-[9px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    color: CORAL,
                    background: `${CORAL}08`,
                    borderBottom: `2px solid ${CORAL}20`,
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems?.map((item) => (
                <tr key={item._id} style={{ borderBottom: `1px solid ${WARM_GRAY}0a` }}>
                  <td className="px-4 py-3.5 text-[13px] font-medium">{item.description}</td>
                  <td
                    className="px-3 py-3.5 text-[13px] text-right tabular-nums"
                    style={{ color: MUTED }}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-3 py-3.5 text-[10px]" style={{ color: `${MUTED}bb` }}>
                    {item.unit || '—'}
                  </td>
                  <td
                    className="px-3 py-3.5 text-[13px] text-right tabular-nums"
                    style={{ color: MUTED }}
                  >
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-right font-semibold tabular-nums">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-64 space-y-2 text-[12px]">
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
              <div className="flex justify-between" style={{ color: '#dc2626' }}>
                <span>Discount</span>
                <span className="tabular-nums">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div
              className="h-0.5 mt-2"
              style={{ background: `linear-gradient(90deg, ${CORAL}, ${VIOLET})` }}
            />
            <div
              className="flex justify-between items-center pt-2 px-4 py-3 text-white"
              style={{ background: `linear-gradient(135deg, ${CORAL}, ${VIOLET})` }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Total</span>
              <span className="text-xl font-bold tabular-nums">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-5">
          {invoice.notes && (
            <div className="pl-4" style={{ borderLeft: `3px solid ${CORAL}40` }}>
              <p className="text-[9px] uppercase tracking-[0.3em] mb-1.5" style={{ color: CORAL }}>
                Notes
              </p>
              <p
                className="text-[12px] whitespace-pre-wrap leading-relaxed"
                style={{ color: MUTED }}
              >
                {invoice.notes}
              </p>
            </div>
          )}
          {(invoice.paymentDetails || profile.paymentDetails) && (
            <div
              className="p-5"
              style={{ background: `${VIOLET}06`, border: `1px solid ${VIOLET}15` }}
            >
              <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: VIOLET }}>
                Payment Details
              </p>
              <p
                className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed"
                style={{ color: MUTED }}
              >
                {invoice.paymentDetails || profile.paymentDetails}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className="mt-6 text-center py-4">
        <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${MUTED}66` }}>
          Thank you for your business ✦
        </p>
      </div>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${CORAL}, ${VIOLET})` }} />
    </div>
  );
}

function SunsetStatus({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.6)' },
    sent: { bg: 'rgba(255,255,255,0.2)', text: '#fff' },
    paid: { bg: '#06d6a040', text: '#06d6a0' },
    overdue: { bg: '#ff634740', text: '#ffcccc' },
  };
  const s = config[status] || config.draft;
  return (
    <span
      className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

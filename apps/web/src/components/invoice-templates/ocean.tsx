/**
 * OCEAN — Deep navy blues, teal accents, airy whitespace.
 * Think: maritime architecture firm. Calm, confident, and deep.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

const NAVY = '#0c1f3f';
const TEAL = '#0ea5a0';
const LIGHT_BG = '#f0f6fa';
const MUTED = '#7a8fa6';

export function OceanTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="min-h-full bg-white"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", color: NAVY }}
    >
      {/* Gradient header */}
      <div
        className="px-10 pt-10 pb-8"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #163a6b 50%, #1a5276 100%)` }}
      >
        <div className="flex justify-between items-start">
          <div>
            {profile.logoUrl && (
              <img
                src={profile.logoUrl}
                alt=""
                className="h-9 w-auto object-contain mb-5 brightness-0 invert opacity-80"
              />
            )}
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 mb-1">Invoice</p>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {invoice.invoiceNumber}
            </h1>
          </div>
          <div className="text-right">
            <OceanStatus status={invoice.status} />
            <div className="mt-4 space-y-0.5">
              <p className="text-[11px] text-white/40">
                <span className="text-white/25">Issued</span> {formatDate(invoice.issueDate)}
              </p>
              <p className="text-[11px] text-white/40">
                <span className="text-white/25">Due</span> {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Total in header */}
        <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-end">
          <div className="text-[9px] uppercase tracking-[0.3em] text-white/30">Amount Due</div>
          <div
            className="text-3xl font-bold text-white tabular-nums"
            style={{ textShadow: `0 0 30px ${TEAL}40` }}
          >
            {formatCurrency(invoice.total, invoice.currency)}
          </div>
        </div>
      </div>

      {/* Teal accent strip */}
      <div
        className="h-1"
        style={{ background: `linear-gradient(90deg, ${TEAL}, ${TEAL}80, transparent)` }}
      />

      {/* Addresses */}
      <div className="px-10 py-8 grid grid-cols-2 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-4" style={{ background: TEAL }} />
            <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: TEAL }}>
              From
            </p>
          </div>
          <p className="text-sm font-semibold">{profile.displayName}</p>
          <div className="text-[11px] mt-1 space-y-px" style={{ color: MUTED }}>
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
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1 w-4" style={{ background: TEAL }} />
            <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: TEAL }}>
              Bill To
            </p>
          </div>
          {invoice.client && (
            <>
              <p className="text-sm font-semibold">{invoice.client.name}</p>
              <div className="text-[11px] mt-1 space-y-px" style={{ color: MUTED }}>
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
      <div className="px-10 pb-6">
        <table className="w-full">
          <thead>
            <tr style={{ background: LIGHT_BG }}>
              <th
                className="px-4 py-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: TEAL }}
              >
                Description
              </th>
              <th
                className="px-3 py-2.5 text-right text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: TEAL }}
              >
                Qty
              </th>
              <th
                className="px-3 py-2.5 text-left text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: TEAL }}
              >
                Unit
              </th>
              <th
                className="px-3 py-2.5 text-right text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: TEAL }}
              >
                Rate
              </th>
              <th
                className="px-4 py-2.5 text-right text-[9px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: TEAL }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems?.map((item) => (
              <tr key={item._id} className="border-b" style={{ borderColor: `${NAVY}08` }}>
                <td className="px-4 py-3.5 text-[13px] font-medium">{item.description}</td>
                <td
                  className="px-3 py-3.5 text-[13px] text-right tabular-nums"
                  style={{ color: MUTED }}
                >
                  {item.quantity}
                </td>
                <td className="px-3 py-3.5 text-[10px]" style={{ color: `${MUTED}aa` }}>
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
      <div className="px-10 pb-8">
        <div className="flex justify-end">
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
              <div className="flex justify-between" style={{ color: '#c0392b' }}>
                <span>Discount</span>
                <span className="tabular-nums">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div
              className="h-px mt-2"
              style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` }}
            />
            <div
              className="flex justify-between items-center pt-2 px-3 py-2"
              style={{ background: LIGHT_BG }}
            >
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: TEAL }}>
                Total
              </span>
              <span className="text-xl font-bold tabular-nums" style={{ color: NAVY }}>
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 pb-10 space-y-5">
        {invoice.notes && (
          <div className="border-l-3 pl-4" style={{ borderColor: TEAL }}>
            <p className="text-[9px] uppercase tracking-[0.3em] mb-1" style={{ color: TEAL }}>
              Notes
            </p>
            <p className="text-[12px] whitespace-pre-wrap leading-relaxed" style={{ color: MUTED }}>
              {invoice.notes}
            </p>
          </div>
        )}
        {(invoice.paymentDetails || profile.paymentDetails) && (
          <div className="p-5" style={{ background: LIGHT_BG, border: `1px solid ${TEAL}20` }}>
            <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: TEAL }}>
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

      {/* Bottom bar */}
      <div className="px-10 py-4 text-center" style={{ background: NAVY }}>
        <p className="text-[9px] tracking-[0.3em] uppercase text-white/20">
          Thank you for your business
        </p>
      </div>
    </div>
  );
}

function OceanStatus({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    draft: { bg: 'rgba(255,255,255,0.08)', text: 'rgba(255,255,255,0.4)' },
    sent: { bg: `${TEAL}30`, text: TEAL },
    paid: { bg: '#06d6a030', text: '#06d6a0' },
    overdue: { bg: '#ff634730', text: '#ff6347' },
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

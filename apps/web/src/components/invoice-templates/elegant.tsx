/**
 * ELEGANT — Refined serif typography, cream paper feel, gold accents.
 * Think: luxury interior design firm. Timeless sophistication.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

const GOLD = '#9c7c38';
const CREAM = '#faf8f3';
const DARK = '#2d2a26';

export function ElegantTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="min-h-full"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: CREAM, color: DARK }}
    >
      {/* Decorative top border */}
      <div
        className="h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      <div className="px-12 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          {profile.logoUrl && (
            <img
              src={profile.logoUrl}
              alt=""
              className="h-10 w-auto object-contain mx-auto mb-4 opacity-80"
            />
          )}
          <h1 className="text-4xl tracking-[0.15em] font-light" style={{ color: GOLD }}>
            INVOICE
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase mt-2" style={{ color: `${GOLD}99` }}>
            {invoice.invoiceNumber}
          </p>
          <div className="flex items-center justify-center gap-1 mt-4">
            <div className="h-px w-12" style={{ background: `${GOLD}40` }} />
            <div className="h-1.5 w-1.5 rotate-45" style={{ background: GOLD }} />
            <div className="h-px w-12" style={{ background: `${GOLD}40` }} />
          </div>
        </div>

        {/* Status & Dates */}
        <div className="flex justify-center gap-12 mb-12 text-center">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: `${DARK}66` }}>
              Status
            </p>
            <p className="text-sm font-semibold mt-1 capitalize" style={{ color: GOLD }}>
              {invoice.status}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: `${DARK}66` }}>
              Issued
            </p>
            <p className="text-sm mt-1">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: `${DARK}66` }}>
              Due Date
            </p>
            <p className="text-sm mt-1">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-16 mb-12 px-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>
              From
            </p>
            <p className="text-base font-semibold italic">{profile.displayName}</p>
            <div className="text-xs mt-1 space-y-px" style={{ color: `${DARK}99` }}>
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
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.3em] mb-3" style={{ color: GOLD }}>
              Bill To
            </p>
            {invoice.client && (
              <>
                <p className="text-base font-semibold italic">{invoice.client.name}</p>
                <div className="text-xs mt-1 space-y-px" style={{ color: `${DARK}99` }}>
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

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8 px-4">
          <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            Details
          </p>
          <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
        </div>

        {/* Line Items */}
        <div className="px-4 mb-8">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${GOLD}40` }}>
                <th
                  className="pb-3 text-left text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Description
                </th>
                <th
                  className="pb-3 text-right text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Qty
                </th>
                <th
                  className="pb-3 text-left text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Unit
                </th>
                <th
                  className="pb-3 text-right text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Rate
                </th>
                <th
                  className="pb-3 text-right text-[9px] uppercase tracking-[0.2em]"
                  style={{ color: GOLD }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems?.map((item) => (
                <tr key={item._id} style={{ borderBottom: `1px solid ${GOLD}15` }}>
                  <td className="py-3.5 text-sm">{item.description}</td>
                  <td
                    className="py-3.5 text-sm text-right tabular-nums"
                    style={{ color: `${DARK}88` }}
                  >
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-xs" style={{ color: `${DARK}66` }}>
                    {item.unit || '—'}
                  </td>
                  <td
                    className="py-3.5 text-sm text-right tabular-nums"
                    style={{ color: `${DARK}88` }}
                  >
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="py-3.5 text-sm text-right font-semibold tabular-nums">
                    {formatCurrency(item.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12 px-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs" style={{ color: `${DARK}88` }}>
              <span>Subtotal</span>
              <span className="tabular-nums">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-xs" style={{ color: `${DARK}88` }}>
                <span>Tax ({invoice.taxRate}%)</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.taxAmount, invoice.currency)}
                </span>
              </div>
            )}
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-xs" style={{ color: '#a05' }}>
                <span>Discount</span>
                <span className="tabular-nums">
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </span>
              </div>
            )}
            <div className="h-px mt-3" style={{ background: GOLD }} />
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>
                Total
              </span>
              <span className="text-3xl font-light tabular-nums italic" style={{ color: GOLD }}>
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes & Payment */}
        <div className="space-y-6 px-4">
          {invoice.notes && (
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: GOLD }}>
                Notes
              </p>
              <p
                className="text-xs italic whitespace-pre-wrap leading-relaxed"
                style={{ color: `${DARK}88` }}
              >
                {invoice.notes}
              </p>
            </div>
          )}
          {(invoice.paymentDetails || profile.paymentDetails) && (
            <div
              className="p-5 border"
              style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}
            >
              <p className="text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: GOLD }}>
                Payment Details
              </p>
              <p
                className="text-[11px] whitespace-pre-wrap leading-relaxed"
                style={{ fontFamily: 'monospace', color: `${DARK}88` }}
              >
                {invoice.paymentDetails || profile.paymentDetails}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="mt-8 text-center py-6">
        <div className="flex items-center justify-center gap-1">
          <div className="h-px w-8" style={{ background: `${GOLD}40` }} />
          <div className="h-1 w-1 rotate-45" style={{ background: GOLD }} />
          <div className="h-px w-8" style={{ background: `${GOLD}40` }} />
        </div>
        <p className="text-[9px] mt-3 tracking-[0.3em] uppercase" style={{ color: `${DARK}44` }}>
          With gratitude for your patronage
        </p>
      </div>
      <div
        className="h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />
    </div>
  );
}

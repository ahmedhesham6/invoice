/**
 * CLASSIC — Clean corporate invoice with dark header band, structured grid layout.
 * Think: high-end consulting firm. Neutral tones, strong hierarchy.
 */
import type { InvoiceTemplateProps } from './types';

import { formatCurrency, formatDate } from './types';

export function ClassicTemplate({ invoice, profile }: InvoiceTemplateProps) {
  return (
    <div
      className="bg-white text-[#1a1a1a] min-h-full"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-[#1a1a1a]" />

      {/* Header */}
      <div className="px-10 pt-8 pb-6 flex justify-between items-start">
        <div>
          {profile.logoUrl ? (
            <img src={profile.logoUrl} alt="Logo" className="h-10 w-auto object-contain mb-3" />
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">INVOICE</h1>
          <p className="text-sm text-[#888] font-mono mt-1">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <StatusBadge status={invoice.status} />
          <div className="mt-4 space-y-0.5 text-xs text-[#666]">
            <p>
              <span className="text-[#999]">Issued:</span> {formatDate(invoice.issueDate)}
            </p>
            <p>
              <span className="text-[#999]">Due:</span> {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="px-10 py-6 grid grid-cols-2 gap-10 border-t border-b border-[#e8e8e8]">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bbb] mb-2">
            From
          </p>
          <p className="font-semibold text-sm">{profile.displayName}</p>
          {profile.address && <p className="text-xs text-[#666]">{profile.address}</p>}
          {(profile.city || profile.country) && (
            <p className="text-xs text-[#666]">
              {[profile.city, profile.postalCode, profile.country].filter(Boolean).join(', ')}
            </p>
          )}
          {profile.email && <p className="text-xs text-[#666]">{profile.email}</p>}
          {profile.phone && <p className="text-xs text-[#666]">{profile.phone}</p>}
          {profile.taxId && <p className="text-[10px] text-[#aaa] mt-1">Tax ID: {profile.taxId}</p>}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bbb] mb-2">
            Bill To
          </p>
          {invoice.client && (
            <>
              <p className="font-semibold text-sm">{invoice.client.name}</p>
              {invoice.client.address && (
                <p className="text-xs text-[#666]">{invoice.client.address}</p>
              )}
              {(invoice.client.city || invoice.client.country) && (
                <p className="text-xs text-[#666]">
                  {[invoice.client.city, invoice.client.postalCode, invoice.client.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              <p className="text-xs text-[#666]">{invoice.client.email}</p>
              {invoice.client.phone && (
                <p className="text-xs text-[#666]">{invoice.client.phone}</p>
              )}
              {invoice.client.taxId && (
                <p className="text-[10px] text-[#aaa] mt-1">Tax ID: {invoice.client.taxId}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="px-10 py-6">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1a1a1a] text-white">
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em]">
                Description
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.15em]">
                Qty
              </th>
              <th className="px-4 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em]">
                Unit
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.15em]">
                Rate
              </th>
              <th className="px-4 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.15em]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems?.map((item, i) => (
              <tr key={item._id} className={i % 2 === 0 ? 'bg-[#fafafa]' : 'bg-white'}>
                <td className="px-4 py-3 text-sm font-medium">{item.description}</td>
                <td className="px-4 py-3 text-sm text-right text-[#666] tabular-nums">
                  {item.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-[#666]">{item.unit || '—'}</td>
                <td className="px-4 py-3 text-sm text-right text-[#666] tabular-nums">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium tabular-nums">
                  {formatCurrency(item.total, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-10 pb-6">
        <div className="flex justify-end">
          <div className="w-72">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#888]">Subtotal</span>
                <span className="tabular-nums">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#888]">Tax ({invoice.taxRate}%)</span>
                  <span className="tabular-nums">
                    {formatCurrency(invoice.taxAmount, invoice.currency)}
                  </span>
                </div>
              )}
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#888]">Discount</span>
                  <span className="tabular-nums text-red-600">
                    -{formatCurrency(invoice.discountAmount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="border-t border-[#e8e8e8] pt-2 mt-2" />
              <div className="flex justify-between items-center bg-[#1a1a1a] text-white px-4 py-3 -mx-4">
                <span className="font-semibold">Total Due</span>
                <span className="text-xl font-bold tabular-nums">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Payment */}
      <div className="px-10 pb-8 space-y-4">
        {invoice.notes && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#bbb] mb-1">
              Notes
            </p>
            <p className="text-sm text-[#555] whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
        {(invoice.paymentDetails || profile.paymentDetails) && (
          <div className="bg-[#f4f7ff] border border-[#d4e0ff] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6b8cce] mb-1">
              Payment Details
            </p>
            <p className="text-xs font-mono text-[#555] whitespace-pre-wrap">
              {invoice.paymentDetails || profile.paymentDetails}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-10 py-4 border-t border-[#e8e8e8] text-center">
        <p className="text-[10px] text-[#ccc]">Thank you for your business</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-[#f0f0f0] text-[#888]',
    sent: 'bg-[#e8f4fd] text-[#2563eb]',
    paid: 'bg-[#ecfdf5] text-[#059669]',
    overdue: 'bg-[#fef2f2] text-[#dc2626]',
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${styles[status] || styles.draft}`}
    >
      {status}
    </span>
  );
}

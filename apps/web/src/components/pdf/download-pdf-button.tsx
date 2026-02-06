import { Button } from '@invoice/ui/components/button';
import { Printer } from 'lucide-react';

interface LineItem {
  _id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  total: number;
}

interface Client {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface Profile {
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  logoUrl?: string;
  paymentDetails?: string;
}

interface Invoice {
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: number;
  dueDate: number;
  currency: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount: number;
  total: number;
  notes?: string;
  paymentDetails?: string;
  lineItems?: LineItem[];
  client?: Client;
}

interface DownloadPDFButtonProps {
  invoice: Invoice;
  profile: Profile;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

function formatCurrency(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DownloadPDFButton({
  invoice,
  profile,
  variant = 'outline',
  size = 'default',
  className,
}: DownloadPDFButtonProps) {
  const handlePrint = () => {
    // Create a printable HTML document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the invoice');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .title { font-size: 32px; font-weight: 700; }
    .invoice-number { color: #666; margin-top: 4px; }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .status-draft { background: #e5e7eb; color: #4b5563; }
    .status-sent { background: #dbeafe; color: #1d4ed8; }
    .status-paid { background: #dcfce7; color: #15803d; }
    .status-overdue { background: #fee2e2; color: #dc2626; }
    .addresses { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 30px;
    }
    .address-block { width: 45%; }
    .address-label { 
      font-size: 11px; 
      font-weight: 600; 
      color: #888; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .address-name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .address-text { color: #555; font-size: 13px; }
    .meta { 
      display: flex; 
      background: #f8f9fa; 
      padding: 16px; 
      margin-bottom: 30px;
      border-radius: 6px;
    }
    .meta-item { flex: 1; }
    .meta-label { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 4px; }
    .meta-value { font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { 
      background: #1a1a1a; 
      color: white; 
      padding: 12px; 
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    th:last-child, td:last-child { text-align: right; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) { background: #fafafa; }
    .totals { 
      display: flex; 
      justify-content: flex-end; 
      margin-bottom: 30px;
    }
    .totals-box { width: 280px; }
    .total-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 12px;
    }
    .total-label { color: #666; }
    .total-value { font-weight: 500; }
    .total-final { 
      background: #1a1a1a; 
      color: white; 
      border-radius: 6px;
      margin-top: 8px;
      padding: 12px;
    }
    .total-final .total-label { color: white; font-weight: 600; }
    .total-final .total-value { font-size: 18px; font-weight: 700; }
    .section { margin-bottom: 24px; }
    .section-title { 
      font-size: 12px; 
      font-weight: 600; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .section-content { 
      background: #f8f9fa; 
      padding: 16px; 
      border-radius: 6px;
      white-space: pre-wrap;
    }
    .payment-box {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 16px;
      border-radius: 6px;
      font-family: monospace;
      white-space: pre-wrap;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
    @page {
      size: A4;
      margin: 15mm;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">${profile.displayName || 'Invoice'}</div>
    </div>
    <div style="text-align: right;">
      <div class="title">INVOICE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <div class="status status-${invoice.status}">${invoice.status}</div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <div class="address-label">From</div>
      <div class="address-name">${profile.displayName || ''}</div>
      ${profile.address ? `<div class="address-text">${profile.address}</div>` : ''}
      ${profile.city || profile.country ? `<div class="address-text">${[profile.city, profile.postalCode, profile.country].filter(Boolean).join(', ')}</div>` : ''}
      ${profile.email ? `<div class="address-text">${profile.email}</div>` : ''}
      ${profile.phone ? `<div class="address-text">${profile.phone}</div>` : ''}
    </div>
    <div class="address-block">
      <div class="address-label">Bill To</div>
      ${
        invoice.client
          ? `
        <div class="address-name">${invoice.client.name}</div>
        ${invoice.client.address ? `<div class="address-text">${invoice.client.address}</div>` : ''}
        ${invoice.client.city || invoice.client.country ? `<div class="address-text">${[invoice.client.city, invoice.client.postalCode, invoice.client.country].filter(Boolean).join(', ')}</div>` : ''}
        <div class="address-text">${invoice.client.email}</div>
        ${invoice.client.phone ? `<div class="address-text">${invoice.client.phone}</div>` : ''}
      `
          : ''
      }
    </div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <div class="meta-label">Invoice Number</div>
      <div class="meta-value">${invoice.invoiceNumber}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Issue Date</div>
      <div class="meta-value">${formatDate(invoice.issueDate)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Due Date</div>
      <div class="meta-value">${formatDate(invoice.dueDate)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Currency</div>
      <div class="meta-value">${invoice.currency}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${(invoice.lineItems || [])
        .map(
          (item) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${item.unit || '-'}</td>
          <td>${formatCurrency(item.unitPrice, invoice.currency)}</td>
          <td>${formatCurrency(item.total, invoice.currency)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="total-row">
        <span class="total-label">Subtotal</span>
        <span class="total-value">${formatCurrency(invoice.subtotal, invoice.currency)}</span>
      </div>
      ${
        invoice.taxRate > 0
          ? `
        <div class="total-row">
          <span class="total-label">Tax (${invoice.taxRate}%)</span>
          <span class="total-value">${formatCurrency(invoice.taxAmount, invoice.currency)}</span>
        </div>
      `
          : ''
      }
      ${
        invoice.discountAmount > 0
          ? `
        <div class="total-row">
          <span class="total-label">Discount</span>
          <span class="total-value" style="color: #dc2626;">-${formatCurrency(invoice.discountAmount, invoice.currency)}</span>
        </div>
      `
          : ''
      }
      <div class="total-row total-final">
        <span class="total-label">Total Due</span>
        <span class="total-value">${formatCurrency(invoice.total, invoice.currency)}</span>
      </div>
    </div>
  </div>

  ${
    invoice.notes
      ? `
    <div class="section">
      <div class="section-title">Notes</div>
      <div class="section-content">${invoice.notes}</div>
    </div>
  `
      : ''
  }

  ${
    invoice.paymentDetails || profile.paymentDetails
      ? `
    <div class="section">
      <div class="section-title">Payment Details</div>
      <div class="payment-box">${invoice.paymentDetails || profile.paymentDetails}</div>
    </div>
  `
      : ''
  }

  <div class="no-print" style="position:fixed;top:0;left:0;right:0;background:#fef3c7;padding:12px 20px;font-size:13px;border-bottom:1px solid #f59e0b;z-index:1000;">
    <strong>Tip:</strong> In the print dialog, go to "More settings" and uncheck "Headers and footers" to remove the URL and date.
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 100);
    }
  </script>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Button variant={variant} size={size} onClick={handlePrint} className={className}>
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </Button>
  );
}

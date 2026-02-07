import type { InvoiceTemplateId } from '../invoice-templates';
import { Button } from '@invoice/ui/components/button';
import { Printer } from 'lucide-react';
import { createRoot } from 'react-dom/client';

import { getTemplateComponent } from '../invoice-templates';

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
  templateId?: InvoiceTemplateId;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function DownloadPDFButton({
  invoice,
  profile,
  templateId = 'classic',
  variant = 'outline',
  size = 'default',
  className,
}: DownloadPDFButtonProps) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the invoice');
      return;
    }

    // Get the template component and render it to HTML
    const TemplateComponent = getTemplateComponent(templateId);

    // Create a temporary container to render React into static HTML
    const container = document.createElement('div');
    const root = createRoot(container);

    // Render synchronously-ish using flushSync-like approach
    root.render(<TemplateComponent invoice={invoice} profile={profile} />);

    // Small delay to let React render, then extract HTML
    setTimeout(() => {
      const templateHTML = container.innerHTML;
      root.unmount();

      const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200;300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .no-print { display: none !important; }
    }
    @page {
      size: A4;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  ${templateHTML}
  <div class="no-print" style="position:fixed;top:0;left:0;right:0;background:#fef3c7;padding:12px 20px;font-size:13px;border-bottom:1px solid #f59e0b;z-index:1000;font-family:system-ui;">
    <strong>Tip:</strong> In the print dialog, set margins to "None" and uncheck "Headers and footers" for the best result.
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    }
  <\/script>
</body>
</html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    }, 100);
  };

  return (
    <Button variant={variant} size={size} onClick={handlePrint} className={className}>
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </Button>
  );
}

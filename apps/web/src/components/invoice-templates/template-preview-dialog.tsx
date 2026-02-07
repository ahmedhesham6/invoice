import type { InvoiceTemplateId } from './types';
import type { InvoiceData, Profile } from './types';
/**
 * TemplatePreviewDialog — fullscreen-ish dialog that renders a template
 * with realistic demo data so users can see exactly what they're getting.
 *
 * The eye button is completely decoupled from the parent card's onClick —
 * it captures pointer/mouse events at every phase to prevent bubbling.
 */
import { Dialog, DialogContent } from '@invoice/ui/components/dialog';
import { Eye } from 'lucide-react';
import { useState } from 'react';

import { getTemplateComponent, getTemplateMetadata } from './index';

const DEMO_PROFILE: Profile = {
  displayName: 'Northwind Studio',
  email: 'hello@northwind.studio',
  phone: '+1 (415) 555-0132',
  address: '44 Tehama Street, Suite 200',
  city: 'San Francisco',
  country: 'United States',
  postalCode: '94105',
  website: 'https://northwind.studio',
  taxId: 'US-87-4521390',
  paymentDetails:
    'Bank: Silicon Valley Bank\nAccount: 9283 0174 5520\nRouting: 121140399\nSWIFT: SVBKUS6S',
};

const DEMO_INVOICE: InvoiceData = {
  invoiceNumber: 'INV-047',
  status: 'sent',
  issueDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
  dueDate: Date.now() + 27 * 24 * 60 * 60 * 1000,
  currency: 'USD',
  subtotal: 875000,
  taxRate: 8.5,
  taxAmount: 74375,
  discountType: 'percentage',
  discountValue: 5,
  discountAmount: 43750,
  total: 905625,
  notes: 'Payment is due within 30 days. Late payments may incur a 1.5% monthly fee.',
  paymentDetails: undefined,
  client: {
    name: 'Acme Corporation',
    email: 'billing@acme.corp',
    phone: '+1 (212) 555-0198',
    address: '350 Fifth Avenue, Floor 34',
    city: 'New York',
    country: 'United States',
    postalCode: '10118',
    taxId: 'US-13-8827461',
  },
  lineItems: [
    {
      _id: 'demo-1',
      description: 'Brand Identity & Strategy',
      quantity: 1,
      unit: 'project',
      unitPrice: 350000,
      total: 350000,
    },
    {
      _id: 'demo-2',
      description: 'Website Design & Development',
      quantity: 80,
      unit: 'hours',
      unitPrice: 5000,
      total: 400000,
    },
    {
      _id: 'demo-3',
      description: 'Motion Design — Hero Animations',
      quantity: 25,
      unit: 'hours',
      unitPrice: 5000,
      total: 125000,
    },
  ],
};

interface TemplatePreviewDialogProps {
  templateId: InvoiceTemplateId;
}

/**
 * Stops every event phase so nothing leaks to parent card.
 */
function killEvent(e: React.SyntheticEvent) {
  e.stopPropagation();
  e.preventDefault();
  e.nativeEvent.stopImmediatePropagation();
}

export function TemplatePreviewDialog({ templateId }: TemplatePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const Component = getTemplateComponent(templateId);
  const meta = getTemplateMetadata(templateId);

  return (
    <>
      {/* Standalone eye button — NOT a DialogTrigger, just a plain div that opens state */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        role="button"
        tabIndex={0}
        data-template-preview
        onClick={(e) => {
          killEvent(e);
          setOpen(true);
        }}
        onPointerDown={killEvent}
        onMouseDown={killEvent}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            killEvent(e);
            setOpen(true);
          }
        }}
        className="
          absolute top-2 left-2 z-10
          h-6 w-6 flex items-center justify-center
          bg-background/80 backdrop-blur-sm border border-border/50
          text-muted-foreground hover:text-foreground hover:bg-background
          opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
          transition-all duration-150 cursor-pointer
          focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        <Eye className="h-3 w-3" />
      </div>

      {/* Dialog controlled via open state, no trigger needed */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent showCloseButton size="xl" className="overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/40 bg-muted/30 shrink-0 pr-12">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-3 w-3 shrink-0"
                  style={{ background: meta.previewColors.accent }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{meta.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{meta.description}</p>
                </div>
              </div>
              <div className="hidden sm:flex gap-1 shrink-0">
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] px-1.5 py-0.5 bg-muted text-muted-foreground uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Template preview — scrollable */}
            <div className="overflow-y-auto flex-1 min-h-0 bg-muted/20">
              <div className="max-w-[680px] my-6 mx-4 sm:mx-auto shadow-2xl shadow-black/10 dark:shadow-black/30">
                <Component invoice={DEMO_INVOICE} profile={DEMO_PROFILE} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

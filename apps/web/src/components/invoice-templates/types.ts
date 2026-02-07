export type InvoiceTemplateId =
  | 'classic'
  | 'minimal'
  | 'bold'
  | 'elegant'
  | 'retro'
  | 'neon'
  | 'mono'
  | 'ocean'
  | 'sunset';

export interface LineItem {
  _id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  total: number;
}

export interface Client {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
}

export interface Profile {
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
  taxId?: string;
}

export interface InvoiceData {
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

export interface InvoiceTemplateProps {
  invoice: InvoiceData;
  profile: Profile;
}

export interface TemplateMetadata {
  id: InvoiceTemplateId;
  name: string;
  description: string;
  tags: string[];
  previewColors: {
    bg: string;
    accent: string;
    text: string;
  };
}

export function formatCurrency(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function formatDateShort(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

import type { InvoiceTemplateId } from '@/components/invoice-templates';
import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { Button } from '@invoice/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@invoice/ui/components/card';
import { Input } from '@invoice/ui/components/input';
import { Label } from '@invoice/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invoice/ui/components/select';
import { Separator } from '@invoice/ui/components/separator';
import { Textarea } from '@invoice/ui/components/textarea';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  Calculator,
  FileText,
  User,
  Palette,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { resolveTemplate } from '@/components/invoice-templates';
import { TemplatePicker } from '@/components/invoice-templates/template-picker';
import { ProtectedRoute } from '@/components/protected-route';

export const Route = createFileRoute('/_app/invoices/new')({
  head: () => ({
    meta: [{ title: 'New Invoice | Invoice' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: NewInvoicePage,
});

function NewInvoicePage() {
  return (
    <ProtectedRoute>
      <NewInvoiceContent />
    </ProtectedRoute>
  );
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const UNIT_OPTIONS = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'items', label: 'Items' },
  { value: 'project', label: 'Project' },
  { value: 'month', label: 'Month' },
  { value: 'custom', label: 'Custom' },
];

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

function formatCurrency(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function NewInvoiceContent() {
  const navigate = useNavigate();
  const profile = useQuery(convexQuery(api.profiles.get, {}));
  const clients = useQuery(convexQuery(api.clients.list, {}));
  const getInvoiceNumber = useConvexMutation(api.profiles.getAndIncrementInvoiceNumber);
  const createInvoice = useConvexMutation(api.invoices.create);

  const [clientId, setClientId] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [notes, setNotes] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: '', quantity: 1, unit: 'hours', unitPrice: 0 },
  ]);
  const [invoiceTemplate, setInvoiceTemplate] = useState<InvoiceTemplateId | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const invoiceNumberFetched = useRef(false);

  useEffect(() => {
    if (profile.data) {
      setCurrency(profile.data.defaultCurrency);
      setNotes(profile.data.defaultNotes ?? '');
      setPaymentDetails(profile.data.paymentDetails ?? '');
      const due = new Date();
      due.setDate(due.getDate() + profile.data.defaultPaymentTerms);
      setDueDate(due.toISOString().split('T')[0]);
    }
  }, [profile.data]);

  useEffect(() => {
    if (profile.data && !invoiceNumberFetched.current) {
      invoiceNumberFetched.current = true;
      getInvoiceNumber().then(setInvoiceNumber);
    }
  }, [profile.data, getInvoiceNumber]);

  const subtotal = lineItems.reduce(
    (sum, item) => sum + Math.round(item.quantity * item.unitPrice),
    0
  );
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const discountAmount =
    discountType === 'percentage'
      ? Math.round(subtotal * (discountValue / 100))
      : discountValue * 100;
  const total = subtotal + taxAmount - discountAmount;

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: crypto.randomUUID(), description: '', quantity: 1, unit: 'hours', unitPrice: 0 },
    ]);
  };
  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) {
      toast.error('Invoice must have at least one line item');
      return;
    }
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      toast.error('Please select a client');
      return;
    }
    if (lineItems.some((item) => !item.description)) {
      toast.error('All line items must have a description');
      return;
    }
    setIsSubmitting(true);
    try {
      await createInvoice({
        clientId: clientId as any,
        invoiceNumber,
        issueDate: new Date(issueDate).getTime(),
        dueDate: new Date(dueDate).getTime(),
        currency,
        taxRate,
        discountType: discountValue > 0 ? discountType : undefined,
        discountValue:
          discountValue > 0
            ? discountType === 'fixed'
              ? discountValue * 100
              : discountValue
            : undefined,
        notes: notes || undefined,
        paymentDetails: paymentDetails || undefined,
        invoiceTemplate: invoiceTemplate || undefined,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit || undefined,
          unitPrice: item.unitPrice,
        })),
      });
      toast.success('Invoice created successfully');
      navigate({ to: '/invoices' });
    } catch {
      toast.error('Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClient = clients.data?.find((c) => c._id === clientId);

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <Button
          variant="ghost"
          className="mb-5 gap-2 text-muted-foreground hover:text-foreground h-8 text-xs"
          onClick={() => navigate({ to: '/invoices' })}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Invoices
        </Button>

        <div className="mb-8 animate-in-up">
          <h1 className="font-display text-4xl tracking-tight">New Invoice</h1>
          <p className="text-muted-foreground mt-2 text-[15px]">
            Create a professional invoice for your client.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 stagger-children">
          {/* Invoice Details */}
          <Card className="border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-3.5 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-primary/10 border border-primary/10 text-primary">
                  <Receipt className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Invoice Details</CardTitle>
                  <CardDescription className="text-xs">
                    Basic information about this invoice
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Client *</Label>
                  <Select value={clientId} onValueChange={(v) => v && setClientId(v)}>
                    <SelectTrigger className="bg-background/50 border-border/60 h-10">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.data?.map((client) => (
                        <SelectItem key={client._id} value={client._id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {clients.data?.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      No clients yet.{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-primary text-[11px]"
                        onClick={() => navigate({ to: '/clients/new' })}
                      >
                        Add a client first
                      </Button>
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Invoice Number
                  </Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="bg-background/50 border-border/60 h-10 font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Issue Date</Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="bg-background/50 border-border/60 h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Due Date</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-background/50 border-border/60 h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Currency</Label>
                  <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                    <SelectTrigger className="bg-background/50 border-border/60 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          <span className="font-medium">{c.code}</span>{' '}
                          <span className="text-muted-foreground ml-1">{c.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedClient && (
                <div className="border border-border/40 bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-primary/10 text-primary border border-primary/10">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedClient.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedClient.email}</p>
                      {selectedClient.address && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {selectedClient.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-3.5 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-blue-500/10 border border-blue-500/10 text-blue-500">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Line Items</CardTitle>
                  <CardDescription className="text-xs">
                    Add the items or services you're billing for
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {/* Desktop Header */}
              <div className="hidden md:grid md:grid-cols-[1fr_90px_90px_110px_90px_36px] gap-2.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-[0.12em] px-1">
                <div>Description</div>
                <div>Quantity</div>
                <div>Unit</div>
                <div>Rate</div>
                <div className="text-right">Total</div>
                <div></div>
              </div>
              <Separator className="hidden md:block bg-border/30" />

              <div className="space-y-2.5">
                {lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative border border-border/40 bg-muted/10 p-3.5 transition-all hover:bg-muted/20 hover:border-border/60"
                  >
                    {/* Mobile */}
                    <div className="md:hidden space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                          Description
                        </Label>
                        <Input
                          placeholder="Web development..."
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="bg-background/50 border-border/50 h-9 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                            Qty
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={item.quantity}
                            onChange={(e) =>
                              updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                            }
                            className="bg-background/50 border-border/50 h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                            Unit
                          </Label>
                          <Select
                            value={item.unit}
                            onValueChange={(v) => v && updateLineItem(item.id, 'unit', v)}
                          >
                            <SelectTrigger className="bg-background/50 border-border/50 h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                            Rate
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={item.unitPrice / 100 || ''}
                            onChange={(e) =>
                              updateLineItem(
                                item.id,
                                'unitPrice',
                                Math.round((parseFloat(e.target.value) || 0) * 100)
                              )
                            }
                            className="bg-background/50 border-border/50 h-9 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                          Total
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm tabular-nums text-primary">
                            {formatCurrency(Math.round(item.quantity * item.unitPrice), currency)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLineItem(item.id)}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* Desktop */}
                    <div className="hidden md:grid md:grid-cols-[1fr_90px_90px_110px_90px_36px] gap-2.5 items-center">
                      <Input
                        placeholder="Web development..."
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        className="bg-background/50 border-border/50 h-9 text-sm"
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        className="bg-background/50 border-border/50 h-9 text-sm"
                      />
                      <Select
                        value={item.unit}
                        onValueChange={(v) => v && updateLineItem(item.id, 'unit', v)}
                      >
                        <SelectTrigger className="bg-background/50 border-border/50 h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice / 100 || ''}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            'unitPrice',
                            Math.round((parseFloat(e.target.value) || 0) * 100)
                          )
                        }
                        className="bg-background/50 border-border/50 h-9 text-sm"
                      />
                      <span className="font-medium tabular-nums text-primary text-sm text-right">
                        {formatCurrency(Math.round(item.quantity * item.unitPrice), currency)}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addLineItem}
                className="w-full border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5 h-9 text-xs"
              >
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card className="border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-3.5 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-amber-500/10 border border-amber-500/10 text-amber-500">
                  <Calculator className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Totals</CardTitle>
                  <CardDescription className="text-xs">
                    Tax, discounts, and final amount
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Tax Rate (%)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="bg-background/50 border-border/60 h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Discount</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                        className="flex-1 bg-background/50 border-border/60 h-10"
                      />
                      <Select
                        value={discountType}
                        onValueChange={(v) => setDiscountType(v as 'percentage' | 'fixed')}
                      >
                        <SelectTrigger className="w-20 bg-background/50 border-border/60 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="fixed">{currency}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="border border-border/40 bg-muted/20 p-5 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium tabular-nums">
                      {formatCurrency(subtotal, currency)}
                    </span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(taxAmount, currency)}
                      </span>
                    </div>
                  )}
                  {discountValue > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium tabular-nums text-destructive">
                        -{formatCurrency(discountAmount, currency)}
                      </span>
                    </div>
                  )}
                  <Separator className="bg-border/40" />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="font-display text-2xl text-primary tabular-nums">
                      {formatCurrency(total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="py-3.5 px-5">
              <CardTitle className="text-sm">Notes</CardTitle>
              <CardDescription className="text-xs">
                Additional information (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Textarea
                placeholder="Thank you for your business!..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background/50 border-border/60 resize-none text-sm"
              />
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="py-3.5 px-5">
              <CardTitle className="text-sm">Payment Details</CardTitle>
              <CardDescription className="text-xs">
                Bank details or payment instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Textarea
                placeholder={'Bank: Example Bank\nAccount: 1234567890'}
                rows={3}
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                className="bg-background/50 border-border/60 resize-none font-mono text-xs"
              />
            </CardContent>
          </Card>

          {/* Invoice Template */}
          <Card className="border-border/60 bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-3.5 px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-pink-500/10 border border-pink-500/10 text-pink-500">
                  <Palette className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Template</CardTitle>
                  <CardDescription className="text-xs">
                    Choose a look for this invoice. Leave empty to use the default.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <TemplatePicker
                value={
                  invoiceTemplate ||
                  resolveTemplate(
                    undefined,
                    selectedClient?.invoiceTemplate,
                    profile.data?.defaultInvoiceTemplate
                  )
                }
                onChange={(id) => setInvoiceTemplate(id)}
                showDefault
                isOverridden={!!invoiceTemplate}
                onClearOverride={() => setInvoiceTemplate(undefined)}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate({ to: '/invoices' })}
              className="h-10 px-6 border-border/60"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-10 px-6 shadow-lg shadow-primary/15 hover:shadow-primary/25 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

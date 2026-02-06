import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@invoice/backend/convex/_generated/api";
import { Button } from "@invoice/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@invoice/ui/components/card";
import { Input } from "@invoice/ui/components/input";
import { Label } from "@invoice/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@invoice/ui/components/select";
import { Separator } from "@invoice/ui/components/separator";
import { Textarea } from "@invoice/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, X, User, MapPin, FileText, CreditCard, Save } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/protected-route";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
];

function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const profile = useQuery(convexQuery(api.profiles.get, {}));
  const updateProfile = useConvexMutation(api.profiles.update);
  const generateUploadUrl = useConvexMutation(api.profiles.generateLogoUploadUrl);
  const saveLogo = useConvexMutation(api.profiles.saveLogo);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      taxId: "",
      defaultCurrency: "USD",
      invoicePrefix: "INV-",
      defaultPaymentTerms: 30,
      paymentDetails: "",
      defaultNotes: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProfile(value);
        toast.success("Settings saved successfully");
      } catch {
        toast.error("Failed to save settings");
      }
    },
  });

  if (profile.data && !form.state.isDirty) {
    const p = profile.data;
    form.setFieldValue("displayName", p.displayName || "");
    form.setFieldValue("email", p.email || "");
    form.setFieldValue("phone", p.phone || "");
    form.setFieldValue("website", p.website || "");
    form.setFieldValue("address", p.address || "");
    form.setFieldValue("city", p.city || "");
    form.setFieldValue("country", p.country || "");
    form.setFieldValue("postalCode", p.postalCode || "");
    form.setFieldValue("taxId", p.taxId || "");
    form.setFieldValue("defaultCurrency", p.defaultCurrency || "USD");
    form.setFieldValue("invoicePrefix", p.invoicePrefix || "INV-");
    form.setFieldValue("defaultPaymentTerms", p.defaultPaymentTerms || 30);
    form.setFieldValue("paymentDetails", p.paymentDetails || "");
    form.setFieldValue("defaultNotes", p.defaultNotes || "");
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
      const { storageId } = await result.json();
      await saveLogo({ storageId });
      toast.success("Logo uploaded successfully");
    } catch {
      toast.error("Failed to upload logo");
      setLogoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  if (profile.isLoading) {
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto max-w-4xl px-6 py-10">
          <div className="animate-pulse space-y-5">
            <div className="h-8 bg-muted w-48" />
            <div className="h-64 bg-muted" />
            <div className="h-64 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-in-up">
          <h1 className="font-display text-5xl tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-[15px] mt-2">Manage your profile and invoice preferences</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
          className="space-y-5 stagger-children"
        >
          {/* Profile */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 border border-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">Profile</CardTitle>
                  <CardDescription className="text-xs">Your business information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Logo */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Business Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-muted flex items-center justify-center overflow-hidden border border-dashed border-border/60">
                    {logoPreview || profile.data?.logoId ? (
                      <>
                        <img src={logoPreview || ""} alt="Logo" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setLogoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-0.5 right-0.5 p-0.5 bg-background/80 hover:bg-background">
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-border/60" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload Logo"}
                    </Button>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/40" />

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="displayName">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="displayName" className="text-xs font-medium text-muted-foreground">Business Name</Label>
                      <Input id="displayName" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Your Business" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
                      <Input id="email" type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="hello@example.com" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="phone">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone</Label>
                      <Input id="phone" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="+1 (555) 000-0000" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
                <form.Field name="website">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="website" className="text-xs font-medium text-muted-foreground">Website</Label>
                      <Input id="website" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="https://example.com" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
              </div>
              <form.Field name="taxId">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="taxId" className="text-xs font-medium text-muted-foreground">Tax ID / VAT Number</Label>
                    <Input id="taxId" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="US123456789" className="h-10 bg-background/50 border-border/60" />
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 border border-cyan-500/10">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Address</CardTitle>
                  <CardDescription className="text-xs">Your business address for invoices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <form.Field name="address">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-medium text-muted-foreground">Street Address</Label>
                    <Input id="address" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="123 Main St" className="h-10 bg-background/50 border-border/60" />
                  </div>
                )}
              </form.Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <form.Field name="city">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">City</Label>
                      <Input id="city" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="New York" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
                <form.Field name="postalCode">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="postalCode" className="text-xs font-medium text-muted-foreground">Postal Code</Label>
                      <Input id="postalCode" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="10001" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
                <form.Field name="country">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-xs font-medium text-muted-foreground">Country</Label>
                      <Input id="country" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="United States" className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Settings */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 border border-violet-500/10">
                  <FileText className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Invoice Defaults</CardTitle>
                  <CardDescription className="text-xs">Default settings for new invoices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <form.Field name="defaultCurrency">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">Default Currency</Label>
                      <Select value={field.state.value} onValueChange={(v) => v && field.handleChange(v)}>
                        <SelectTrigger className="h-10 bg-background/50 border-border/60"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (<SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
                <form.Field name="invoicePrefix">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="invoicePrefix" className="text-xs font-medium text-muted-foreground">Invoice Prefix</Label>
                      <Input id="invoicePrefix" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="INV-" className="h-10 bg-background/50 border-border/60 font-mono" />
                    </div>
                  )}
                </form.Field>
                <form.Field name="defaultPaymentTerms">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="defaultPaymentTerms" className="text-xs font-medium text-muted-foreground">Payment Terms (days)</Label>
                      <Input id="defaultPaymentTerms" type="number" value={field.state.value} onChange={(e) => field.handleChange(parseInt(e.target.value) || 30)} min={1} className="h-10 bg-background/50 border-border/60" />
                    </div>
                  )}
                </form.Field>
              </div>
              <form.Field name="defaultNotes">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="defaultNotes" className="text-xs font-medium text-muted-foreground">Default Notes</Label>
                    <Textarea id="defaultNotes" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Thank you for your business!" rows={3} className="bg-background/50 border-border/60 resize-none" />
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/10">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Payment Details</CardTitle>
                  <CardDescription className="text-xs">Bank account or payment instructions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <form.Field name="paymentDetails">
                {(field) => (
                  <Textarea value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder={"Bank: Example Bank\nAccount: 1234567890\nRouting: 987654321"} rows={4} className="bg-background/50 border-border/60 resize-none font-mono text-sm" />
                )}
              </form.Field>
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="h-10 gap-2 shadow-lg shadow-primary/15">
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

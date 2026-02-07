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
import { Textarea } from '@invoice/ui/components/textarea';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, User, MapPin, FileText, Save } from 'lucide-react';
import { toast } from 'sonner';

import { ProtectedRoute } from '@/components/protected-route';

export const Route = createFileRoute('/_app/clients/$id')({
  head: () => ({
    meta: [{ title: 'Edit Client | Invoice' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: EditClientPage,
});

function EditClientPage() {
  return (
    <ProtectedRoute>
      <EditClientContent />
    </ProtectedRoute>
  );
}

function EditClientContent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const client = useQuery(convexQuery(api.clients.get, { id: id as any }));
  const updateClient = useConvexMutation(api.clients.update);

  const form = useForm({
    defaultValues: {
      name: client.data?.name ?? '',
      email: client.data?.email ?? '',
      phone: client.data?.phone ?? '',
      address: client.data?.address ?? '',
      city: client.data?.city ?? '',
      country: client.data?.country ?? '',
      postalCode: client.data?.postalCode ?? '',
      taxId: client.data?.taxId ?? '',
      notes: client.data?.notes ?? '',
    },
    onSubmit: async ({ value }) => {
      try {
        await updateClient({ id: id as any, ...value });
        toast.success('Client updated successfully');
        navigate({ to: '/clients' });
      } catch {
        toast.error('Failed to update client');
      }
    },
  });

  if (client.isLoading) {
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto max-w-2xl px-6 py-10">
          <div className="animate-pulse space-y-5">
            <div className="h-8 bg-muted w-48" />
            <div className="h-64 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!client.data) {
    return (
      <div className="min-h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-xl mb-2">Client not found</h2>
          <Button onClick={() => navigate({ to: '/clients' })} variant="outline" className="h-10">
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto max-w-2xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-in-up">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate({ to: '/clients' })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-3xl tracking-tight">Edit Client</h1>
            <p className="text-sm text-muted-foreground">Update client information</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5 stagger-children"
        >
          {/* Basic Info */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 border border-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">Basic Information</CardTitle>
                  <CardDescription className="text-xs">
                    Client name and contact details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Client name"
                      required
                      className="h-10 bg-background/50 border-border/60"
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="client@example.com"
                      required
                      className="h-10 bg-background/50 border-border/60"
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="phone">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="h-10 bg-background/50 border-border/60"
                    />
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
                  <CardDescription className="text-xs">Client billing address</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <form.Field name="address">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-medium text-muted-foreground">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="123 Main St"
                      className="h-10 bg-background/50 border-border/60"
                    />
                  </div>
                )}
              </form.Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <form.Field name="city">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="New York"
                        className="h-10 bg-background/50 border-border/60"
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="postalCode">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="postalCode"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="10001"
                        className="h-10 bg-background/50 border-border/60"
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="country">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="country"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="United States"
                        className="h-10 bg-background/50 border-border/60"
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 bg-muted/20 py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/10">
                  <FileText className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-sm">Additional Information</CardTitle>
                  <CardDescription className="text-xs">Tax ID and notes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <form.Field name="taxId">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="taxId" className="text-xs font-medium text-muted-foreground">
                      Tax ID / VAT Number
                    </Label>
                    <Input
                      id="taxId"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="US123456789"
                      className="h-10 bg-background/50 border-border/60"
                    />
                  </div>
                )}
              </form.Field>
              <form.Field name="notes">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-medium text-muted-foreground">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Internal notes about this client..."
                      rows={3}
                      className="bg-background/50 border-border/60 resize-none"
                    />
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 border-border/60"
              onClick={() => navigate({ to: '/clients' })}
            >
              Cancel
            </Button>
            <Button type="submit" className="h-10 gap-2 shadow-lg shadow-primary/15">
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

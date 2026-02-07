import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@invoice/backend/convex/_generated/api';
import { Button } from '@invoice/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@invoice/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@invoice/ui/components/dropdown-menu';
import { Input } from '@invoice/ui/components/input';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { MoreHorizontal, Pencil, Plus, Search, Trash2, Users, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ProtectedRoute } from '@/components/protected-route';

export const Route = createFileRoute('/_app/clients/')({
  head: () => ({
    meta: [{ title: 'Clients | Invoice' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <ProtectedRoute>
      <ClientsPageContent />
    </ProtectedRoute>
  );
}

function ClientsPageContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const clients = useQuery(convexQuery(api.clients.list, {}));
  const deleteClient = useConvexMutation(api.clients.remove);

  const filteredClients = clients.data?.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteClient({ id: id as any });
      toast.success('Client deleted successfully');
    } catch {
      toast.error('Failed to delete client');
    }
  };

  return (
    <div className="min-h-full relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-primary/[0.02] blur-[200px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8 animate-in-up">
          <div className="space-y-2">
            <h1 className="font-display text-5xl tracking-tight">Clients</h1>
            <p className="text-muted-foreground text-[15px]">Manage your client relationships</p>
          </div>
          <Link to="/clients/new">
            <Button className="h-10 gap-2 shadow-lg shadow-primary/15">
              <Plus className="h-3.5 w-3.5" />
              Add Client
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-in-up" style={{ animationDelay: '0.1s' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 max-w-sm h-10 bg-card border-border/60 text-sm"
          />
        </div>

        {/* Client List */}
        <div className="animate-in-up" style={{ animationDelay: '0.15s' }}>
          {clients.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-muted" />
                      <div className="h-4 bg-muted w-24" />
                    </div>
                    <div className="h-3 bg-muted w-36 mb-2" />
                    <div className="h-3 bg-muted w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !filteredClients?.length ? (
            <Card className="card-premium">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="w-14 h-14 bg-muted/40 flex items-center justify-center mb-5">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2">No clients yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-8 max-w-sm">
                  {searchTerm
                    ? 'No clients match your search'
                    : 'Add your first client to start creating invoices'}
                </p>
                {!searchTerm && (
                  <Link to="/clients/new">
                    <Button className="h-10">
                      <Plus className="h-3.5 w-3.5 mr-2" />
                      Add Client
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
              {filteredClients.map((client) => (
                <Card key={client._id} className="card-premium group">
                  <CardHeader className="pb-2 pt-5 px-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 border border-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <CardTitle className="text-sm font-semibold">
                          <Link
                            to="/clients/$id"
                            params={{ id: client._id }}
                            className="hover:text-primary transition-colors"
                          >
                            {client.name}
                          </Link>
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/50">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="text-xs">
                            <Link
                              to="/clients/$id"
                              params={{ id: client._id }}
                              className="flex items-center w-full"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs text-destructive focus:text-destructive"
                            onClick={() => handleDelete(client._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 px-5 pb-5">
                    <div className="space-y-1.5 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

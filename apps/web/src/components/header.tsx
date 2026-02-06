import { Button } from '@invoice/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@invoice/ui/components/dropdown-menu';
import { Link, useNavigate } from '@tanstack/react-router';
import { FileText, Users, LayoutDashboard, Settings, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useAuth } from '@/lib/use-auth';

export default function Header() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        {/* Logo & Nav */}
        <div className="flex items-center gap-10">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="group flex items-center gap-3">
            {/* Monogram Logo */}
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden bg-primary text-primary-foreground transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
              <span className="font-display text-lg">I</span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <div className="hidden sm:block">
              <span className="text-[17px] font-semibold tracking-tight">Invoice</span>
              <span className="text-primary ml-0.5">.</span>
            </div>
          </Link>

          {isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
              <NavLink to="/invoices" icon={FileText}>
                Invoices
              </NavLink>
              <NavLink to="/clients" icon={Users}>
                Clients
              </NavLink>
            </nav>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <>
              {/* Mobile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="md:hidden h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                  <Menu className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 md:hidden">
                  <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/invoices' })}>
                    <FileText className="h-4 w-4 mr-2" />
                    Invoices
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/clients' })}>
                    <Users className="h-4 w-4 mr-2" />
                    Clients
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="group relative ml-1">
                  <div className="flex h-8 w-8 items-center justify-center bg-muted hover:bg-muted/80 transition-all duration-200 cursor-pointer overflow-hidden border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {user?.name?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </span>
                  </div>
                  {/* Active indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-emerald-500 border-[1.5px] border-background" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-1">
                  {/* User info */}
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate({ to: '/settings' })}
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer"
                  >
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="h-8 text-sm font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function NavLink({ to, icon: Icon, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
      {/* Active indicator — bottom bar */}
      <span className="absolute -bottom-[13px] left-0 right-0 h-px bg-primary scale-x-0 group-[.active]:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}

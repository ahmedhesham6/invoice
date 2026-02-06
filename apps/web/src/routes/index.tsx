import { Button } from '@invoice/ui/components/button';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  Zap,
  Globe,
  FileText,
  CreditCard,
  Shield,
  Clock,
  Star,
  Quote,
  ChevronRight,
  Code2,
  GitFork,
  Heart,
} from 'lucide-react';
import { useEffect } from 'react';

import { useAuth } from '@/lib/use-auth';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

const GITHUB_URL = 'https://github.com/ahmedhesham6/invoice';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <HeroSection />
      <OpenSourceBanner />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-primary/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] left-[50%] w-[600px] h-[200px] bg-cyan-500/5 blur-[100px] rounded-full -translate-x-1/2" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          {/* Badge — Open Source */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-in-down inline-flex items-center gap-2.5 px-4 py-2 bg-primary/8 border border-primary/15 mb-12 cursor-pointer group hover:bg-primary/12 transition-colors"
          >
            <GitHubIcon className="h-3.5 w-3.5 text-primary/80" />
            <span className="text-xs font-medium tracking-wide text-primary/90 uppercase">
              Open source on GitHub
            </span>
            <ChevronRight className="h-3 w-3 text-primary/50 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Headline */}
          <h1 className="animate-in-up font-display text-6xl sm:text-7xl md:text-8xl lg:text-[112px] leading-[0.9] tracking-tight mb-8">
            <span className="block">Get paid</span>
            <span className="block font-display-italic text-gradient">effortlessly.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-in-up text-lg sm:text-xl text-muted-foreground max-w-xl mb-14 leading-relaxed"
            style={{ animationDelay: '0.1s' }}
          >
            The open-source invoicing platform for freelancers.
            <span className="text-foreground font-medium"> Create. Share. Get paid. </span>
            No vendor lock-in, ever.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-in-up flex flex-col sm:flex-row items-center gap-3 mb-16"
            style={{ animationDelay: '0.2s' }}
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="h-12 px-8 text-[15px] font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-[15px] font-medium border-border/60 hover:bg-muted/40 hover:border-border gap-2"
              >
                <GitHubIcon className="h-4 w-4" />
                Star on GitHub
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div
            className="animate-in-up flex flex-wrap justify-center gap-8 text-sm"
            style={{ animationDelay: '0.25s' }}
          >
            {['100% open source', 'Self-hostable', 'Free forever'].map((text) => (
              <span key={text} className="flex items-center gap-2 text-muted-foreground/80">
                <Check className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium tracking-wide">{text}</span>
              </span>
            ))}
          </div>

          {/* Preview Card */}
          <div className="animate-in-up mt-20 w-full max-w-4xl" style={{ animationDelay: '0.35s' }}>
            <div className="relative group">
              <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative bg-card border border-border/60 shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-muted/40 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 bg-background/60 text-[11px] font-mono text-muted-foreground/60 border border-border/30">
                      invoice.app/dashboard
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-8 sm:p-10">
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5 font-medium">
                        Invoice
                      </div>
                      <div className="text-2xl font-semibold tracking-tight">#INV-001</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5 font-medium">
                        Amount Due
                      </div>
                      <div className="font-display text-4xl text-primary">
                        $2,400<span className="text-xl">.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-muted/30 border border-border/30">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1.5">
                        Client
                      </div>
                      <div className="font-medium text-sm">Acme Corp</div>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border/30">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1.5">
                        Due Date
                      </div>
                      <div className="font-medium text-sm">Feb 15, 2026</div>
                    </div>
                    <div className="p-4 bg-primary/8 border border-primary/15">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-primary/60 mb-1.5">
                        Status
                      </div>
                      <div className="font-medium text-sm text-primary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
                        Pending
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Open Source Banner ────────────────────────────────────── */

function OpenSourceBanner() {
  return (
    <section className="py-16 border-y border-border/40 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="container mx-auto max-w-6xl px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left — Message */}
          <div className="text-center md:text-left max-w-lg">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Code2 className="h-4 w-4 text-primary" />
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
                Open Source
              </p>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl tracking-tight mb-3">
              Built in the open,
              <br className="hidden sm:block" /> for everyone.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Invoice is fully open source. Inspect the code, self-host it, or contribute. No hidden
              fees, no vendor lock-in — your data stays yours.
            </p>
          </div>

          {/* Right — Stats & CTA */}
          <div className="flex flex-col items-center md:items-end gap-5">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <GitHubIcon className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-medium">
                    GitHub
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/60">MIT License</p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <GitFork className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-medium">
                    Fork & Deploy
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/60">Self-hostable</p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Heart className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-[0.15em] font-medium">
                    Community
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/60">Contributions welcome</p>
              </div>
            </div>

            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="h-10 gap-2.5 border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <GitHubIcon className="h-4 w-4" />
                <span className="font-medium text-sm">View on GitHub</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Features ─────────────────────────────────────────────── */

function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: 'Beautiful Invoices',
      desc: 'Create polished, professional invoices with your branding in seconds.',
      accent: 'text-primary bg-primary/10 border-primary/15',
    },
    {
      icon: Globe,
      title: 'Share Anywhere',
      desc: 'Send invoices via unique link. No client signup or account required.',
      accent: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/15',
    },
    {
      icon: CreditCard,
      title: 'Track Payments',
      desc: 'Real-time visibility into invoice views and payment status.',
      accent: 'text-amber-500 bg-amber-500/10 border-amber-500/15',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'From draft to sent in under 60 seconds. No friction.',
      accent: 'text-violet-500 bg-violet-500/10 border-violet-500/15',
    },
    {
      icon: Shield,
      title: 'Fully Open Source',
      desc: 'MIT licensed. Inspect the code, self-host, or contribute on GitHub.',
      accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15',
    },
    {
      icon: Clock,
      title: 'Auto Reminders',
      desc: 'Automatic overdue detection with smart reminder alerts.',
      accent: 'text-rose-500 bg-rose-500/10 border-rose-500/15',
    },
  ];

  return (
    <section className="py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 blur-[200px] rounded-full" />
      <div className="container mx-auto max-w-6xl px-6 relative">
        <div className="text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary/80 font-medium mb-4">
            Features
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-5">
            Everything you need,
            <br />
            <span className="font-display-italic text-muted-foreground">nothing you don't.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            Powerful features wrapped in a simple, beautiful interface.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50">
          {features.map(({ icon: Icon, title, desc, accent }) => {
            const [textColor, bgColor, borderColor] = accent.split(' ');
            return (
              <div
                key={title}
                className="group p-8 bg-background hover:bg-card transition-colors duration-300 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div
                  className={`w-10 h-10 ${bgColor} border ${borderColor} flex items-center justify-center mb-5`}
                >
                  <Icon className={`h-4.5 w-4.5 ${textColor}`} />
                </div>
                <h3 className="text-[15px] font-semibold mb-2 tracking-tight">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ─────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create',
      desc: 'Add your client, line items, and any notes or payment details.',
    },
    {
      num: '02',
      title: 'Share',
      desc: 'Send a unique link to your client. They see a beautiful invoice page.',
    },
    {
      num: '03',
      title: 'Get Paid',
      desc: 'Track status in real-time. Mark as paid when the money arrives.',
    },
  ];

  return (
    <section className="py-28 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary/80 font-medium mb-4">
            How it works
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
            Three steps to getting paid.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="relative text-center md:text-left">
              {i < 2 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px border-t border-dashed border-border/60" />
              )}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground font-display text-xl mb-5">
                {num}
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────────────── */

function Testimonials() {
  const testimonials = [
    {
      quote: 'I was spending hours on invoicing every week. Now it takes me 2 minutes flat.',
      name: 'Sarah Chen',
      role: 'UI Designer',
      initial: 'S',
    },
    {
      quote: 'The shareable links are genius. My clients love the clean invoice page.',
      name: 'Marcus Johnson',
      role: 'Full-Stack Developer',
      initial: 'M',
    },
    {
      quote: "Finally, invoicing that doesn't feel like a chore. It's actually enjoyable.",
      name: 'Emma Williams',
      role: 'Brand Consultant',
      initial: 'E',
    },
  ];

  return (
    <section className="py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary/80 font-medium mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight mb-5">
            Loved by freelancers
          </h2>
          <div className="flex items-center justify-center gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">4.9/5 from 500+ reviews</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, initial }) => (
            <div
              key={name}
              className="group p-7 bg-card border border-border/60 hover:border-primary/20 transition-all duration-300 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Quote className="h-6 w-6 text-primary/20 mb-5" />
              <p className="text-[15px] leading-relaxed mb-7">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-muted border border-border/50 flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {initial}
                </div>
                <div>
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-muted-foreground">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ──────────────────────────────────────────────── */

function PricingSection() {
  return (
    <section className="py-28 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary/80 font-medium mb-4">
            Pricing
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
            Free & open source.
          </h2>
          <p className="text-muted-foreground text-lg">
            No tricks. Use it for free, or self-host it yourself.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free / Cloud */}
          <div className="p-8 bg-card border border-border/60 relative group hover:border-border transition-colors">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-4">
              Cloud
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-5xl">$0</span>
            </div>
            <div className="text-sm text-muted-foreground mb-8">Free forever</div>
            <ul className="space-y-3 mb-10">
              {[
                'Unlimited invoices',
                'Unlimited clients',
                'PDF exports',
                'Shareable links',
                'Auto reminders',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup">
              <Button variant="outline" className="w-full h-11 font-medium border-border/60">
                Get started
              </Button>
            </Link>
          </div>

          {/* Self-hosted */}
          <div className="p-8 bg-card border border-primary/30 relative group">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.15em]">
              Self-hosted
            </div>
            <div className="absolute -inset-px bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium mb-4">
                Open Source
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-5xl">Free</span>
              </div>
              <div className="text-sm text-muted-foreground mb-8">Deploy on your own infra</div>
              <ul className="space-y-3 mb-10">
                {[
                  'Everything in Cloud',
                  'Full source code access',
                  'Your own database',
                  'Custom domain',
                  'No usage limits',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full h-11 font-medium shadow-lg shadow-primary/20 gap-2">
                  <GitHubIcon className="h-4 w-4" />
                  Clone from GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[150px] rounded-full" />
      <div className="container mx-auto max-w-4xl px-6 text-center relative">
        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight mb-6 leading-[0.95]">
          Ready to get paid
          <br />
          <span className="font-display-italic text-gradient">faster?</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto">
          Join hundreds of freelancers using the open-source invoicing platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/signup">
            <Button
              size="lg"
              className="h-12 px-10 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get started free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-medium border-border/60 hover:bg-muted/40 hover:border-border gap-2"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="py-8 border-t border-border/40">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary flex items-center justify-center text-primary-foreground">
              <span className="font-display text-sm">I</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">Invoice</span>
          </div>
          <div className="flex items-center gap-8 text-xs text-muted-foreground">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              GitHub
            </a>
            <Link to="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">
              Get started
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Invoice · Open source under MIT
          </p>
        </div>
      </div>
    </footer>
  );
}

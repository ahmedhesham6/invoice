/**
 * SEO utilities for Invoice App
 * Structured data (JSON-LD), meta tag helpers, and OpenGraph defaults
 */

// ─── JSON-LD Component ────────────────────────────────────────────────────────

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SITE_URL = 'https://invoice.ahmedhesham.dev';
export const SITE_NAME = 'Invoice';
export const SITE_DESCRIPTION =
  'The open-source invoicing platform for freelancers. Create professional invoices, share them via unique links, and get paid faster. Free forever, self-hostable, no vendor lock-in.';
export const SITE_TAGLINE = 'Professional Invoicing for Freelancers';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = '@ahmedhesham6';
export const GITHUB_URL = 'https://github.com/ahmedhesham6/invoice';

// ─── Meta Tag Helpers ─────────────────────────────────────────────────────────

interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

export function getPageMeta({
  title,
  description,
  path = '',
  ogImage = OG_IMAGE,
  noindex = false,
  type = 'website',
}: PageSeoOptions) {
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullTitle =
    path === '' || path === '/' ? `${SITE_NAME} — ${SITE_TAGLINE}` : `${title} | ${SITE_NAME}`;

  const meta: Array<Record<string, string>> = [
    { title: fullTitle },
    { name: 'description', content: description },

    // OpenGraph
    { property: 'og:type', content: type },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${SITE_NAME} — ${title}` },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'en_US' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:site', content: TWITTER_HANDLE },

    // Additional SEO
    {
      name: 'robots',
      content: noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    { name: 'theme-color', content: '#1a9a8a' },
    { name: 'application-name', content: SITE_NAME },
    { name: 'apple-mobile-web-app-title', content: SITE_NAME },
  ];

  return { meta, canonicalUrl };
}

// ─── Structured Data Templates ────────────────────────────────────────────────

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: SITE_DESCRIPTION,
    sameAs: [GITHUB_URL],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SITE_URL}/signup`,
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    featureList: [
      'Create professional invoices',
      'Share invoices via unique links',
      'PDF export and download',
      'Client management',
      'Invoice status tracking',
      'Tax and discount calculations',
      'Auto overdue detection',
      'Business profile customization',
      'Open source and self-hostable',
    ],
    screenshot: OG_IMAGE,
    author: {
      '@type': 'Person',
      name: 'Ahmed Hesham',
      url: 'https://ahmedhesham.dev',
    },
  };
}

export function getWebPageSchema(title: string, description: string, path: string = '') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFaqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getHowToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create and Send a Professional Invoice',
    description:
      'Create professional invoices in under 60 seconds with Invoice — the open-source invoicing platform for freelancers.',
    totalTime: 'PT1M',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Create Your Invoice',
        text: 'Add your client details, line items with quantities and rates, and any notes or payment details.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Share with Your Client',
        text: 'Send a unique shareable link to your client. They see a beautiful, professional invoice page — no signup required.',
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Get Paid',
        text: 'Track invoice status in real-time. Mark as paid when payment arrives. Automatic overdue detection alerts you to follow up.',
        position: 3,
      },
    ],
  };
}

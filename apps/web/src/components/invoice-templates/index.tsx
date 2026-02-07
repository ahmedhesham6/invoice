import type { InvoiceTemplateId, InvoiceTemplateProps, TemplateMetadata } from './types';

import { BoldTemplate } from './bold';
import { ClassicTemplate } from './classic';
import { ElegantTemplate } from './elegant';
import { MinimalTemplate } from './minimal';
import { MonoTemplate } from './mono';
import { NeonTemplate } from './neon';
import { OceanTemplate } from './ocean';
import { RetroTemplate } from './retro';
import { SunsetTemplate } from './sunset';

export type { InvoiceTemplateId, InvoiceTemplateProps, TemplateMetadata };

export const TEMPLATE_REGISTRY: Record<
  InvoiceTemplateId,
  {
    component: React.ComponentType<InvoiceTemplateProps>;
    metadata: TemplateMetadata;
  }
> = {
  classic: {
    component: ClassicTemplate,
    metadata: {
      id: 'classic',
      name: 'Classic',
      description: 'Clean corporate layout with dark header. Professional and structured.',
      tags: ['professional', 'corporate', 'structured'],
      previewColors: { bg: '#ffffff', accent: '#1a1a1a', text: '#1a1a1a' },
    },
  },
  minimal: {
    component: MinimalTemplate,
    metadata: {
      id: 'minimal',
      name: 'Minimal',
      description: 'Stark whitespace, whisper-quiet hierarchy. Scandinavian simplicity.',
      tags: ['clean', 'simple', 'modern'],
      previewColors: { bg: '#ffffff', accent: '#e0e0e0', text: '#2c2c2c' },
    },
  },
  bold: {
    component: BoldTemplate,
    metadata: {
      id: 'bold',
      name: 'Bold',
      description: 'Heavy type, vibrant orange accent. Creative agency energy.',
      tags: ['creative', 'loud', 'impactful'],
      previewColors: { bg: '#111111', accent: '#ff5722', text: '#ffffff' },
    },
  },
  elegant: {
    component: ElegantTemplate,
    metadata: {
      id: 'elegant',
      name: 'Elegant',
      description: 'Serif typography, cream paper, gold accents. Timeless refinement.',
      tags: ['luxury', 'refined', 'serif'],
      previewColors: { bg: '#faf8f3', accent: '#9c7c38', text: '#2d2a26' },
    },
  },
  retro: {
    component: RetroTemplate,
    metadata: {
      id: 'retro',
      name: 'Retro',
      description: 'Warm earth tones, typewriter mono, vintage receipt vibes.',
      tags: ['vintage', 'warm', 'nostalgic'],
      previewColors: { bg: '#fdf6ee', accent: '#c5632d', text: '#6b4423' },
    },
  },
  neon: {
    component: NeonTemplate,
    metadata: {
      id: 'neon',
      name: 'Neon',
      description: 'Dark background, glowing cyan and magenta. Cyberpunk futurism.',
      tags: ['dark', 'tech', 'futuristic'],
      previewColors: { bg: '#0a0a0f', accent: '#00e5ff', text: '#e0e0e8' },
    },
  },
  mono: {
    component: MonoTemplate,
    metadata: {
      id: 'mono',
      name: 'Mono',
      description: 'Pure black & white, editorial magazine aesthetic. Dramatic contrast.',
      tags: ['editorial', 'b&w', 'contrast'],
      previewColors: { bg: '#ffffff', accent: '#000000', text: '#000000' },
    },
  },
  ocean: {
    component: OceanTemplate,
    metadata: {
      id: 'ocean',
      name: 'Ocean',
      description: 'Deep navy gradient with teal accents. Calm, confident, and deep.',
      tags: ['blue', 'calm', 'gradient'],
      previewColors: { bg: '#f0f6fa', accent: '#0ea5a0', text: '#0c1f3f' },
    },
  },
  sunset: {
    component: SunsetTemplate,
    metadata: {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm coral-to-violet gradient. Modern, vibrant, and friendly.',
      tags: ['warm', 'gradient', 'modern'],
      previewColors: { bg: '#fefbf9', accent: '#f97068', text: '#4a4458' },
    },
  },
};

export const TEMPLATE_IDS = Object.keys(TEMPLATE_REGISTRY) as InvoiceTemplateId[];

export function getTemplateComponent(id: InvoiceTemplateId) {
  return TEMPLATE_REGISTRY[id]?.component ?? TEMPLATE_REGISTRY.classic.component;
}

export function getTemplateMetadata(id: InvoiceTemplateId) {
  return TEMPLATE_REGISTRY[id]?.metadata ?? TEMPLATE_REGISTRY.classic.metadata;
}

/**
 * Resolve which template to use for an invoice.
 * Priority: invoice override > client override > profile default > 'classic'
 */
export function resolveTemplate(
  invoiceTemplate?: string | null,
  clientTemplate?: string | null,
  profileDefault?: string | null
): InvoiceTemplateId {
  const template = invoiceTemplate || clientTemplate || profileDefault || 'classic';
  return TEMPLATE_IDS.includes(template as InvoiceTemplateId)
    ? (template as InvoiceTemplateId)
    : 'classic';
}

/**
 * Renders the correct invoice template based on ID.
 */
export function InvoiceTemplate({
  templateId,
  invoice,
  profile,
}: InvoiceTemplateProps & { templateId: InvoiceTemplateId }) {
  const Component = getTemplateComponent(templateId);
  return <Component invoice={invoice} profile={profile} />;
}

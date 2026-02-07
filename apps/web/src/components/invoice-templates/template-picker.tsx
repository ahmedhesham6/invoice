import type { InvoiceTemplateId } from './types';
/**
 * TemplatePicker — a beautiful visual grid for selecting invoice templates.
 * Shows mini preview cards with colors, name, description, and active state.
 * Each card has an eye button that opens a full preview dialog with demo data.
 */
import { Check, Sparkles } from 'lucide-react';

import { TemplatePreviewDialog } from './template-preview-dialog';

import { TEMPLATE_IDS, TEMPLATE_REGISTRY } from './index';

interface TemplatePickerProps {
  value: InvoiceTemplateId;
  onChange: (id: InvoiceTemplateId) => void;
  /** Show "Use default" option for client/invoice overrides */
  showDefault?: boolean;
  onClearOverride?: () => void;
  isOverridden?: boolean;
}

export function TemplatePicker({
  value,
  onChange,
  showDefault,
  onClearOverride,
  isOverridden,
}: TemplatePickerProps) {
  return (
    <div className="space-y-3">
      {showDefault && isOverridden && onClearOverride && (
        <button
          type="button"
          onClick={onClearOverride}
          className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          ← Reset to default template
        </button>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TEMPLATE_IDS.map((id) => {
          const { metadata } = TEMPLATE_REGISTRY[id];
          const isActive = value === id;

          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                // Only select if the click didn't come from the preview eye button
                if (!(e.target as HTMLElement).closest('[data-template-preview]')) {
                  onChange(id);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(id);
                }
              }}
              className={`
                group relative text-left transition-all duration-200 overflow-hidden cursor-pointer
                border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${
                  isActive
                    ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/30'
                    : 'border-border/50 hover:border-border hover:shadow-md'
                }
              `}
            >
              {/* Mini color preview */}
              <div
                className="relative h-20 overflow-hidden"
                style={{ background: metadata.previewColors.bg }}
              >
                {/* Eye / Preview button */}
                <TemplatePreviewDialog templateId={id} />

                {/* Abstract layout preview */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                  {/* Top bar */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div
                        className="h-1 w-8"
                        style={{ background: metadata.previewColors.accent, opacity: 0.9 }}
                      />
                      <div
                        className="h-0.5 w-5"
                        style={{ background: metadata.previewColors.text, opacity: 0.2 }}
                      />
                    </div>
                    <div
                      className="h-3 w-3"
                      style={{ background: metadata.previewColors.accent, opacity: 0.15 }}
                    />
                  </div>
                  {/* Middle lines (table preview) */}
                  <div className="space-y-[3px]">
                    <div
                      className="h-[2px] w-full"
                      style={{ background: metadata.previewColors.accent, opacity: 0.12 }}
                    />
                    <div
                      className="h-[2px] w-4/5"
                      style={{ background: metadata.previewColors.text, opacity: 0.08 }}
                    />
                    <div
                      className="h-[2px] w-3/5"
                      style={{ background: metadata.previewColors.text, opacity: 0.08 }}
                    />
                    <div
                      className="h-[2px] w-full"
                      style={{ background: metadata.previewColors.accent, opacity: 0.12 }}
                    />
                  </div>
                  {/* Bottom total */}
                  <div className="flex justify-end">
                    <div
                      className="h-1.5 w-10"
                      style={{ background: metadata.previewColors.accent, opacity: 0.5 }}
                    />
                  </div>
                </div>

                {/* Active checkmark */}
                {isActive && (
                  <div
                    className="absolute top-1.5 right-1.5 h-5 w-5 flex items-center justify-center bg-primary"
                    style={{ borderRadius: '50%' }}
                  >
                    <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5 bg-card">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {id === 'neon' && <Sparkles className="h-3 w-3 text-cyan-400" />}
                  <p
                    className={`text-xs font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}
                  >
                    {metadata.name}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                  {metadata.description}
                </p>
                {/* Tags */}
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] px-1.5 py-0.5 bg-muted text-muted-foreground uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

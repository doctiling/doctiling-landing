'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { BrowserFrame } from '@doctiling/ui/molecules/browser-frame';
import { cn } from '@doctiling/ui/cn';
import { Reveal } from './Reveal';

// Captures of the real public reader over a fictional demo knowledge base
// (local dev.db, published at /es/p/demo-operaciones-t3, "Nortera Logística").
// Regenerate them from the product at 2x, never mock
// them — the footnote tells visitors exactly what they are looking at.
export const EVIDENCE_TABS = [
  { key: 'analysis', shots: ['/landing/evidence/analysis-risks.webp', '/landing/evidence/quadrant.webp'] },
  { key: 'tables', shots: ['/landing/evidence/table-doc.webp', '/landing/evidence/kpi-table.webp'] },
  { key: 'charts', shots: ['/landing/evidence/bar-chart.webp', '/landing/evidence/pie-chart.webp'] },
  { key: 'graphs', shots: ['/landing/evidence/entity-graph.webp', '/landing/evidence/mindmap.webp'] },
  { key: 'code', shots: ['/landing/evidence/flow.webp', '/landing/evidence/code.webp'] },
  { key: 'publish', shots: ['/landing/evidence/published-kb.webp'] },
] as const;

type TabKey = (typeof EVIDENCE_TABS)[number]['key'];

export function EvidenceSection() {
  const { t } = useLandingText();
  const [active, setActive] = useState<TabKey>(EVIDENCE_TABS[0].key);
  const tab = EVIDENCE_TABS.find((x) => x.key === active) ?? EVIDENCE_TABS[0];
  const base = `landing.evidence.tabs.${tab.key}`;

  return (
    <section id="evidence" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.evidence.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.evidence.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('landing.evidence.lede')}</p>
        </Reveal>

        <div
          role="tablist"
          aria-label={t('landing.evidence.tablistLabel')}
          className="mt-12 flex gap-2 overflow-x-auto pb-2"
        >
          {EVIDENCE_TABS.map(({ key }) => {
            const selected = key === tab.key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                id={`evidence-tab-${key}`}
                aria-selected={selected}
                aria-controls="evidence-panel"
                onClick={() => setActive(key)}
                className={cn(
                  'shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                    : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground',
                )}
              >
                {t(`landing.evidence.tabs.${key}.label`)}
              </button>
            );
          })}
        </div>

        <div
          id="evidence-panel"
          role="tabpanel"
          aria-labelledby={`evidence-tab-${tab.key}`}
          className="mt-8 flex flex-col gap-10"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <h3 className="font-display text-3xl leading-snug">{t(`${base}.title`)}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t(`${base}.body`)}</p>
            </div>
            <ul className="space-y-2 self-end lg:col-span-5">
              {(['p1', 'p2', 'p3'] as const).map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-foreground/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{t(`${base}.bullets.${p}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              'grid grid-cols-1 items-start gap-8',
              tab.shots.length > 1 ? 'md:grid-cols-2' : 'mx-auto w-full max-w-5xl',
            )}
          >
            {tab.shots.map((src, i) =>
              tab.key === 'publish' ? (
                <figure key={src} className="flex flex-col gap-3">
                  <BrowserFrame src={src} alt={t(`${base}.shots.${i}.alt`)} width={1280} height={900} />
                  <figcaption className="text-xs leading-relaxed text-muted-foreground">
                    {t(`${base}.shots.${i}.caption`)}
                  </figcaption>
                </figure>
              ) : (
                <figure key={src} className="flex flex-col gap-3">
                  <div className="landing-shot overflow-hidden bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={t(`${base}.shots.${i}.alt`)}
                      loading="lazy"
                      className="block h-auto w-full"
                    />
                  </div>
                  <figcaption className="text-xs leading-relaxed text-muted-foreground">
                    {t(`${base}.shots.${i}.caption`)}
                  </figcaption>
                </figure>
              ),
            )}
          </div>
        </div>

        <p className="mt-12 max-w-3xl border-l-2 border-primary pl-5 text-xs leading-relaxed text-muted-foreground">
          {t('landing.evidence.footnote')}
        </p>
      </div>
    </section>
  );
}

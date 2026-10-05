'use client';

import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { TextDocPreview, TableDocPreview, GraphDocPreview } from './landing-diagrams';

const TYPES = [
  { key: 'text', Preview: TextDocPreview },
  { key: 'table', Preview: TableDocPreview },
  { key: 'graph', Preview: GraphDocPreview },
] as const;

export function DocTypesSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { t } = useLandingText();

  return (
    <section id="doc-types" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        {!hideHeader && (
          <Reveal className="flex max-w-3xl flex-col gap-4">
            <MiniTitle>{t('landing.docTypes.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.docTypes.title')}
            </H2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('landing.docTypes.lede')}
            </p>
          </Reveal>
        )}

        <div className={`${hideHeader ? '' : 'mt-14 '}grid grid-cols-1 gap-px bg-border lg:grid-cols-3`}>
          {TYPES.map(({ key, Preview }, i) => (
            <Reveal key={key} delay={i * 130} className="bg-background">
              <article className="flex h-full flex-col gap-5 p-7">
                <div className="overflow-hidden rounded-lg border border-border bg-card/70 p-3">
                  <Preview
                    label={t(`landing.docTypes.items.${key}.previewAlt`)}
                    className="h-auto w-full text-foreground/70"
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {t(`landing.docTypes.items.${key}.kicker`)}
                </span>
                <h3 className="font-display text-2xl leading-snug">
                  {t(`landing.docTypes.items.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.docTypes.items.${key}.body`)}
                </p>
                <ul className="mt-auto space-y-1.5 pt-2">
                  {(['p1', 'p2', 'p3'] as const).map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent/70" />
                      <span>{t(`landing.docTypes.items.${key}.bullets.${p}`)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-10">
          <p className="max-w-3xl border-l-2 border-accent/60 pl-5 text-sm leading-relaxed text-muted-foreground">
            {t('landing.docTypes.footnote')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

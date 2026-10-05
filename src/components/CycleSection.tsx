'use client';

import { FileStack, MessageSquareQuote, Columns2, Share2 } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { FeatureIllustration } from './illustrations';

// The loop the product actually runs, in the order the user lives it. It
// replaces the old capabilities tabs + feature grid, which said the same four
// things twice and hid three quarters of them behind a tab.
const STAGES = [
  { key: 'convert', Icon: FileStack, art: 'knowledgeBase' },
  { key: 'cite', Icon: MessageSquareQuote, art: 'rag' },
  { key: 'stack', Icon: Columns2, art: 'mirror' },
  { key: 'deliver', Icon: Share2, art: 'mcp' },
] as const;

export function CycleSection() {
  const { t } = useLandingText();

  return (
    <section id="cycle" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.cycle.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.cycle.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t('landing.cycle.lede')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px bg-border lg:grid-cols-2">
          {STAGES.map(({ key, Icon, art }, i) => (
            <Reveal key={key} delay={i * 110} className="bg-card">
              <article className="group relative h-full p-8 transition-colors hover:bg-background lg:p-10">
                <FeatureIllustration
                  name={art}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-6 hidden size-24 text-foreground/[0.07] transition-colors group-hover:text-accent/30 lg:block"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      0{i + 1}
                    </span>
                    <Icon className="size-4 text-accent" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                      {t(`landing.cycle.stages.${key}.step`)}
                    </span>
                  </div>
                  <h3 className="relative mt-4 max-w-md font-display text-2xl leading-snug">
                    {t(`landing.cycle.stages.${key}.title`)}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.cycle.stages.${key}.body`)}
                  </p>
                  <ul className="mt-5 space-y-1.5">
                    {(['p1', 'p2', 'p3'] as const).map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-foreground/85">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        <span>{t(`landing.cycle.stages.${key}.bullets.${p}`)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-l-2 border-accent/40 pl-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {t('landing.cycle.scenarioLabel')}
                    </span>
                    <p className="mt-2 font-display text-base italic leading-relaxed text-foreground/90">
                      {t(`landing.cycle.stages.${key}.scenario`)}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(`landing.cycle.stages.${key}.outcome`)}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

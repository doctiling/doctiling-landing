'use client';

import { ArrowRight } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

// The positioning bet: retrieval stopped being the project. What decides the
// outcome now is how a team governs its knowledge bases — who feeds them, who
// asks, and from which tool.
const SHIFTS = ['project', 'scope', 'reach', 'ownership'] as const;

export function ThesisSection() {
  const { t } = useLandingText();

  return (
    <section id="thesis" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <MiniTitle className="mb-6">{t('landing.thesis.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.thesis.title')}
            </H2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              {t('landing.thesis.lede')}
            </p>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4">
              {SHIFTS.map((shift) => (
                <article key={shift} className="landing-card landing-card-hover p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground line-through decoration-accent/60">
                      {t(`landing.thesis.shifts.${shift}.before`)}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
                    <span className="font-display text-lg leading-snug">
                      {t(`landing.thesis.shifts.${shift}.after`)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.thesis.shifts.${shift}.body`)}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

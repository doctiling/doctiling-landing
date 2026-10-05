'use client';

import { Stethoscope, Users, TrendingUp, Layers } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

const CASES = [
  { key: 'clinical', Icon: Stethoscope },
  { key: 'hr', Icon: Users },
  { key: 'sales', Icon: TrendingUp },
  { key: 'portfolio', Icon: Layers },
] as const;

export function SharingSection() {
  const { t } = useLandingText();

  return (
    <section id="sharing" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.sharing.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.sharing.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t('landing.sharing.lede')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CASES.map(({ key, Icon }) => (
            <article key={key} className="flex h-full flex-col gap-3 bg-card p-7">
              <Icon className="size-5 text-accent" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t(`landing.sharing.cases.${key}.parties`)}
              </span>
              <h3 className="font-display text-xl leading-snug">
                {t(`landing.sharing.cases.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.sharing.cases.${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

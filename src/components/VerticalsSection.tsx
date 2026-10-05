'use client';

import Link from 'next/link';
import { ArrowUpRight, Briefcase, Calculator, GraduationCap, Landmark, Scale, Stethoscope } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

const VERTICALS = [
  { key: 'legal', Icon: Scale },
  { key: 'health', Icon: Stethoscope },
  { key: 'finance', Icon: Landmark },
  { key: 'accounting', Icon: Calculator },
  { key: 'research', Icon: GraduationCap },
  { key: 'consulting', Icon: Briefcase },
] as const;

export function VerticalsSection() {
  const { t, locale } = useLandingText();

  return (
    <section id="verticals" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.verticals.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.verticals.title')}
          </H2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {t('landing.verticals.lede')}
          </p>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={(i % 3) * 120} className="bg-background">
              <article className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-card/60">
                <Icon aria-hidden="true" className="size-7 text-accent/70" />
                <h3 className="font-display text-2xl leading-snug">
                  {t(`landing.verticals.items.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.verticals.items.${key}.body`)}
                </p>
                <div className="mt-auto border-t border-border pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent/70">
                    {t('landing.verticals.edgeLabel')}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {t(`landing.verticals.items.${key}.edge`)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link
            href={`/${locale}/verticals`}
            className="inline-flex items-center gap-2 font-display text-lg text-accent transition-colors hover:text-foreground"
          >
            {t('landing.verticals.more')}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

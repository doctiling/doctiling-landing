'use client';

import Link from 'next/link';
import { ArrowUpRight, FileStack, Network, Compass } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { TextDocPreview, ConnectMiniPreview, VerticalsMiniPreview } from './landing-diagrams';

const PILLARS = [
  { key: 'documents', path: 'documents', Icon: FileStack, Preview: TextDocPreview },
  { key: 'connect', path: 'connect', Icon: Network, Preview: ConnectMiniPreview },
  { key: 'verticals', path: 'verticals', Icon: Compass, Preview: VerticalsMiniPreview },
] as const;

export function PillarsSection() {
  const { t, locale } = useLandingText();

  return (
    <section id="pillars" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.pillars.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.pillars.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t('landing.pillars.lede')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {PILLARS.map(({ key, path, Icon, Preview }, i) => (
            <Reveal key={key} delay={i * 130}>
              <Link
                href={`/${locale}/${path}`}
                className="landing-card landing-card-hover group flex h-full flex-col gap-5 p-7"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-secondary/50 p-3">
                  <Preview
                    label={t(`landing.pillars.items.${key}.previewAlt`)}
                    className="h-auto w-full text-foreground/70"
                  />
                </div>
                <Icon className="size-5 text-accent" aria-hidden="true" />
                <h3 className="font-display text-2xl leading-snug">
                  {t(`landing.pillars.items.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.pillars.items.${key}.body`)}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground">
                  {t(`landing.pillars.items.${key}.cta`)}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

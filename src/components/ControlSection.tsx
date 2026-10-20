'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Cpu, Database, LayoutPanelLeft, ScanSearch } from 'lucide-react';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// Where the data lives, one deployment at a time: the dashed boundary is the
// one the customer owns, the tiles are the four pieces that hold or touch
// their content. Copy for each tab mirrors the tiers and self-host sections.
const DEPLOYMENTS = ['hosted', 'dedicated', 'local'] as const;
const PARTS = [
  { key: 'studio', Icon: LayoutPanelLeft },
  { key: 'database', Icon: Database },
  { key: 'index', Icon: ScanSearch },
  { key: 'model', Icon: Cpu },
] as const;
const BULLETS = ['p1', 'p2', 'p3', 'p4'] as const;

type Deployment = (typeof DEPLOYMENTS)[number];

export function ControlSection() {
  const { t, locale } = useLandingText();
  const [active, setActive] = useState<Deployment>('dedicated');
  const base = `landing.control.deployments.${active}`;

  return (
    <section id="control" className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <Reveal className="flex flex-col gap-5 lg:col-span-5">
          <MiniTitle>{t('landing.control.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">{t('landing.control.title')}</H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('landing.control.lede')}</p>
          <ul className="mt-2 space-y-3">
            {BULLETS.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-foreground/85">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{t(`landing.control.bullets.${p}`)}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/connect#self-host`}
            className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            {t('landing.control.selfHostCta')} <ArrowUpRight className="size-3.5" />
          </Link>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-7">
          <div className="landing-card overflow-hidden">
            <div
              role="img"
              aria-label={t(`${base}.alt`)}
              className="landing-grid relative m-4 rounded-2xl border-2 border-dashed border-accent/50 p-5 sm:m-6 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-xl">{t(`${base}.boundary`)}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t(`${base}.where`)}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {PARTS.map(({ key, Icon }) => (
                  <div key={key} className="rounded-xl border border-border bg-background p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-accent" aria-hidden="true" />
                      <span className="text-sm font-semibold">{t(`landing.control.parts.${key}`)}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {t(`${base}.parts.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                {t(`${base}.badge`)}
              </span>
            </div>

            <div
              role="tablist"
              aria-label={t('landing.control.tablistLabel')}
              className="grid grid-cols-3 border-t border-border"
            >
              {DEPLOYMENTS.map((key) => {
                const selected = key === active;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(key)}
                    className={cn(
                      'border-r border-border px-3 py-3 text-sm font-medium transition-colors last:border-r-0',
                      selected ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t(`landing.control.deployments.${key}.tab`)}
                  </button>
                );
              })}
            </div>
            <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {t(`${base}.body`)}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

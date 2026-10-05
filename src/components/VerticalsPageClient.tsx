'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Calculator,
  GraduationCap,
  Landmark,
  Scale,
  Stethoscope,
} from 'lucide-react';
import { useLandingHost } from '../host';
import { Button } from '@doctiling/ui/atoms/button';
import { Display, H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { BrowserFrame } from '@doctiling/ui/molecules/browser-frame';

const VERTICALS = [
  { key: 'legal', Icon: Scale },
  { key: 'health', Icon: Stethoscope },
  { key: 'finance', Icon: Landmark },
  { key: 'accounting', Icon: Calculator },
  { key: 'research', Icon: GraduationCap },
  { key: 'consulting', Icon: Briefcase },
] as const;

const CAPABILITY_KEYS = ['c1', 'c2', 'c3'] as const;

export default function VerticalsPageClient() {
  const { t, locale, isAuthenticated: isAuthed, href, landingHref } = useLandingHost();
  const homeHref = landingHref();
  const signinHref = href('signin');
  const appHref = href('app');
  const requestAccessHref = isAuthed ? appHref : `${homeHref}#demo`;

  return (
    <main className="relative isolate overflow-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href={homeHref} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="font-display text-lg tracking-tight text-foreground">{t('landing.nav.brand')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={signinHref}
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              {t('verticalsPage.nav.signin')}
            </Link>
            <Button asChild size="sm">
              <Link href={requestAccessHref}>{t('verticalsPage.nav.requestAccess')}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <MiniTitle>{t('verticalsPage.hero.eyebrow')}</MiniTitle>
            <Display className="text-balance text-5xl leading-[1.05] sm:text-6xl">
              {t('verticalsPage.hero.title')}
            </Display>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('verticalsPage.hero.lede')}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={requestAccessHref}>{t('verticalsPage.hero.ctaPrimary')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/${locale}/documents#cycle`}>
                  {t('verticalsPage.hero.ctaSecondary')}
                  <ArrowUpRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTRO + ANCHOR CHIPS */}
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <Reveal className="flex max-w-3xl flex-col gap-4">
            <H2 className="text-balance text-3xl not-italic leading-tight sm:text-4xl">
              {t('verticalsPage.intro.title')}
            </H2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('verticalsPage.intro.body')}
            </p>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            {VERTICALS.map(({ key, Icon }) => (
              <a
                key={key}
                href={`#${key}`}
                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-accent/50 hover:text-foreground"
              >
                <Icon className="size-4 text-accent/70" aria-hidden="true" />
                {t(`verticalsPage.items.${key}.title`)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOT */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
          <Reveal className="flex flex-col gap-5">
            <BrowserFrame src="/screenshots/real-citations.webp" alt={t('verticalsPage.shot.alt')} />
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              {t('verticalsPage.shot.caption')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* NICHE SECTIONS */}
      {VERTICALS.map(({ key, Icon }, i) => (
        <section
          key={key}
          id={key}
          className={`scroll-mt-20 border-b border-border ${i % 2 === 1 ? 'bg-card/60' : ''}`}
        >
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <Icon className="size-9 text-accent/70" aria-hidden="true" />
                  <span className="mt-6 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    0{i + 1}
                  </span>
                  <h2 className="mt-3 font-display text-4xl leading-tight">
                    {t(`verticalsPage.items.${key}.title`)}
                  </h2>
                  <p className="mt-4 max-w-md text-lg italic leading-relaxed text-foreground/70">
                    {t(`verticalsPage.items.${key}.tagline`)}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={120} className="flex flex-col gap-8 lg:col-span-7">
                <div>
                  <MiniTitle className="mb-2">{t('verticalsPage.labels.problem')}</MiniTitle>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {t(`verticalsPage.items.${key}.problem`)}
                  </p>
                </div>
                <div>
                  <MiniTitle className="mb-2">{t('verticalsPage.labels.solution')}</MiniTitle>
                  <p className="text-base leading-relaxed text-foreground/80">
                    {t(`verticalsPage.items.${key}.solution`)}
                  </p>
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
                  <MiniTitle className="mb-2 text-accent/80">{t('verticalsPage.labels.edge')}</MiniTitle>
                  <p className="text-base leading-relaxed text-foreground">
                    {t(`verticalsPage.items.${key}.edge`)}
                  </p>
                </div>
                <div>
                  <MiniTitle className="mb-3">{t('verticalsPage.labels.capabilities')}</MiniTitle>
                  <ul className="flex flex-col gap-2">
                    {CAPABILITY_KEYS.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span aria-hidden="true" className="mt-1 font-display text-accent/60">
                          ✳
                        </span>
                        {t(`verticalsPage.items.${key}.capabilities.${c}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={160} className="mt-14">
              <BrowserFrame
                src={`/screenshots/niche-${key}.webp`}
                alt={t('verticalsPage.shot.nicheAlt', { field: t(`verticalsPage.items.${key}.title`) })}
              />
            </Reveal>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-10">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6">
            <MiniTitle>{t('verticalsPage.cta.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('verticalsPage.cta.title')}
            </H2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {t('verticalsPage.cta.lede')}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href={requestAccessHref}>{t('verticalsPage.cta.primary')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={homeHref}>{t('verticalsPage.cta.secondary')}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

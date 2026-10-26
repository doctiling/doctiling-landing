'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Mail } from 'lucide-react';
import { useLandingHost } from '../host';
import { Button } from '@doctiling/ui/atoms/button';
import { Display, H2, Lede, MiniTitle } from '@doctiling/ui/atoms/typography';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@doctiling/ui/molecules/dropdown-menu';
import { DemoRequestForm } from './DemoRequestForm';
import { HeroAccessForm } from './HeroAccessForm';
import { StickyCta } from './StickyCta';
import { FaqSection } from './FaqSection';
import { ParadigmSection } from './ParadigmSection';
import { CompareSection } from './CompareSection';
import { BenchmarkSection } from './BenchmarkSection';
import { EvidenceSection } from './EvidenceSection';
import { ControlSection } from './ControlSection';
import { SecuritySection } from './SecuritySection';
import { PlatformSection } from './PlatformSection';
import { InterfacesSection } from './InterfacesSection';
import { VerticalsSection } from './VerticalsSection';
import { TiersSection } from './TiersSection';
import { LandingFooter } from './LandingFooter';
import { Reveal } from './Reveal';
import { HeroVideo } from './HeroVideo';

const INTEGRATION_KEYS = ['corp', 'enterprise', 'agents'] as const;
// Outcome numbers, all measured — the benchmarks section carries the method.
const PROOF_KEYS = ['recall', 'tasks', 'language', 'latency'] as const;
// Hero demo: https://www.youtube.com/shorts/-i3DmNClIZE
const HERO_VIDEO_ID = '-i3DmNClIZE';

const SECTION = 'mx-auto max-w-7xl px-5 sm:px-6 lg:px-10';
const NAV_LINK =
  'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-card hover:text-foreground';

export default function LandingClient() {
  const { t, locale, isAuthenticated: isAuthed, features, href, slots } = useLandingHost();
  const INTEGRATIONS_ENABLED = features.integrations;
  const signinHref = href('signin');
  const appHref = href('app');
  const deckHref = `/Doctiling-Pitch-Deck-${locale === 'en' ? 'en' : 'es'}.pdf`;
  const selfHostHref = `/${locale}/connect#self-host`;
  const supportEmail = t('landing.footer.support.email');
  const supportHref = `mailto:${supportEmail}`;
  // Invitation-only: anonymous visitors are funneled to the demo-request form
  // rather than straight to sign-in (a non-approved email can't get in yet).
  const requestAccessHref = isAuthed ? appHref : '#demo';

  return (
    <main className="relative isolate overflow-hidden">
      {/* NAV — two menus, three anchors, one CTA */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className={`${SECTION} flex h-16 items-center justify-between gap-4`}>
          <Link href={`/${locale}/landing`} className="flex shrink-0 items-center gap-2.5">
            <svg viewBox="0 0 512 512" className="h-7 w-7 shrink-0" role="img" aria-label={t('landing.nav.brand')}>
              <rect width="512" height="512" rx="112" fill="#EBECEF" />
              <rect x="75" y="75" width="168" height="168" rx="30" fill="#2C3D4E" />
              <rect x="269" y="75" width="168" height="168" rx="30" fill="#798A75" />
              <rect x="75" y="269" width="168" height="168" rx="30" fill="#B0B7A8" />
              <rect x="269" y="269" width="168" height="168" rx="30" fill="#BE4037" />
            </svg>
            <span className="font-display text-xl tracking-tight">{t('landing.nav.brand')}</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className={`${NAV_LINK} inline-flex items-center gap-1 outline-none`}>
                {t('landing.nav.links.product')} <ChevronDown className="size-3.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-xl">
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/documents`}>{t('landing.nav.links.docTypes')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/documents#agent-output`}>{t('landing.nav.links.agentOutput')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/connect`}>{t('landing.nav.links.connect')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/verticals`}>{t('landing.nav.links.verticals')}</Link>
                </DropdownMenuItem>
                {INTEGRATIONS_ENABLED && (
                  <DropdownMenuItem asChild>
                    <a href="#integrations">{t('landing.nav.links.integrations')}</a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="#benchmarks" className={NAV_LINK}>
              {t('landing.nav.links.benchmarks')}
            </a>
            <a href="#control" className={NAV_LINK}>
              {t('landing.nav.links.control')}
            </a>
            <a href="#stack" className={NAV_LINK}>
              {t('landing.nav.links.stack')}
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className={`${NAV_LINK} inline-flex items-center gap-1 outline-none`}>
                {t('landing.nav.resources')} <ChevronDown className="size-3.5" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem asChild>
                  <a href="#evidence">{t('landing.nav.links.evidence')}</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={selfHostHref}>{t('landing.nav.links.selfHost')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={deckHref} download>
                    {t('landing.hero.ctaDeck')}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#faq">{t('landing.nav.links.faq')}</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <div
              role="group"
              aria-label="language"
              className="hidden items-center overflow-hidden rounded-full border border-border bg-card p-0.5 text-[11px] font-semibold uppercase tracking-wider sm:inline-flex"
            >
              <Link
                href="/en/landing"
                aria-current={locale === 'en' ? 'true' : undefined}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  locale === 'en' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </Link>
              <Link
                href="/es/landing"
                aria-current={locale === 'es' ? 'true' : undefined}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  locale === 'es' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ES
              </Link>
            </div>
            {slots?.navExtras}
            {isAuthed ? (
              <Button asChild variant="pill" size="pill-sm">
                <Link href={appHref}>
                  {t('landing.nav.openApp')} <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  href={signinHref}
                  className="hidden whitespace-nowrap px-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground md:inline lg:hidden xl:inline"
                >
                  {t('landing.nav.signin')}
                </Link>
                <Button asChild variant="pill" size="pill-sm">
                  <a href="#demo">{t('landing.hero.ctaPrimary')}</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO — one claim, one line, one action; the hub shows where the knowledge goes */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.10),transparent_55%)]" />
        <div className={`${SECTION} grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-24`}>
          <div className="lg:col-span-7">
            <div className="landing-enter">
              <MiniTitle className="mb-7 text-accent">{t('landing.hero.eyebrow')}</MiniTitle>
            </div>
            <Display as="h1" className="text-balance leading-[1.02] sm:text-6xl lg:text-[3.5rem] xl:text-7xl">
              {/* One line from sm up, so the hand-drawn underline sits under the whole claim. */}
              <span className="landing-enter relative inline-block sm:whitespace-nowrap" style={{ animationDelay: '80ms' }}>
                {t('landing.hero.titleLine1')}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 420 14"
                  className="pointer-events-none absolute -bottom-2 left-0 h-3 w-full text-destructive/80 lg:-bottom-3 lg:h-4"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    className="landing-underline"
                    d="M3 10 C 70 2, 140 2, 210 7 S 350 12, 417 4"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span
                className="landing-enter mt-3 block font-display italic text-accent"
                style={{ animationDelay: '220ms' }}
              >
                {t('landing.hero.titleAccent')}
              </span>
            </Display>
            <div className="landing-enter" style={{ animationDelay: '360ms' }}>
              <Lede className="mt-8 max-w-xl text-balance font-body not-italic text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                {t('landing.hero.lede')}
              </Lede>
            </div>
            <div className="landing-enter mt-10" style={{ animationDelay: '480ms' }}>
              {isAuthed ? (
                <Button asChild variant="pill" size="pill">
                  <Link href={appHref}>
                    {t('landing.nav.openApp')} <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <HeroAccessForm detailsHref="#demo" />
              )}
              <p className="mt-5 flex items-start gap-2 text-sm font-medium text-foreground/80">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                {t('landing.hero.freeBadge')}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href="#paradigm"
                  className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  {t('landing.hero.ctaParadigm')}
                </a>
                <a
                  href="#evidence"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t('landing.hero.ctaSecondary')}
                </a>
                <Link
                  href={selfHostHref}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t('landing.hero.ctaSelfHost')} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="landing-enter lg:col-span-5" style={{ animationDelay: '300ms' }}>
            <HeroVideo videoId={HERO_VIDEO_ID} poster="/landing/video/hero-short.webp" />
          </div>
        </div>
      </section>

      {/* PROOF STRIP — measured outcomes instead of a logo wall (no public customers yet) */}
      <section aria-labelledby="proof-label" className="border-y border-border bg-card/60">
        <div className={`${SECTION} py-8`}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p id="proof-label" className="text-sm text-muted-foreground">
              {t('landing.proof.label')}
            </p>
            <a
              href="#benchmarks"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              {t('landing.proof.link')} <ArrowRight className="size-3.5" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-y-6 md:grid-cols-4 md:divide-x md:divide-border">
            {PROOF_KEYS.map((key, i) => (
              <Reveal key={key} delay={i * 90}>
                <div className="flex h-full flex-col gap-1.5 pr-4 md:px-6">
                  <span className="font-display text-4xl tracking-tight text-accent sm:text-5xl">
                    {t(`landing.proof.items.${key}.value`)}
                  </span>
                  <span className="max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.proof.items.${key}.label`)}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ParadigmSection />

      <CompareSection />

      <BenchmarkSection />

      <EvidenceSection />

      <ControlSection />

      <SecuritySection />

      <PlatformSection />

      <InterfacesSection />

      <VerticalsSection />

      <TiersSection requestAccessHref={requestAccessHref} />

      {INTEGRATIONS_ENABLED && (
        <section id="integrations" className="border-t border-border">
          <div className={`${SECTION} py-24`}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <MiniTitle className="mb-6">{t('landing.integrations.eyebrow')}</MiniTitle>
                <H2 className="max-w-md text-balance text-4xl not-italic leading-tight sm:text-5xl">
                  {t('landing.integrations.title')}
                </H2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                  {t('landing.integrations.body')}
                </p>
              </Reveal>
              <Reveal delay={140} className="lg:col-span-7">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {INTEGRATION_KEYS.map((slot) => (
                    <article key={slot} className="landing-card p-7">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {t(`landing.integrations.items.${slot}.eyebrow`)}
                      </span>
                      <h3 className="mt-3 font-display text-xl leading-snug">
                        {t(`landing.integrations.items.${slot}.title`)}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {t(`landing.integrations.items.${slot}.body`)}
                      </p>
                    </article>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* DEMO REQUEST */}
      <section id="demo" className="border-t border-border">
        <div className={`${SECTION} py-24`}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <MiniTitle className="mb-6">{t('landing.demo.eyebrow')}</MiniTitle>
              <H2 className="max-w-md text-balance text-4xl not-italic leading-tight sm:text-5xl">
                {t('landing.demo.title')}
              </H2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                {t('landing.demo.body')}
              </p>
              <p className="mt-6 flex items-start gap-2 text-sm font-medium text-foreground/80">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                {t('landing.hero.freeBadge')}
              </p>
            </Reveal>
            <Reveal delay={140} className="lg:col-span-7">
              <div className="landing-card p-6 sm:p-8">
                <DemoRequestForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* CTA */}
      <section className="relative border-t border-border bg-card/60">
        <div className={`${SECTION} py-24 lg:py-28`}>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <MiniTitle>{t('landing.cta.eyebrow')}</MiniTitle>
            <Display as="p" className="text-balance leading-[1.04]">{t('landing.cta.title')}</Display>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {t('landing.cta.lede')}
            </p>
          </Reveal>
          <Reveal delay={140} className="mt-10 flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="pill" size="pill">
                <Link href={requestAccessHref}>
                  {isAuthed ? t('landing.nav.openApp') : t('landing.cta.primary')}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              {!isAuthed && (
                <Button asChild variant="pill-outline" size="pill">
                  <Link href={signinHref}>{t('landing.cta.secondary')}</Link>
                </Button>
              )}
            </div>
            <a
              href={supportHref}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <Mail className="size-3.5" />
              {t('landing.footer.support.label')} · {supportEmail}
            </a>
          </Reveal>
        </div>
      </section>

      <LandingFooter
        locale={locale}
        isAuthed={isAuthed}
        appHref={appHref}
        signinHref={signinHref}
        deckHref={deckHref}
      />

      {!isAuthed && <StickyCta href="#demo" />}
    </main>
  );
}

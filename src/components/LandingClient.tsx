'use client';

import Link from 'next/link';
import { ArrowUpRight, Check, Download, Mail, Quote, Wrench } from 'lucide-react';
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
import { KnowledgeSection } from './KnowledgeSection';
import { EvidenceSection } from './EvidenceSection';
import { InContextSection } from './InContextSection';
import { ThesisSection } from './ThesisSection';
import { PillarsSection } from './PillarsSection';
import { TiersSection } from './TiersSection';
import { LandingFooter } from './LandingFooter';
import { BrowserFrame } from '@doctiling/ui/molecules/browser-frame';
import { Reveal } from './Reveal';
import { WorkflowStepIllustration } from './illustrations';

const WORKFLOW_STEPS = ['gather', 'curate', 'operate'] as const;
const INTEGRATION_KEYS = ['corp', 'enterprise', 'agents'] as const;
const TRUST_ITEMS = ['claude', 'rag', 'mcp', 'tools'] as const;
const STAT_KEYS = ['lenses', 'docTypes', 'aiRuns', 'engines'] as const;
const AUDIENCE_KEYS = [
  'researchers',
  'legal',
  'consultants',
  'students',
  'product',
  'analysts',
  'writers',
  'ops',
] as const;

const SECTION = 'mx-auto max-w-7xl px-5 sm:px-6 lg:px-10';
const NAV_LINK =
  'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-card hover:text-foreground';

export default function LandingClient() {
  const { t, locale, isAuthenticated: isAuthed, features, href, slots } = useLandingHost();
  const INTEGRATIONS_ENABLED = features.integrations;
  const signinHref = href('signin');
  const appHref = href('app');
  const deckHref = `/Doctiling-Pitch-Deck-${locale === 'en' ? 'en' : 'es'}.pdf`;
  const supportEmail = t('landing.footer.support.email');
  const supportHref = `mailto:${supportEmail}`;
  // Invitation-only: anonymous visitors are funneled to the demo-request form
  // rather than straight to sign-in (a non-approved email can't get in yet).
  const requestAccessHref = isAuthed ? appHref : '#demo';

  return (
    <main className="relative isolate overflow-hidden">
      {/* NAV */}
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
            <a href="#knowledge" className={NAV_LINK}>
              {t('landing.nav.links.knowledge')}
            </a>
            <a href="#evidence" className={NAV_LINK}>
              {t('landing.nav.links.evidence')}
            </a>
            <Link href={`/${locale}/documents`} className={NAV_LINK}>
              {t('landing.nav.links.docTypes')}
            </Link>
            <Link href={`/${locale}/connect`} className={NAV_LINK}>
              {t('landing.nav.links.connect')}
            </Link>
            <a href="#stack" className={NAV_LINK}>
              {t('landing.nav.links.stack')}
            </a>
            <a href="#demo" className={NAV_LINK}>
              {t('landing.nav.links.demo')}
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className={`${NAV_LINK} outline-none`}>
                {t('landing.nav.more')}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem asChild>
                  <a href="#thesis">{t('landing.nav.links.thesis')}</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/verticals`}>{t('landing.nav.links.verticals')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/documents#agent-output`}>{t('landing.nav.links.agentOutput')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/connect#self-host`}>{t('landing.nav.links.selfHost')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#faq">{t('landing.nav.links.faq')}</a>
                </DropdownMenuItem>
                {INTEGRATIONS_ENABLED && (
                  <DropdownMenuItem asChild>
                    <a href="#integrations">{t('landing.nav.links.integrations')}</a>
                  </DropdownMenuItem>
                )}
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
                  className="hidden whitespace-nowrap px-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground md:inline"
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

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(ellipse_at_bottom_left,hsl(var(--accent)/0.08),transparent_60%)]" />
        <div className={`${SECTION} grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-start lg:gap-10 lg:py-24`}>
          <div className="lg:col-span-6">
            <div className="landing-enter">
              <MiniTitle className="mb-7 text-accent">{t('landing.hero.eyebrow')}</MiniTitle>
            </div>
            <Display as="h1" className="text-balance leading-[1.02] sm:text-6xl lg:text-7xl">
              <span className="landing-enter relative block" style={{ animationDelay: '80ms' }}>
                {t('landing.hero.titleLine1')}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 420 14"
                  className="pointer-events-none absolute -bottom-2 left-0 h-3 w-[60%] max-w-[420px] text-destructive/80 lg:-bottom-3 lg:h-4"
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
                  href="#evidence"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {t('landing.hero.ctaSecondary')}
                </a>
                <a
                  href={deckHref}
                  download
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  <Download className="size-3.5" /> {t('landing.hero.ctaDeck')}
                </a>
              </div>
            </div>

            <div className="landing-enter mt-14 flex flex-wrap items-center gap-x-6 gap-y-3" style={{ animationDelay: '640ms' }}>
              <MiniTitle>{t('landing.trust.eyebrow')}</MiniTitle>
              <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-foreground/80">
                {TRUST_ITEMS.map((key) => (
                  <span key={key} className="rounded-full border border-border bg-card px-3 py-1">
                    {t(`landing.trust.items.${key}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* REAL PRODUCT PREVIEW — the capture plus two floating details lifted from it */}
          <div className="landing-enter relative lg:col-span-6 lg:pt-16" style={{ animationDelay: '300ms' }}>
            <div className="relative pb-10 pr-0 sm:pr-10 lg:pl-6">
              <div className="landing-float">
                <BrowserFrame src="/screenshots/real-citations.webp" alt={t('landing.hero.previewAlt')} priority />
              </div>
              <div
                aria-hidden="true"
                className="landing-card landing-card-in absolute -left-2 bottom-2 z-10 hidden w-[17rem] p-4 sm:block lg:-left-4"
                style={{ animationDelay: '900ms' }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Quote className="size-3.5" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t('landing.hero.previewEyebrow')}
                  </span>
                </div>
                <p className="mt-2.5 font-display text-base leading-snug">{t('landing.hero.previewTitle')}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t('landing.hero.previewLine1')}</p>
              </div>
              <div
                aria-hidden="true"
                className="landing-card landing-card-in absolute -right-1 top-6 z-10 hidden w-[15rem] border-l-[3px] border-l-emerald-500 p-3.5 sm:block"
                style={{ animationDelay: '1150ms' }}
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
                  <Wrench className="size-3.5" />
                  {t('landing.trust.items.tools')}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/85">{t('landing.hero.previewLine3')}</p>
              </div>
            </div>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              {t('landing.hero.previewCaption')}
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card/60">
        <div className={`${SECTION} grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x`}>
          {STAT_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 90}>
              <div className="flex h-full flex-col gap-2 px-2 py-8 md:px-8 md:py-10">
                <span className="font-display text-4xl tracking-tight text-accent sm:text-5xl">
                  {t(`landing.stats.items.${key}.value`)}
                </span>
                <span className="max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.stats.items.${key}.label`)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <KnowledgeSection />

      <EvidenceSection />

      <ThesisSection />

      <PillarsSection />

      <InContextSection />

      {/* AUDIENCES MARQUEE */}
      <section aria-label={t('landing.audiences.label')} className="landing-marquee overflow-hidden border-y border-border bg-card/60 py-5">
        <div className="landing-marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? 'true' : undefined}
              className="flex shrink-0 items-center"
            >
              <span className="mx-8 whitespace-nowrap text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {t('landing.audiences.label')}
              </span>
              {AUDIENCE_KEYS.map((key) => (
                <span key={key} className="flex shrink-0 items-center">
                  <span aria-hidden="true" className="font-display text-lg italic text-primary">
                    ✳
                  </span>
                  <span className="mx-8 whitespace-nowrap font-display text-xl text-foreground/80">
                    {t(`landing.audiences.items.${key}`)}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow">
        <div className={`${SECTION} py-24`}>
          <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <MiniTitle>{t('landing.workflow.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.workflow.title')}
            </H2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
            {WORKFLOW_STEPS.map((step, i) => (
              <Reveal key={step} delay={i * 140}>
                <div className="landing-card landing-card-hover h-full p-8">
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full bg-accent font-display text-xl text-accent-foreground">
                      {t(`landing.workflow.steps.${step}.number`)}
                    </span>
                    <WorkflowStepIllustration step={step} className="size-12 text-primary" />
                  </div>
                  <h3 className="mt-8 font-display text-2xl leading-snug">
                    {t(`landing.workflow.steps.${step}.title`)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {t(`landing.workflow.steps.${step}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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

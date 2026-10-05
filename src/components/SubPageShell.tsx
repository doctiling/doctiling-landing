'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useLandingHost } from '../host';
import { Button } from '@doctiling/ui/atoms/button';
import { Display, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

type SiblingLink = { href: string; label: string };

// Chrome shared by the landing's deep-dive pages: back-to-landing header, a
// hero that states the page's own promise, and a closing CTA that hands the
// visitor to the demo form (or the studio, when already signed in).
export function SubPageShell({
  eyebrow,
  title,
  lede,
  siblings,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  siblings: SiblingLink[];
  children: React.ReactNode;
}) {
  const { t, isAuthenticated: isAuthed, href, landingHref } = useLandingHost();
  const homeHref = landingHref();
  const signinHref = href('signin');
  const appHref = href('app');
  const requestAccessHref = isAuthed ? appHref : `${homeHref}#demo`;

  return (
    <main className="relative isolate overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <Link
            href={homeHref}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="font-display text-lg tracking-tight text-foreground">
              {t('landing.nav.brand')}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {siblings.map((sibling) => (
              <Link
                key={sibling.href}
                href={sibling.href}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline"
              >
                {sibling.label}
              </Link>
            ))}
            <Button asChild variant="pill" size="pill-sm">
              <Link href={requestAccessHref}>
                {isAuthed ? t('landing.nav.openApp') : t('landing.subnav.requestAccess')}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <Reveal className="flex max-w-3xl flex-col gap-6">
            <MiniTitle>{eyebrow}</MiniTitle>
            <Display className="text-balance text-5xl leading-[1.05] sm:text-6xl">{title}</Display>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lede}
            </p>
          </Reveal>
        </div>
      </section>

      {children}

      <section className="border-t border-border bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Reveal className="max-w-2xl">
            <Display as="p" className="text-balance text-4xl leading-[1.08] sm:text-5xl">
              {t('landing.cta.title')}
            </Display>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {t('landing.cta.lede')}
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-wrap items-center gap-3">
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
          </Reveal>
        </div>
      </section>

      <footer id="site-footer" className="border-t border-border bg-card/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-8 text-sm text-muted-foreground lg:px-10">
          <Link href={homeHref} className="hover:text-foreground">
            {t('landing.subnav.back')}
          </Link>
          {siblings.map((sibling) => (
            <Link key={sibling.href} href={sibling.href} className="hover:text-foreground">
              {sibling.label}
            </Link>
          ))}
          <Link href={`${homeHref}#faq`} className="hover:text-foreground">
            {t('landing.nav.links.faq')}
          </Link>
        </div>
      </footer>
    </main>
  );
}

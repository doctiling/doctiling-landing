'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useLandingHost } from '../host';

const LINK = 'text-foreground/80 hover:text-foreground';
const HEADING = 'text-[11px] font-semibold uppercase tracking-widest text-muted-foreground';

export function LandingFooter({
  locale,
  isAuthed,
  appHref,
  signinHref,
  deckHref,
}: {
  locale: string;
  isAuthed: boolean;
  appHref: string;
  signinHref: string;
  deckHref: string;
}) {
  const { t, href } = useLandingHost();
  const supportEmail = t('landing.footer.support.email');

  return (
    <footer id="site-footer" className="border-t border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 sm:px-6 md:grid-cols-4 lg:px-10">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <span className="font-display text-xl">{t('landing.nav.brand')}</span>
          <span className="max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
            {t('landing.footer.tagline')}
          </span>
        </div>
        <nav aria-label={t('landing.footer.columns.product')} className="flex flex-col gap-2.5 text-sm">
          <span className={HEADING}>{t('landing.footer.columns.product')}</span>
          <Link href={isAuthed ? appHref : signinHref} className={LINK}>
            {isAuthed ? t('landing.nav.openApp') : t('landing.footer.links.signin')}
          </Link>
          <Link href={`/${locale}/documents`} className={LINK}>
            {t('landing.nav.links.docTypes')}
          </Link>
          <Link href={`/${locale}/connect`} className={LINK}>
            {t('landing.nav.links.connect')}
          </Link>
          <Link href={`/${locale}/verticals`} className={LINK}>
            {t('landing.nav.links.verticals')}
          </Link>
          <a href="#workflow" className={LINK}>
            {t('landing.footer.links.workflow')}
          </a>
          <a href={deckHref} download className={LINK}>
            {t('landing.footer.links.deck')}
          </a>
        </nav>
        <nav aria-label={t('landing.footer.columns.legal')} className="flex flex-col gap-2.5 text-sm">
          <span className={HEADING}>{t('landing.footer.columns.legal')}</span>
          <Link href={href('privacy')} className={LINK}>
            {t('landing.footer.links.privacy')}
          </Link>
          <Link href={href('dataProcessing')} className={LINK}>
            {t('landing.footer.links.dataProcessing')}
          </Link>
          <Link href={href('cookies')} className={LINK}>
            {t('landing.footer.links.cookies')}
          </Link>
          <Link href={href('terms')} className={LINK}>
            {t('landing.footer.links.terms')}
          </Link>
          <Link href={href('security')} className={LINK}>
            {t('landing.footer.links.security')}
          </Link>
        </nav>
        <div className="flex flex-col gap-2.5 text-sm">
          <span className={HEADING}>{t('landing.footer.columns.contact')}</span>
          <a href={`mailto:${supportEmail}`} className={`inline-flex items-center gap-1.5 ${LINK}`}>
            <Mail className="size-3.5" />
            {supportEmail}
          </a>
          <a href="#demo" className={LINK}>
            {t('landing.nav.links.demo')}
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-muted-foreground sm:px-6 lg:px-10">
          {t('landing.footer.rights', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}

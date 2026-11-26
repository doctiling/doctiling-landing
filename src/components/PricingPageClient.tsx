'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLandingHost } from '../host';
import { SubPageShell } from './SubPageShell';
import { TopUpsSection } from './TopUpsSection';

// /pricing: how the plan's monthly AI balance works and the top-ups that extend
// it. The plans themselves stay on the home page (#stack), which links here.
export default function PricingPage() {
  const { t, locale, landingHref } = useLandingHost();
  const plansHref = `${landingHref()}#stack`;

  return (
    <SubPageShell
      eyebrow={t('pricingPage.hero.eyebrow')}
      title={t('pricingPage.hero.title')}
      lede={t('pricingPage.hero.lede')}
      siblings={[
        { href: `/${locale}/documents`, label: t('landing.nav.links.docTypes') },
        { href: `/${locale}/verticals`, label: t('landing.nav.links.verticals') },
      ]}
      heroAction={
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {t('pricingPage.plansLink')} <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <TopUpsSection />
    </SubPageShell>
  );
}

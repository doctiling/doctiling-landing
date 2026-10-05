'use client';

import { useLandingText } from '../host';
import { SubPageShell } from './SubPageShell';
import { ConnectSection } from './ConnectSection';
import { SharingSection } from './SharingSection';
import { SecuritySection } from './SecuritySection';
import { SelfHostSection } from './SelfHostSection';

export default function ConnectPageClient() {
  const { t, locale } = useLandingText();

  return (
    <SubPageShell
      eyebrow={t('connectPage.hero.eyebrow')}
      title={t('connectPage.hero.title')}
      lede={t('connectPage.hero.lede')}
      siblings={[
        { href: `/${locale}/documents`, label: t('landing.nav.links.docTypes') },
        { href: `/${locale}/verticals`, label: t('landing.nav.links.verticals') },
      ]}
    >
      <ConnectSection hideHeader />
      <SharingSection />
      <SecuritySection />
      <SelfHostSection />
    </SubPageShell>
  );
}

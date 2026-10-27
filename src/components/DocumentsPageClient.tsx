'use client';

import { useLandingText } from '../host';
import { SubPageShell } from './SubPageShell';
import { DocTypesSection } from './DocTypesSection';
import { CycleSection } from './CycleSection';
import { AgentOutputSection } from './AgentOutputSection';
import { EvidenceSection } from './EvidenceSection';
import { ProductShowcase } from './ProductShowcase';

export default function DocumentsPageClient() {
  const { t, locale } = useLandingText();

  return (
    <SubPageShell
      eyebrow={t('documentsPage.hero.eyebrow')}
      title={t('documentsPage.hero.title')}
      lede={t('documentsPage.hero.lede')}
      siblings={[
        { href: `/${locale}/connect`, label: t('landing.nav.links.connect') },
        { href: `/${locale}/verticals`, label: t('landing.nav.links.verticals') },
      ]}
    >
      <DocTypesSection hideHeader />
      <CycleSection />
      <AgentOutputSection />
      <EvidenceSection />
      <ProductShowcase />
    </SubPageShell>
  );
}

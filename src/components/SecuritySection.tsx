'use client';

import { EyeOff, KeyRound, Server, ShieldCheck } from 'lucide-react';
import { useLandingHost } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

// The frameworks row of the trust center, summarized: states from the same closed
// vocabulary as the product's /security page, never a number and never a seal —
// the numbers live there, computed from the security profile.
export const FRAMEWORKS = [
  { key: 'nist', statuses: ['selfAssessed'] },
  { key: 'iso27001', statuses: ['mappingPublished', 'notCertified'] },
  { key: 'privacy', statuses: ['inForce'] },
  { key: 'dpa', statuses: ['inForce'] },
] as const;

const SECURITY_ITEMS = [
  { key: 'access', Icon: KeyRound },
  { key: 'privacy', Icon: EyeOff },
  { key: 'guardrails', Icon: ShieldCheck },
  { key: 'deploy', Icon: Server },
] as const;

export function SecuritySection() {
  const { t, href } = useLandingHost();

  return (
    <section id="security" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <MiniTitle className="mb-6">{t('landing.security.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.security.title')}
            </H2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              {t('landing.security.lede')}
            </p>
          </Reveal>
          <Reveal delay={140} className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
              {SECURITY_ITEMS.map(({ key, Icon }) => (
                <article key={key} className="flex flex-col gap-4 bg-card p-7">
                  <Icon className="size-5 text-accent" aria-hidden="true" />
                  <h3 className="font-display text-xl leading-snug">
                    {t(`landing.security.items.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.security.items.${key}.body`)}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={200} className="mt-16">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FRAMEWORKS.map(({ key, statuses }) => (
              <li key={key} className="flex flex-col gap-3 border border-border bg-card p-5" data-testid="framework">
                <p className="text-sm font-medium">{t(`landing.security.frameworks.${key}`)}</p>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <span key={s} className="border border-border px-2 py-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                      {t(`landing.security.statuses.${s}`)}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <a href={href('security')} className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
            {t('landing.security.trustCenter')} →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

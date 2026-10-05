'use client';

import { EyeOff, KeyRound, Server, ShieldCheck } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

const SECURITY_ITEMS = [
  { key: 'access', Icon: KeyRound },
  { key: 'privacy', Icon: EyeOff },
  { key: 'guardrails', Icon: ShieldCheck },
  { key: 'deploy', Icon: Server },
] as const;

export function SecuritySection() {
  const { t } = useLandingText();

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
      </div>
    </section>
  );
}

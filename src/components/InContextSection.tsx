'use client';

import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

const ITEMS = [
  { src: '/landing/context-collab.webp', key: 'collab' },
  { src: '/landing/context-focus.webp', key: 'focus' },
  { src: '/landing/context-study.webp', key: 'study' },
  { src: '/landing/context-sectors.webp', key: 'sectors' },
] as const;

export function InContextSection() {
  const { t } = useLandingText();

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.context.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.context.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t('landing.context.lede')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
          {ITEMS.map((item, i) => (
            <Reveal key={item.key} delay={i * 110} className="flex flex-col gap-3">
              <figure className="landing-shot overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={t(`landing.context.items.${item.key}.alt`)}
                  loading="lazy"
                  className="block aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </figure>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {t(`landing.context.items.${item.key}.kicker`)}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.context.items.${item.key}.caption`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

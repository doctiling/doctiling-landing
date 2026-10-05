'use client';

import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { BrowserFrame } from '@doctiling/ui/molecules/browser-frame';

const SHOTS = [
  { src: '/screenshots/real-studio.webp', altKey: 'studioAlt', captionKey: 'studioCaption' },
  { src: '/screenshots/real-citations.webp', altKey: 'citationsAlt', captionKey: 'citationsCaption' },
  { src: '/screenshots/real-mirror.webp', altKey: 'mirrorAlt', captionKey: 'mirrorCaption' },
] as const;

export function ProductShowcase() {
  const { t } = useLandingText();

  return (
    <section className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.showcase.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.showcase.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t('landing.showcase.lede')}
          </p>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {SHOTS.map((shot, i) => (
            <Reveal key={shot.src} delay={i * 140} className="flex flex-col gap-4">
              <BrowserFrame src={shot.src} alt={t(`landing.showcase.${shot.altKey}`)} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.showcase.${shot.captionKey}`)}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <h3 className="font-display text-2xl leading-snug text-foreground/90">
            {t('landing.showcase.extrasTitle')}
          </h3>
          <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col gap-4">
              <BrowserFrame src="/screenshots/real-presets.webp" alt={t('landing.showcase.presetsAlt')} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('landing.showcase.presetsCaption')}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-[1.75rem] border-4 border-border bg-card shadow-2xl shadow-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/screenshots/real-mobile.webp"
                  alt={t('landing.showcase.mobileAlt')}
                  loading="lazy"
                  width={390}
                  height={844}
                  className="block h-auto w-full"
                />
              </div>
              <p className="text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
                {t('landing.showcase.mobileCaption')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

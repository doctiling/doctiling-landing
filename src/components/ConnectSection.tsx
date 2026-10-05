'use client';

import { Smartphone, MessagesSquare, TerminalSquare, Building2 } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { ConnectDiagram } from './landing-diagrams';

const CHANNELS = [
  { key: 'app', Icon: Smartphone },
  { key: 'chat', Icon: MessagesSquare },
  { key: 'code', Icon: TerminalSquare },
  { key: 'system', Icon: Building2 },
] as const;

const STORES = ['text', 'table', 'graph'] as const;

export function ConnectSection({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { t } = useLandingText();

  return (
    <section id="connect" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        {!hideHeader && (
          <Reveal className="flex max-w-3xl flex-col gap-4">
            <MiniTitle>{t('landing.connect.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.connect.title')}
            </H2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('landing.connect.lede')}
            </p>
          </Reveal>
        )}

        <Reveal delay={120} className={hideHeader ? '' : 'mt-14'}>
          <div className="overflow-x-auto rounded-xl border border-border bg-background p-6 lg:px-10 lg:py-8">
            <ConnectDiagram
              label={t('landing.connect.diagramAlt')}
              labels={{
                core: t('landing.connect.core'),
                coreSub: t('landing.connect.coreSub'),
                protocol: t('landing.connect.protocol'),
                query: t('landing.connect.query'),
                answer: t('landing.connect.answer'),
                storesCaption: t('landing.connect.storesCaption'),
                channels: CHANNELS.map((c) => t(`landing.connect.channels.${c.key}.short`)),
                stores: STORES.map((s) => t(`landing.connect.stores.${s}`)),
              }}
              className="mx-auto h-auto w-full min-w-[620px] max-w-5xl text-foreground/75"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground lg:hidden">
            {t('landing.connect.scrollHint')}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 110} className="bg-card">
              <article className="flex h-full flex-col gap-3 p-7">
                <Icon className="size-5 text-accent" aria-hidden="true" />
                <h3 className="font-display text-xl leading-snug">
                  {t(`landing.connect.channels.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.connect.channels.${key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

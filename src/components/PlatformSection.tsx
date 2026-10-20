'use client';

import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';
import { GraphDocPreview, TableDocPreview, TextDocPreview } from './landing-diagrams';

// Three cards, one promise each: any model, three living document types, and a
// team that adapts the core (Platinum). Each card leads with a small visual.
const MODEL_ROUTES = ['cloud', 'open', 'perBase'] as const;

export function PlatformSection() {
  const { t } = useLandingText();

  return (
    <section id="platform" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.platform.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">{t('landing.platform.title')}</H2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          <Reveal delay={0}>
            <article className="landing-card flex h-full flex-col p-6 sm:p-7">
              <div className="landing-grid flex h-40 flex-col justify-center gap-2 rounded-xl border border-border p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t('landing.platform.model.routing')}
                </span>
                {MODEL_ROUTES.map((key, i) => (
                  <span
                    key={key}
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${
                      i === 0 ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-background'
                    }`}
                  >
                    {t(`landing.platform.model.routes.${key}`)}
                  </span>
                ))}
              </div>
              <h3 className="mt-6 font-display text-2xl leading-snug">{t('landing.platform.model.title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('landing.platform.model.body')}</p>
            </article>
          </Reveal>

          <Reveal delay={110}>
            <article className="landing-card flex h-full flex-col p-6 sm:p-7">
              <div className="landing-grid grid h-40 grid-cols-3 items-center gap-2 rounded-xl border border-border p-3 text-accent">
                <TextDocPreview label={t('landing.platform.docs.text')} className="h-auto w-full" />
                <TableDocPreview label={t('landing.platform.docs.table')} className="h-auto w-full" />
                <GraphDocPreview label={t('landing.platform.docs.graph')} className="h-auto w-full" />
              </div>
              <h3 className="mt-6 font-display text-2xl leading-snug">{t('landing.platform.docs.title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('landing.platform.docs.body')}</p>
            </article>
          </Reveal>

          <Reveal delay={220}>
            <article className="landing-card flex h-full flex-col p-6 sm:p-7">
              <div className="landing-grid flex h-40 flex-col justify-center gap-3 rounded-xl border border-border p-4">
                <span className="w-fit rounded-lg border border-border bg-background px-3 py-2 text-xs">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t('landing.platform.team.useCaseLabel')}
                  </span>
                  <span className="mt-0.5 block font-medium">{t('landing.platform.team.useCase')}</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2.5 py-1">{t('landing.platform.team.you')}</span>
                  <span aria-hidden="true">+</span>
                  <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">
                    {t('landing.platform.team.us')}
                  </span>
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl leading-snug">{t('landing.platform.team.title')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('landing.platform.team.body')}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

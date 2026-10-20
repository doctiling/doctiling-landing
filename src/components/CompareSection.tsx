'use client';

import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { useInView } from '@doctiling/ui/hooks/use-in-view';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// The same question answered two ways, played step by step when the section
// scrolls into view. It shows the mechanism (hybrid search over every curated
// source vs. whatever fit in a chat's attachments), so the copy says it is an
// illustration over the fictional demo base — never a measured result.
const SOURCES = ['minutes', 'report', 'portfolio', 'graph'] as const;
const ATTACH_STEPS = [
  { key: 'a1', ok: true },
  { key: 'a2', ok: true },
  { key: 'a3', ok: false },
  { key: 'a4', ok: false },
] as const;

function Step({ index, children, className }: { index: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('landing-step', className)} style={{ animationDelay: `${300 + index * 450}ms` }}>
      {children}
    </div>
  );
}

export function CompareSection() {
  const { t } = useLandingText();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [run, setRun] = useState(0);

  return (
    <section id="compare" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.compare.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.compare.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('landing.compare.lede')}</p>
        </Reveal>

        <div
          ref={ref}
          key={run}
          className={cn('mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6', inView && 'is-visible')}
        >
          {/* Doctiling */}
          <article className="landing-card flex flex-col overflow-hidden !border-accent/40">
            <header className="flex items-center justify-between border-b border-border bg-accent px-5 py-3 text-accent-foreground">
              <span className="font-display text-lg">{t('landing.compare.ours.name')}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-foreground/70">
                {t('landing.compare.ours.scope')}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <p className="rounded-xl bg-secondary/60 px-4 py-3 text-sm font-medium">{t('landing.compare.question')}</p>
              <Step index={0} className="font-mono text-xs text-muted-foreground">
                {t('landing.compare.ours.search')}
              </Step>
              <Step index={1} className="grid grid-cols-2 gap-2">
                {SOURCES.map((key) => (
                  <span
                    key={key}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs"
                  >
                    <Check className="size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    {t(`landing.compare.ours.sources.${key}`)}
                  </span>
                ))}
              </Step>
              <Step index={2} className="font-mono text-xs text-emerald-700">
                {t('landing.compare.ours.found')}
              </Step>
              <Step index={3} className="mt-auto rounded-xl border-l-[3px] border-l-emerald-500 bg-emerald-500/5 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                  {t('landing.compare.answerLabel')}
                </span>
                <p className="mt-1 text-sm leading-relaxed">{t('landing.compare.ours.answer')}</p>
              </Step>
            </div>
          </article>

          {/* Chat with attachments */}
          <article className="landing-card flex flex-col overflow-hidden">
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="font-display text-lg text-muted-foreground">{t('landing.compare.theirs.name')}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('landing.compare.theirs.scope')}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <p className="rounded-xl bg-secondary/60 px-4 py-3 text-sm font-medium">{t('landing.compare.question')}</p>
              <div className="flex flex-col gap-2">
                {ATTACH_STEPS.map(({ key, ok }, i) => (
                  <Step
                    key={key}
                    index={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
                  >
                    {ok ? (
                      <Check className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <X className="size-3.5 shrink-0 text-destructive" aria-hidden="true" />
                    )}
                    <span className={ok ? 'text-muted-foreground' : 'text-destructive'}>
                      {t(`landing.compare.theirs.steps.${key}`)}
                    </span>
                  </Step>
                ))}
              </div>
              <Step index={4} className="mt-auto rounded-xl border-l-[3px] border-l-destructive bg-destructive/5 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-destructive">
                  {t('landing.compare.answerLabel')}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t('landing.compare.theirs.answer')}</p>
              </Step>
            </div>
          </article>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">{t('landing.compare.footnote')}</p>
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t('landing.compare.replay')}
          </button>
        </div>
      </div>
    </section>
  );
}

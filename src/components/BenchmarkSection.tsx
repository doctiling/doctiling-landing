'use client';

import { useInView } from '@doctiling/ui/hooks/use-in-view';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// Measured numbers only. Retrieval: the web repo's rag-eval harness, `sample`
// set (12 questions), before spec 050 vs. the production configuration
// (weighted fusion + vector threshold 0.6) — docs/ai/retrieval.md in web.
// Agent: notebook 80, N=10 runs per task on a local 4B open model — shipped in
// web v0.24.1. Change a value here only with a new measurement behind it.
export const RETRIEVAL_METRICS = [
  { key: 'recall', before: 0.875, after: 1 },
  { key: 'ndcg', before: 0.878, after: 0.939 },
  { key: 'mrr', before: 0.917, after: 0.944 },
  { key: 'map', before: 0.861, after: 0.906 },
] as const;

export const AGENT_METRICS = [
  { key: 'tasks', before: 22, after: 60 },
  { key: 'language', before: 32, after: 100 },
] as const;

function Bars({
  label,
  before,
  after,
  format,
  max,
  play,
}: {
  label: string;
  before: number;
  after: number;
  format: (n: number) => string;
  max: number;
  play: boolean;
}) {
  const { t } = useLandingText();
  const rows = [
    { tone: 'before', value: before, text: t('landing.benchmarks.before') },
    { tone: 'after', value: after, text: t('landing.benchmarks.after') },
  ] as const;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      {rows.map((row) => (
        <div key={row.tone} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{row.text}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-secondary">
            <span
              className={cn(
                'landing-meter block h-full rounded-full',
                row.tone === 'after' ? 'bg-accent' : 'bg-muted-foreground/40',
              )}
              style={{ width: play ? `${(row.value / max) * 100}%` : '0%' }}
            />
          </span>
          <span
            className={cn(
              'text-right font-mono text-sm tabular-nums',
              row.tone === 'after' ? 'font-semibold text-foreground' : 'text-muted-foreground',
            )}
          >
            {format(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

const formatScore = (n: number) => n.toFixed(3);
const formatPercent = (n: number) => `${n} %`;

export function BenchmarkSection() {
  const { t } = useLandingText();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="benchmarks" className="border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.benchmarks.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.benchmarks.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('landing.benchmarks.lede')}</p>
        </Reveal>

        <div ref={ref} className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <article className="landing-card flex flex-col gap-6 p-6 sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl leading-snug">{t('landing.benchmarks.retrieval.title')}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('landing.benchmarks.retrieval.set')}
              </span>
            </header>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('landing.benchmarks.retrieval.body')}</p>
            <div className="flex flex-col gap-5">
              {RETRIEVAL_METRICS.map((m) => (
                <Bars
                  key={m.key}
                  label={t(`landing.benchmarks.retrieval.metrics.${m.key}`)}
                  before={m.before}
                  after={m.after}
                  format={formatScore}
                  max={1}
                  play={inView}
                />
              ))}
            </div>
          </article>

          <article className="landing-card flex flex-col gap-6 p-6 sm:p-8">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl leading-snug">{t('landing.benchmarks.agent.title')}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('landing.benchmarks.agent.set')}
              </span>
            </header>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('landing.benchmarks.agent.body')}</p>
            <div className="flex flex-col gap-5">
              {AGENT_METRICS.map((m) => (
                <Bars
                  key={m.key}
                  label={t(`landing.benchmarks.agent.metrics.${m.key}`)}
                  before={m.before}
                  after={m.after}
                  format={formatPercent}
                  max={100}
                  play={inView}
                />
              ))}
            </div>
            <div className="mt-auto flex items-baseline gap-3 border-t border-border pt-5">
              <span className="font-display text-4xl tracking-tight text-accent whitespace-nowrap">~3 ms</span>
              <span className="text-sm leading-relaxed text-muted-foreground">{t('landing.benchmarks.latency')}</span>
            </div>
          </article>
        </div>

        <p className="mt-10 max-w-3xl border-l-2 border-primary pl-5 text-xs leading-relaxed text-muted-foreground">
          {t('landing.benchmarks.footnote')}
        </p>
      </div>
    </section>
  );
}

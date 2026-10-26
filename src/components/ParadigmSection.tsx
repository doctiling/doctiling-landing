'use client';

import { useState } from 'react';
import { FileText, MessageSquare, PenLine, Sparkles, Table2 } from 'lucide-react';
import { useInView } from '@doctiling/ui/hooks/use-in-view';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// Explains what a knowledge base is before any benchmark: one CRM where table
// documents (clients, opportunities, projects) live next to prose documents
// (contracts, meeting history), and an agent both answers and writes over them.
// Each prompt names the real agent tools it runs; the CRM itself is an
// illustration, which the footnote says.
const PILLARS = [
  { key: 'mixed', icon: Table2 },
  { key: 'ask', icon: MessageSquare },
  { key: 'write', icon: PenLine },
] as const;

const DOCS = [
  { key: 'clients', kind: 'table' },
  { key: 'opportunities', kind: 'table' },
  { key: 'projects', kind: 'table' },
  { key: 'contracts', kind: 'prose' },
  { key: 'history', kind: 'prose' },
] as const;
type DocKey = (typeof DOCS)[number]['key'];

const PROMPTS = [
  { key: 'contracts', uses: ['contracts', 'clients'] },
  { key: 'funnel', uses: ['opportunities', 'history'] },
  { key: 'register', uses: ['clients'] },
] as const satisfies readonly { key: string; uses: readonly DocKey[] }[];
type PromptKey = (typeof PROMPTS)[number]['key'];

const FUNNEL = [
  { key: 'lead', count: 48 },
  { key: 'qualified', count: 21 },
  { key: 'proposal', count: 9 },
  { key: 'won', count: 4 },
] as const;

const TABLE_COLS = ['name', 'sector', 'owner', 'stage'] as const;
const TABLE_ROWS = ['r1', 'r2', 'new'] as const;

function Step({ index, children, className }: { index: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('landing-step', className)} style={{ animationDelay: `${150 + index * 350}ms` }}>
      {children}
    </div>
  );
}

function Answer({ prompt }: { prompt: PromptKey }) {
  const { t } = useLandingText();
  const answer = <p className="text-sm leading-relaxed">{t(`landing.paradigm.prompts.${prompt}.answer`)}</p>;

  if (prompt === 'funnel') {
    const max = FUNNEL[0].count;
    return (
      <div className="flex flex-col gap-2">
        {FUNNEL.map(({ key, count }) => (
          <div key={key} className="flex items-center gap-3 text-xs">
            <span className="w-24 shrink-0 text-muted-foreground">{t(`landing.paradigm.funnel.${key}`)}</span>
            <span className="h-5 rounded-md bg-accent/80" style={{ width: `${(count / max) * 70}%` }} />
            <span className="font-mono tabular-nums">{count}</span>
          </div>
        ))}
        <div className="mt-2">{answer}</div>
      </div>
    );
  }

  if (prompt === 'register') {
    return (
      <div className="flex flex-col gap-3">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground">
              <tr>
                {TABLE_COLS.map((col) => (
                  <th key={col} className="px-3 py-2 font-medium">
                    {t(`landing.paradigm.table.cols.${col}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row} className={cn('border-t border-border', row === 'new' && 'bg-emerald-500/10 font-medium')}>
                  {TABLE_COLS.map((col) => (
                    <td key={col} className="whitespace-nowrap px-3 py-2">
                      {t(`landing.paradigm.table.rows.${row}.${col}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {answer}
      </div>
    );
  }

  return answer;
}

export function ParadigmSection() {
  const { t } = useLandingText();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [active, setActive] = useState<PromptKey>('contracts');
  const used = new Set<DocKey>(PROMPTS.find((p) => p.key === active)!.uses);

  return (
    <section id="paradigm" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.paradigm.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.paradigm.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('landing.paradigm.lede')}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 90}>
              <article className="landing-card h-full p-6">
                <Icon className="size-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl leading-snug">{t(`landing.paradigm.pillars.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.paradigm.pillars.${key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {/* The base: every kind of document side by side */}
          <article className="landing-card flex flex-col overflow-hidden lg:col-span-4">
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="font-display text-lg">{t('landing.paradigm.base.name')}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {t('landing.paradigm.base.scope')}
              </span>
            </header>
            <ul className="flex flex-col gap-2 p-5" aria-label={t('landing.paradigm.base.name')}>
              {DOCS.map(({ key, kind }) => {
                const Icon = kind === 'table' ? Table2 : FileText;
                const on = used.has(key);
                return (
                  <li
                    key={key}
                    data-used={on ? 'true' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-300',
                      on ? 'border-accent/50 bg-accent/10' : 'border-border bg-background',
                    )}
                  >
                    <Icon className={cn('size-4 shrink-0', on ? 'text-accent' : 'text-muted-foreground')} aria-hidden="true" />
                    <span className="flex-1">{t(`landing.paradigm.docs.${key}`)}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {t(`landing.paradigm.kinds.${kind}`)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>

          {/* The agent: ask and write in natural language */}
          <article className="landing-card flex flex-col overflow-hidden !border-accent/40 lg:col-span-8">
            <header className="flex items-center justify-between border-b border-border bg-accent px-5 py-3 text-accent-foreground">
              <span className="inline-flex items-center gap-2 font-display text-lg">
                <Sparkles className="size-4" aria-hidden="true" />
                {t('landing.paradigm.agent.name')}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-foreground/70">
                {t('landing.paradigm.agent.scope')}
              </span>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <div role="tablist" aria-label={t('landing.paradigm.agent.tryLabel')} className="flex flex-wrap gap-2">
                {PROMPTS.map(({ key }) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={key === active}
                    onClick={() => setActive(key)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-left text-sm transition-colors',
                      key === active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-foreground/80 hover:text-foreground',
                    )}
                  >
                    {t(`landing.paradigm.prompts.${key}.chip`)}
                  </button>
                ))}
              </div>

              <div ref={ref} className={cn('flex flex-1 flex-col', inView && 'is-visible')}>
                <div key={active} role="tabpanel" className="flex flex-1 flex-col gap-4">
                  <Step index={0}>
                    <p className="rounded-xl bg-secondary/60 px-4 py-3 text-sm font-medium">
                      {t(`landing.paradigm.prompts.${active}.question`)}
                    </p>
                  </Step>
                  <Step index={1} className="font-mono text-xs text-muted-foreground">
                    {t(`landing.paradigm.prompts.${active}.tools`)}
                  </Step>
                  <Step index={2} className="mt-auto rounded-xl border-l-[3px] border-l-emerald-500 bg-emerald-500/5 px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                      {t('landing.paradigm.answerLabel')}
                    </span>
                    <div className="mt-2">
                      <Answer prompt={active} />
                    </div>
                  </Step>
                </div>
              </div>
            </div>
          </article>
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">{t('landing.paradigm.footnote')}</p>
      </div>
    </section>
  );
}

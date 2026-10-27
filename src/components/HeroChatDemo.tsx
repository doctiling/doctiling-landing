'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';

// The hero demo: the same semantic layer over four fictional knowledge bases.
// Each scenario is a short chat — the person asks or instructs, the agent runs
// its real tools, answers with block citations and, when asked, writes
// (a row, a document, a scheduled job). The domain switcher exists so the demo
// never reads as "Doctiling is a CRM" or "Doctiling is for lawyers".
const DOMAINS = ['legal', 'clinic', 'ops', 'research'] as const;
export type DemoDomain = (typeof DOMAINS)[number];

type Kind = 'u' | 't' | 'a' | 'x';
type Line = { kind: Kind; key: string; cites?: readonly string[] };

const SCRIPTS: Record<DemoDomain, readonly Line[]> = {
  legal: [
    { kind: 'u', key: 'u1' },
    { kind: 't', key: 't1' },
    { kind: 'a', key: 'a1', cites: ['c1', 'c2'] },
    { kind: 'u', key: 'u2' },
    { kind: 't', key: 't2' },
    { kind: 'a', key: 'a2' },
    { kind: 'x', key: 'x1' },
  ],
  clinic: [
    { kind: 'u', key: 'u1' },
    { kind: 't', key: 't1' },
    { kind: 'a', key: 'a1', cites: ['c1', 'c2'] },
    { kind: 'x', key: 'x1' },
    { kind: 'u', key: 'u2' },
    { kind: 't', key: 't2' },
    { kind: 'a', key: 'a2', cites: ['c1'] },
  ],
  ops: [
    { kind: 'u', key: 'u1' },
    { kind: 't', key: 't1' },
    { kind: 'a', key: 'a1', cites: ['c1', 'c2'] },
    { kind: 'u', key: 'u2' },
    { kind: 't', key: 't2' },
    { kind: 'a', key: 'a2' },
    { kind: 'x', key: 'x1' },
  ],
  research: [
    { kind: 'u', key: 'u1' },
    { kind: 't', key: 't1' },
    { kind: 'a', key: 'a1', cites: ['c1', 'c2'] },
    { kind: 'x', key: 'x1' },
    { kind: 'u', key: 'u2' },
    { kind: 't', key: 't2' },
    { kind: 'a', key: 'a2', cites: ['c1'] },
  ],
};

// Pace of the replay, per kind of line that was just shown.
const PACE: Record<Kind, number> = { u: 500, t: 900, a: 1500, x: 700 };

function prefersReducedMotion() {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Cite({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-block rounded border border-primary/60 bg-card px-1 align-middle font-mono text-[10px] text-primary">
      {children}
    </span>
  );
}

export function HeroChatDemo({ className }: { className?: string }) {
  const { t } = useLandingText();
  const [domain, setDomain] = useState<DemoDomain>('legal');
  const [shown, setShown] = useState(SCRIPTS.legal.length);
  const [typing, setTyping] = useState(false);
  const [run, setRun] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const script = SCRIPTS[domain];
    if (prefersReducedMotion()) {
      setShown(script.length);
      setTyping(false);
      return;
    }
    let i = 0;
    setShown(0);
    const step = () => {
      i += 1;
      setShown(i);
      const next = script[i];
      setTyping(Boolean(next && (next.kind === 'a' || next.kind === 't') && script[i - 1].kind !== 't'));
      if (i < script.length) timer.current = setTimeout(step, PACE[script[i - 1].kind]);
      else setTyping(false);
    };
    timer.current = setTimeout(step, 150);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [domain, run]);

  const script = SCRIPTS[domain];
  const base = `landing.heroDemo.scripts.${domain}`;

  return (
    <article
      className={cn('landing-card flex flex-col overflow-hidden !border-accent/40', className)}
      aria-label={t('landing.heroDemo.label')}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border bg-accent px-5 py-3 text-accent-foreground">
        <span className="inline-flex items-center gap-2 font-display text-lg">
          <Sparkles className="size-4" aria-hidden="true" />
          {t(`landing.heroDemo.bases.${domain}.name`)}
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-accent-foreground/70 sm:inline">
          {t(`landing.heroDemo.bases.${domain}.meta`)}
        </span>
      </header>

      <div role="tablist" aria-label={t('landing.heroDemo.pickDomain')} className="flex border-b border-border">
        {DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            role="tab"
            aria-selected={d === domain}
            onClick={() => setDomain(d)}
            className={cn(
              'flex-1 whitespace-nowrap border-b-2 px-2 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-colors',
              d === domain
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t(`landing.heroDemo.domains.${d}`)}
          </button>
        ))}
      </div>

      <div className="flex min-h-[20rem] flex-col gap-2.5 p-4 sm:p-5" aria-live="polite">
        {script.slice(0, shown).map((line) => {
          if (line.kind === 'u') {
            return (
              <p
                key={line.key}
                className="landing-pop max-w-[92%] self-end rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-sm leading-snug text-accent-foreground"
              >
                {t(`${base}.${line.key}`)}
              </p>
            );
          }
          if (line.kind === 't') {
            return (
              <p
                key={line.key}
                className="landing-pop max-w-full overflow-x-auto whitespace-nowrap rounded-lg bg-secondary/60 px-3 py-2 font-mono text-[11px] text-muted-foreground"
              >
                {t(`${base}.${line.key}`)}
              </p>
            );
          }
          if (line.kind === 'x') {
            return (
              <p
                key={line.key}
                className="landing-pop self-start rounded-md border border-dashed border-emerald-600/70 px-2.5 py-1.5 font-mono text-[11px] text-emerald-700"
              >
                {t(`${base}.${line.key}`)}
              </p>
            );
          }
          return (
            <div
              key={line.key}
              className="landing-pop max-w-[92%] self-start rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-2.5 text-sm leading-relaxed"
            >
              {t(`${base}.${line.key}.text`)}
              {line.cites?.map((c) => (
                <Cite key={c}>{t(`${base}.${line.key}.cites.${c}`)}</Cite>
              ))}
            </div>
          );
        })}
        {typing && (
          <span
            className="landing-typing inline-flex gap-1 self-start rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-3"
            aria-hidden="true"
          >
            <i className="size-1.5 rounded-full bg-muted-foreground" />
            <i className="size-1.5 rounded-full bg-muted-foreground" />
            <i className="size-1.5 rounded-full bg-muted-foreground" />
          </span>
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          {t('landing.heroDemo.replay')}
        </button>
        <span>{t('landing.heroDemo.footnote')}</span>
      </footer>
    </article>
  );
}

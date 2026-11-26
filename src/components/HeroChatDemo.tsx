'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarClock, Check, FileText, Pause, Play, RotateCcw, Sparkles, Table2 } from 'lucide-react';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';

// The hero demo: the same semantic layer over four fictional knowledge bases.
// Each scenario is a short chat — the person asks or instructs, the agent runs
// its real tools, answers with block citations and, when asked, writes
// (a row, a document or a scheduled job). The replay mirrors the product: the
// question is typed, each tool turns from running to done, the answer streams,
// a citation opens its source and what the agent made shows up as a card.
// The domain switcher exists so the demo never reads as "Doctiling is a CRM"
// or "Doctiling is for lawyers".
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

// What the agent wrote in each domain, drawn as the matching card.
const ARTIFACT: Record<DemoDomain, 'doc' | 'row' | 'job'> = {
  legal: 'doc',
  clinic: 'row',
  ops: 'job',
  research: 'doc',
};

// Pace of the replay (ms). Answers stream word by word; each tool takes a
// believable, stable time (derived from the call text, never random).
const PACE = { char: 26, send: 380, toolPad: 260, think: 650, word: 42, cite: 260, after: 700, hold: 4500 };
const toolMs = (call: string) => 180 + ((call.length * 37) % 420);

function prefersReducedMotion() {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** `**word**` → highlighted: the part of the source block the answer used. */
function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? (
          <mark key={i} className="rounded bg-amber-200/70 px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Cite({ label, doc, quote, sourceLabel }: { label: string; doc: string; quote: string; sourceLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block align-middle">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        className="landing-cite mx-0.5 inline-block rounded border border-primary/60 bg-card px-1 font-mono text-[10px] text-primary transition-colors hover:bg-primary/10"
      >
        {label}
      </button>
      {open && (
        <span
          role="tooltip"
          className="landing-pop absolute bottom-full left-0 z-20 mb-1.5 block w-64 rounded-xl border border-border bg-card p-3 text-left text-xs leading-relaxed shadow-lg"
        >
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {sourceLabel} · {doc}
          </span>
          <Marked text={quote} />
        </span>
      )}
    </span>
  );
}

function Spinner() {
  return (
    <span
      className="landing-spin size-3 shrink-0 rounded-full border-[1.5px] border-border border-t-accent"
      aria-hidden="true"
    />
  );
}

type Progress = { line: number; sub: number; thinking: boolean };

export function HeroChatDemo({ className }: { className?: string }) {
  const { t, locale } = useLandingText();
  const [domain, setDomain] = useState<DemoDomain>('legal');
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState<Progress>({ line: SCRIPTS.legal.length, sub: 0, thinking: false });
  const [hold, setHold] = useState(0); // 0–1: the active tab's bar before the next domain
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const hovering = useRef(false);
  const pausedRef = useRef(false);
  const feed = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const base = `landing.heroDemo.scripts.${domain}`;
  const script = SCRIPTS[domain];
  const toolCalls = (key: string) => t(`${base}.${key}`).split(' · ');
  const words = (key: string) => t(`${base}.${key}.text`).split(' ');

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress({ line: script.length, sub: 0, thinking: false });
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Waits `ms`, then holds while the visitor hovers the card or paused it.
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const tick = () => {
          if (cancelled) return reject(new Error('cancelled'));
          if (pausedRef.current || hovering.current) {
            timer = setTimeout(tick, 120);
            return;
          }
          resolve();
        };
        timer = setTimeout(tick, ms);
      });

    const play = async () => {
      setHold(0);
      setProgress({ line: 0, sub: 0, thinking: false });
      for (let i = 0; i < script.length; i += 1) {
        const line = script[i];
        if (line.kind === 'u') {
          const text = t(`${base}.${line.key}`);
          for (let c = 1; c <= text.length; c += 1) {
            setProgress({ line: i, sub: c, thinking: false });
            await wait(PACE.char);
          }
          await wait(PACE.send);
        } else if (line.kind === 't') {
          const calls = toolCalls(line.key);
          for (let s = 0; s < calls.length; s += 1) {
            setProgress({ line: i, sub: s, thinking: false });
            await wait(toolMs(calls[s]) + PACE.toolPad);
          }
          setProgress({ line: i, sub: calls.length, thinking: false });
          await wait(PACE.cite);
        } else if (line.kind === 'a') {
          setProgress({ line: i, sub: 0, thinking: true });
          await wait(PACE.think);
          const total = words(line.key).length;
          const count = total + (line.cites?.length ?? 0);
          for (let w = 1; w <= count; w += 1) {
            setProgress({ line: i, sub: w, thinking: false });
            await wait(w > total ? PACE.cite : PACE.word);
          }
        } else {
          setProgress({ line: i, sub: 1, thinking: false });
        }
        await wait(PACE.after);
      }
      setProgress({ line: script.length, sub: 0, thinking: false });
      if (!autoplay) return;
      const steps = 30;
      for (let h = 1; h <= steps; h += 1) {
        await wait(PACE.hold / steps);
        setHold(h / steps);
      }
      setDomain((d) => DOMAINS[(DOMAINS.indexOf(d) + 1) % DOMAINS.length]);
    };
    play().catch(() => undefined);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // `t` and the script follow the domain and locale; the replay restarts on any of them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, run, locale, autoplay]);

  useEffect(() => {
    const el = feed.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [progress]);

  const pick = (d: DemoDomain) => {
    setAutoplay(false); // the visitor chose: stay on their domain
    setDomain(d);
    setRun((n) => n + 1);
  };

  const seconds = (key: string) =>
    (toolCalls(key).reduce((sum, call) => sum + toolMs(call), 0) / 1000).toLocaleString(locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const done = (i: number) => i < progress.line;
  const typingLine = script[progress.line]?.kind === 'u' ? script[progress.line] : undefined;
  const typingText = typingLine ? t(`${base}.${typingLine.key}`) : '';
  const composerText = typingText.slice(0, progress.sub);
  const barWidth = Math.min(100, (Math.min(progress.line, script.length) / script.length) * 85 + hold * 15);

  return (
    <article
      className={cn('landing-card flex flex-col overflow-hidden !border-accent/40', className)}
      aria-label={t('landing.heroDemo.label')}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <header className="flex items-center gap-3 border-b border-border bg-accent px-5 py-3 text-accent-foreground">
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block truncate font-display text-lg leading-tight">
            {t(`landing.heroDemo.bases.${domain}.name`)}
          </span>
          <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-accent-foreground/65">
            {t(`landing.heroDemo.bases.${domain}.meta`)}
          </span>
        </span>
        <span className="ml-auto hidden shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent-foreground/75 sm:inline-flex">
          <i className="landing-live size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
          {t('landing.heroDemo.agent')}
        </span>
      </header>

      <div role="tablist" aria-label={t('landing.heroDemo.pickDomain')} className="grid grid-cols-4 border-b border-border">
        {DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            role="tab"
            aria-selected={d === domain}
            onClick={() => pick(d)}
            className={cn(
              'relative truncate px-0.5 py-2.5 font-mono text-[10px] uppercase tracking-normal transition-colors sm:tracking-wider',
              d === domain ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(`landing.heroDemo.domains.${d}`)}
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-border" aria-hidden="true">
              <span className="block h-full bg-primary" style={{ width: d === domain ? `${barWidth}%` : '0%' }} />
            </span>
          </button>
        ))}
      </div>

      <div
        ref={feed}
        className="flex h-[23rem] flex-col gap-2.5 overflow-y-auto p-4 [scrollbar-width:none] sm:p-5 [&>*]:shrink-0"
        aria-live="polite"
      >
        {script.map((line, i) => {
          if (i > progress.line) return null;
          if (line.kind === 'u') {
            if (!done(i)) return null; // still being typed in the composer
            return (
              <p
                key={line.key}
                className="landing-pop max-w-[90%] self-end rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-sm leading-snug text-accent-foreground"
              >
                {t(`${base}.${line.key}`)}
              </p>
            );
          }
          if (line.kind === 't') {
            const calls = toolCalls(line.key);
            const finished = done(i) || progress.sub >= calls.length;
            return (
              <details
                key={line.key}
                open={!finished}
                className="landing-pop overflow-hidden rounded-xl border border-border bg-background/60 font-mono text-[11px] text-muted-foreground"
              >
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-1.5 [&::-webkit-details-marker]:hidden">
                  {finished ? <Check className="size-3 shrink-0 text-emerald-600" aria-hidden="true" /> : <Spinner />}
                  {finished
                    ? t(calls.length === 1 ? 'landing.heroDemo.toolDone' : 'landing.heroDemo.toolsDone', {
                        n: calls.length,
                        s: seconds(line.key),
                      })
                    : t('landing.heroDemo.running')}
                </summary>
                {calls.map((call, s) =>
                  finished || s <= progress.sub ? (
                    <span key={s} className="landing-pop flex items-center gap-2 border-t border-dashed border-border px-3 py-1">
                      {finished || s < progress.sub ? (
                        <Check className="size-3 shrink-0 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Spinner />
                      )}
                      <span className="truncate text-foreground/80">{call}</span>
                      {(finished || s < progress.sub) && <span className="ml-auto shrink-0 opacity-70">{toolMs(call)} ms</span>}
                    </span>
                  ) : null,
                )}
              </details>
            );
          }
          if (line.kind === 'x') {
            const kind = ARTIFACT[domain];
            const Icon = kind === 'row' ? Table2 : kind === 'job' ? CalendarClock : FileText;
            return (
              <div
                key={line.key}
                className="landing-drop w-[88%] shrink-0 self-start overflow-hidden rounded-xl border border-emerald-600/40 bg-card"
              >
                <p className="bg-emerald-50 px-3 py-1.5 font-mono text-[10.5px] text-emerald-800">{t(`${base}.${line.key}`)}</p>
                <div className="flex items-start gap-2.5 px-3 py-2.5">
                  <Icon className="mt-0.5 size-4 shrink-0 text-accent/70" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-[15px] leading-snug">{t(`${base}.${line.key}Title`)}</p>
                    {(kind === 'doc' ? [92, 76, 84] : [66]).map((w, k) => (
                      <span
                        key={w}
                        className={cn(
                          'landing-grow mt-1.5 block h-1.5 rounded-full',
                          kind === 'doc' ? 'bg-secondary' : 'bg-emerald-200/80',
                        )}
                        style={{ width: `${w}%`, animationDelay: `${200 + k * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          // The agent's answer: typing dots, then the words, then the citations.
          if (i === progress.line && progress.thinking) {
            return (
              <span
                key={line.key}
                className="landing-typing inline-flex shrink-0 gap-1 self-start rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-3"
                aria-hidden="true"
              >
                <i className="size-1.5 rounded-full bg-muted-foreground" />
                <i className="size-1.5 rounded-full bg-muted-foreground" />
                <i className="size-1.5 rounded-full bg-muted-foreground" />
              </span>
            );
          }
          const all = words(line.key);
          const shownWords = done(i) ? all.length : Math.min(progress.sub, all.length);
          const shownCites = done(i) ? (line.cites?.length ?? 0) : Math.max(0, progress.sub - all.length);
          return (
            <div
              key={line.key}
              className="landing-pop relative z-10 max-w-[92%] self-start rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-2.5 text-sm leading-relaxed"
            >
              {all.slice(0, shownWords).join(' ')}{' '}
              {line.cites?.slice(0, shownCites).map((c) => (
                <Cite
                  key={c}
                  label={t(`${base}.${line.key}.cites.${c}`)}
                  doc={t(`${base}.${line.key}.sources.${c}.doc`)}
                  quote={t(`${base}.${line.key}.sources.${c}.quote`)}
                  sourceLabel={t('landing.heroDemo.sourceLabel')}
                />
              ))}
            </div>
          );
        })}
      </div>

      <div
        className="mx-4 mb-3 flex min-h-10 items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-4 pr-1.5 text-sm"
        aria-hidden="true"
      >
        <span className={cn('flex-1 truncate', !composerText && 'text-muted-foreground/70')}>
          {composerText || t('landing.heroDemo.composer')}
          {composerText && <span className="landing-caret ml-px inline-block h-4 w-px translate-y-0.5 bg-foreground" />}
        </span>
        <span
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground transition-transform',
            typingText && composerText.length === typingText.length && 'scale-90',
          )}
        >
          <ArrowRight className="size-3.5" />
        </span>
      </div>

      <footer className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          {paused ? <Play className="size-3" aria-hidden="true" /> : <Pause className="size-3" aria-hidden="true" />}
          {paused ? t('landing.heroDemo.resume') : t('landing.heroDemo.pause')}
        </button>
        <button
          type="button"
          onClick={() => {
            setPaused(false);
            setRun((n) => n + 1);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-foreground/80 hover:text-foreground"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          {t('landing.heroDemo.replay')}
        </button>
        <span className="basis-full">{t('landing.heroDemo.footnote')}</span>
      </footer>
    </article>
  );
}

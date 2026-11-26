'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Database, MessagesSquare, RotateCcw, Workflow } from 'lucide-react';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { useInView } from '@doctiling/ui/hooks/use-in-view';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// The differentiator, in one picture: a new process should not mean a new
// system. A race plays when the section comes into view — left, building a
// system ticks through the weeks (illustrative); right, the same request asked
// to the agent over a base that already exists finishes in seconds. Three plain
// steps follow; the architecture (tenant as the semantic layer, hierarchy per
// base) is folded below for whoever wants the inside view.
const AGENTS = [
  { key: 'vac', x: 60 },
  { key: 'cert', x: 350 },
  { key: 'sys', x: 640 },
] as const;
const BASES = [
  { key: 'hr', x: 20, docs: ['d1', 'd2', 'd3', 'd4'] as const, hot: ['d2', 'd3'] as readonly string[] },
  { key: 'legal', x: 245, docs: ['d1', 'd2', 'd3'] as const, hot: [] as readonly string[] },
  { key: 'ops', x: 470, docs: ['d1', 'd2', 'd3'] as const, hot: [] as readonly string[] },
  { key: 'research', x: 695, docs: ['d1', 'd2', 'd3'] as const, hot: [] as readonly string[] },
] as const;
const ROLES = ['owner', 'admin', 'collab', 'reader'] as const;

const PRIMARY = 'hsl(var(--primary))';

export function KnowledgeTree() {
  const { t } = useLandingText();
  const k = 'landing.differentiator.tree';
  return (
    <figure className="mt-14">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 660"
          role="img"
          aria-label={t(`${k}.label`)}
          className="mx-auto block h-auto w-full min-w-[640px] max-w-5xl text-foreground"
          style={{ fontFamily: 'inherit', fontSize: 12 }}
        >
          <defs>
            <marker id="kt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          {AGENTS.map(({ key, x }) => (
            <g key={key}>
              <rect x={x} y="16" width="220" height="46" rx="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <text x={x + 110} y="35" textAnchor="middle" fill="currentColor" fontWeight="600">
                {t(`${k}.agents.${key}.title`)}
              </text>
              <text x={x + 110} y="52" textAnchor="middle" fill="currentColor" fontSize="11" opacity=".7">
                {t(`${k}.agents.${key}.sub`)}
              </text>
              <line x1={x + 110} y1="62" x2={x + 110} y2="108" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#kt-arrow)" />
              <text x={x + 118} y="90" fill="currentColor" fontSize="10.5" opacity=".75">
                {t(`${k}.agents.${key}.edge`)}
              </text>
            </g>
          ))}

          <rect x="40" y="110" width="840" height="74" rx="12" fill={PRIMARY} fillOpacity=".16" stroke={PRIMARY} strokeWidth="1.6" />
          <text x="460" y="135" textAnchor="middle" fill="currentColor" fontWeight="600" fontSize="14">
            {t(`${k}.tenant.title`)}
          </text>
          <text x="460" y="154" textAnchor="middle" fill="currentColor" fontSize="11.5" opacity=".85">
            {t(`${k}.tenant.line1`)}
          </text>
          <text x="460" y="172" textAnchor="middle" fill="currentColor" fontSize="10.5" opacity=".7">
            {t(`${k}.tenant.line2`)}
          </text>

          <g stroke="currentColor" strokeWidth="1.1" fill="none">
            <path d="M460,184 V206 H122 V226" />
            <path d="M460,206 H347 V226" />
            <path d="M460,206 H572 V226" />
            <path d="M460,206 H797 V226" />
          </g>
          <text x="470" y="200" fill="currentColor" fontSize="10.5" opacity=".75">
            {t(`${k}.start`)}
          </text>

          {BASES.map(({ key, x, docs, hot }) => {
            const b = `${k}.bases.${key}`;
            const cx = x + 102;
            return (
              <g key={key}>
                <rect x={x} y="226" width="205" height="390" rx="10" fill="hsl(var(--card))" stroke="currentColor" strokeWidth="1.3" />
                <text x={cx} y="250" textAnchor="middle" fill="currentColor" fontWeight="600" fontSize="13">
                  {t(`${b}.name`)}
                </text>
                <line x1={x + 12} y1="262" x2={x + 193} y2="262" stroke="currentColor" strokeWidth=".8" opacity=".4" />
                <text x={x + 12} y="280" fill="currentColor" fontSize="10.5" fontWeight="600" opacity=".8">
                  {t(`${k}.rolesTitle`)}
                </text>
                {ROLES.map((r, i) => (
                  <text key={r} x={x + 12} y={296 + i * 14} fill="currentColor" fontSize="10.5">
                    {t(`${b}.roles.${r}`)}
                  </text>
                ))}
                <line x1={x + 12} y1="350" x2={x + 193} y2="350" stroke="currentColor" strokeWidth=".8" opacity=".4" />
                <text x={x + 12} y="368" fill="currentColor" fontSize="10.5" fontWeight="600" opacity=".8">
                  {t(`${k}.docsTitle`)}
                </text>
                {docs.map((d, i) => {
                  const y = 378 + i * 48;
                  const isHot = hot.includes(d);
                  return (
                    <g key={d}>
                      <rect
                        x={x + 12}
                        y={y}
                        width="181"
                        height="40"
                        rx="6"
                        fill="hsl(var(--background))"
                        stroke={isHot ? PRIMARY : 'currentColor'}
                        strokeWidth={isHot ? 1.8 : 1}
                      />
                      <text x={x + 20} y={y + 16} fill="currentColor" fontSize="10.5">
                        {t(`${b}.docs.${d}.name`)}
                        <tspan opacity=".65"> · {t(`${b}.docs.${d}.kind`)}</tspan>
                      </text>
                      <text x={x + 20} y={y + 31} fill="currentColor" fontSize="9" opacity=".75">
                        {t(`${b}.docs.${d}.access`)}
                      </text>
                    </g>
                  );
                })}
                <text x={cx} y="595" textAnchor="middle" fill="currentColor" fontSize="10" opacity=".75">
                  {t(`${k}.foot.private`)}
                </text>
                <text x={cx} y="608" textAnchor="middle" fill="currentColor" fontSize="10" opacity=".75">
                  {t(`${k}.foot.endpoint`)}
                </text>
              </g>
            );
          })}

          <rect x="40" y="622" width="12" height="12" rx="3" fill="none" stroke={PRIMARY} strokeWidth="1.8" />
          <text x="60" y="632" fill="currentColor" fontSize="11">
            {t(`${k}.legend1`)}
          </text>
          <text x="60" y="648" fill="currentColor" fontSize="11" opacity=".8">
            {t(`${k}.legend2`)}
          </text>
        </svg>
      </div>
      <figcaption className="mx-auto mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">{t(`${k}.caption`)}</figcaption>
    </figure>
  );
}

const BUILD_STEPS = ['s1', 's2', 's3', 's4', 's5'] as const;
const WEEKS = [1, 3, 6, 9, 12] as const;
const PLAIN_STEPS = [
  { key: 's1', Icon: Database },
  { key: 's2', Icon: Workflow },
  { key: 's3', Icon: MessagesSquare },
] as const;
const AGENT_SECONDS = 4;
// When each beat lands (ms after the race starts).
const BUILD_AT = [400, 1300, 2300, 3300, 4300] as const;
const CHAT_AT = { u: 300, t: 900, a: 1900, x: 2900 } as const;
const RACE_MS = 5200;

function prefersReducedMotion() {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Milliseconds since the race started; the end value without motion. */
function useRace(play: boolean, run: number) {
  const [ms, setMs] = useState(RACE_MS);
  useEffect(() => {
    if (!play || prefersReducedMotion()) {
      setMs(RACE_MS);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(RACE_MS, now - start);
      setMs(elapsed);
      if (elapsed < RACE_MS) raf = requestAnimationFrame(tick);
    };
    setMs(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, run]);
  return ms;
}

export function DifferentiatorSection() {
  const { t } = useLandingText();
  const d = 'landing.differentiator';
  const { ref, inView } = useInView<HTMLDivElement>();
  const [run, setRun] = useState(0);
  const ms = useRace(inView, run);

  const builtSteps = BUILD_AT.filter((at) => ms >= at).length;
  const weeks = builtSteps ? WEEKS[builtSteps - 1] : 0;
  const shown = (at: number) => ms >= at;
  const seconds = Math.min(AGENT_SECONDS, Math.floor((Math.min(ms, CHAT_AT.x) / CHAT_AT.x) * AGENT_SECONDS));
  const agentDone = ms >= CHAT_AT.x;
  const pop = 'landing-pop';

  return (
    <section id="differentiator" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t(`${d}.eyebrow`)}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">{t(`${d}.title`)}</H2>
          <p className="text-lg leading-relaxed text-muted-foreground">{t(`${d}.lede`)}</p>
        </Reveal>

        <div ref={ref} className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Building a system for the process: weeks tick by */}
          <article className="landing-card flex h-full flex-col p-6 sm:p-7" data-testid="before">
            <header className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl leading-snug">{t(`${d}.before.title`)}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t(`${d}.before.tag`)}</span>
            </header>
            <ol className="mt-6 flex flex-col gap-3">
              {BUILD_STEPS.map((s, i) => {
                const done = i < builtSteps;
                return (
                  <li
                    key={s}
                    className={cn(
                      'grid grid-cols-[4.5rem_1fr] items-center gap-3 text-sm transition-opacity duration-300',
                      done ? 'opacity-100' : 'opacity-30',
                    )}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t(`${d}.before.week`, { n: WEEKS[i] })}
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          'grid size-4 shrink-0 place-items-center rounded-full border',
                          done ? 'border-muted-foreground bg-muted-foreground text-background' : 'border-border',
                        )}
                        aria-hidden="true"
                      >
                        {done && <Check className="size-2.5" />}
                      </span>
                      {t(`${d}.before.steps.${s}`)}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
              <span
                className="block h-full rounded-full bg-muted-foreground/60 transition-[width] duration-500"
                style={{ width: `${(weeks / WEEKS[WEEKS.length - 1]) * 100}%` }}
              />
            </div>
            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-5xl tabular-nums tracking-tight text-muted-foreground" data-weeks={weeks}>
                  {weeks}
                </span>
                <span className="text-sm text-muted-foreground">{t(`${d}.before.unit`)}</span>
              </p>
              <p
                className={cn(
                  'text-right font-mono text-xs text-destructive transition-opacity duration-500',
                  builtSteps === BUILD_STEPS.length ? 'opacity-100' : 'opacity-0',
                )}
              >
                {t(`${d}.before.tail`)}
              </p>
            </div>
          </article>

          {/* Asking the agent over a base that already exists: seconds */}
          <article className="landing-card flex h-full flex-col p-6 !border-accent/40 sm:p-7" data-testid="after">
            <header className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-2xl leading-snug">{t(`${d}.after.title`)}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t(`${d}.after.tag`)}</span>
            </header>
            <div className="mt-6 flex min-h-[15rem] flex-col gap-2.5 rounded-xl border border-border bg-background p-3 sm:p-4">
              {shown(CHAT_AT.u) && (
                <p className={cn(pop, 'max-w-[92%] self-end rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-sm leading-snug text-accent-foreground')}>
                  {t(`${d}.after.chat.u`)}
                </p>
              )}
              {shown(CHAT_AT.t) && (
                <p className={cn(pop, 'max-w-full truncate rounded-lg bg-secondary/60 px-3 py-2 font-mono text-[11px] text-muted-foreground')}>
                  {t(`${d}.after.chat.t`)}
                </p>
              )}
              {shown(CHAT_AT.a) && (
                <div className={cn(pop, 'max-w-[92%] self-start rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-2.5 text-sm leading-relaxed')}>
                  {t(`${d}.after.chat.a`)}{' '}
                  {(['c1', 'c2'] as const).map((c) => (
                    <span
                      key={c}
                      className="mx-0.5 inline-block rounded border border-primary/60 bg-card px-1 align-middle font-mono text-[10px] text-primary"
                    >
                      {t(`${d}.after.chat.${c}`)}
                    </span>
                  ))}
                </div>
              )}
              {shown(CHAT_AT.x) && (
                <p className="landing-drop self-start rounded-md border border-emerald-600/50 bg-emerald-50 px-2.5 py-1.5 font-mono text-[11px] text-emerald-800">
                  {t(`${d}.after.chat.x`)}
                </p>
              )}
            </div>
            <div className="mt-auto flex items-end justify-between gap-4 pt-6">
              <p className="flex items-baseline gap-2">
                <span className="font-display text-5xl tabular-nums tracking-tight text-accent" data-seconds={seconds}>
                  {seconds}
                </span>
                <span className="text-sm text-muted-foreground">{t(`${d}.after.unit`)}</span>
              </p>
              <p
                className={cn(
                  'max-w-[16rem] border-l-[3px] border-l-emerald-500 pl-3 text-sm leading-snug transition-opacity duration-500',
                  agentDone ? 'opacity-100' : 'opacity-0',
                )}
              >
                {t(`${d}.after.win`)}
              </p>
            </div>
          </article>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{t(`${d}.note`)}</span>
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-foreground/80 hover:text-foreground"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            {t(`${d}.replay`)}
          </button>
        </div>

        {/* How it works, in three plain steps */}
        <ol className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PLAIN_STEPS.map(({ key, Icon }, i) => (
            <li key={key}>
              <Reveal delay={i * 120} className="flex flex-col gap-3 border-t-2 border-primary pt-5">
                <span className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{i + 1}</span>
                </span>
                <h3 className="font-display text-2xl leading-snug">{t(`${d}.steps.${key}.title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`${d}.steps.${key}.body`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* The inside view, folded */}
        <details className="group mt-14 rounded-2xl border border-border bg-card/60 px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-foreground/85 hover:text-foreground [&::-webkit-details-marker]:hidden">
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            {t(`${d}.treeToggle`)}
          </summary>
          <KnowledgeTree />
        </details>
      </div>
    </section>
  );
}

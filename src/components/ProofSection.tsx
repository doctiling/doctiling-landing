'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MonitorSmartphone, SquareArrowOutUpRight, TrendingUp } from 'lucide-react';
import { useInView } from '@doctiling/ui/hooks/use-in-view';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';

// Three measured claims instead of a dashboard; the method and the rest of the
// numbers live on /documents#benchmarks (BenchmarkSection). Change a value here
// only with a new measurement behind it:
//   cites — web nb/86 (2026-10-22): answers linking the right block, 0/36 → 35/36.
//   small — web nb/80 (v0.24.1): tasks completed on a local 4B model, 22 % → 60 %.
//   edit  — spec 086 A/B (2026-11-20, 15 tasks, same model): 5/15 at 0.0129 USD, 5.5 s
//           vs 15/15 at 0.0072 USD, 1.6 s → ~5× cheaper per successful edit, ~3× faster.
export const PROOF_CLAIMS = [
  { key: 'cites', to: 97, unit: 'percent', Icon: SquareArrowOutUpRight },
  { key: 'small', from: 22, to: 60, unit: 'percent', Icon: MonitorSmartphone },
  { key: 'edit', to: 5, unit: 'times', Icon: TrendingUp },
] as const;

const GUARANTEE_KEYS = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'] as const;

function prefersReducedMotion() {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Counts up to `to` once `play` turns true; the final value without motion. */
function useCount(to: number, play: boolean, delay: number) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!play || prefersReducedMotion()) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    setN(0);
    const tick = (now: number) => {
      const p = Math.max(0, Math.min(1, (now - start) / 1300));
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, play, delay]);
  return n;
}

/** `**words**` in the copy are the part of the claim to read first. */
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-medium text-[hsl(108_30%_74%)]">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Figure({ from, to, unit, play, delay }: { from?: number; to: number; unit: string; play: boolean; delay: number }) {
  const { locale } = useLandingText();
  const n = useCount(to, play, delay);
  const fmt = (v: number) => (unit === 'times' ? `${v}×` : locale === 'es' ? `${v} %` : `${v}%`);
  return (
    <p
      className={cn(
        'whitespace-nowrap font-display leading-none tracking-tight',
        from !== undefined ? 'text-5xl sm:text-6xl lg:text-5xl xl:text-6xl' : 'text-6xl sm:text-7xl',
      )}
    >
      {from !== undefined && (
        <>
          <span>{fmt(from)}</span>
          <span className="mx-2 text-[0.75em] text-[hsl(108_30%_68%)]" aria-hidden="true">
            →
          </span>
        </>
      )}
      <span className="text-[hsl(108_30%_74%)]" data-value={to}>
        {fmt(n)}
      </span>
    </p>
  );
}

export function ProofSection() {
  const { t, locale } = useLandingText();
  const { ref, inView } = useInView<HTMLDivElement>();
  const methodHref = `/${locale}/documents#benchmarks`;

  const band = (copy: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" data-copy={copy ? '' : undefined} aria-hidden={copy || undefined}>
      {GUARANTEE_KEYS.map((g) => (
        <li key={g} className="flex items-center gap-8 whitespace-nowrap">
          <span>{t(`landing.proof.guarantees.items.${g}`)}</span>
          <span className="text-[0.45em] text-[hsl(108_30%_68%)]" aria-hidden="true">
            ◆
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="benchmarks" aria-labelledby="proof-title" className="overflow-hidden bg-accent text-accent-foreground">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-6 sm:pt-24 lg:px-10">
        <MiniTitle className="text-accent-foreground/60">{t('landing.proof.eyebrow')}</MiniTitle>
        <H2 id="proof-title" className="mt-4 max-w-2xl text-balance text-4xl not-italic leading-tight !text-accent-foreground sm:text-5xl">
          {t('landing.proof.title')}
        </H2>

        <div ref={ref} className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {PROOF_CLAIMS.map((claim, i) => (
            <article
              key={claim.key}
              aria-label={t(`landing.proof.items.${claim.key}.label`)}
              className={cn(
                'landing-proof-card flex flex-col gap-6 p-7 transition-all duration-700 ease-out sm:p-8',
                inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
              )}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <span className="grid size-9 place-items-center rounded-lg border border-accent-foreground/50">
                <claim.Icon className="size-4" aria-hidden="true" />
              </span>
              <Figure from={'from' in claim ? claim.from : undefined} to={claim.to} unit={claim.unit} play={inView} delay={i * 150} />
              <p className="text-lg leading-snug text-accent-foreground/90 sm:text-xl">
                <Emphasis text={t(`landing.proof.items.${claim.key}.text`)} />
              </p>
              <Link
                href={methodHref}
                className="mt-auto text-sm text-accent-foreground/85 underline decoration-dotted underline-offset-4 hover:text-accent-foreground"
              >
                {t('landing.proof.link')}
                <span className="sr-only">: {t(`landing.proof.items.${claim.key}.label`)}</span>
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div
        role="region"
        aria-label={t('landing.proof.guarantees.label')}
        className="mt-16 overflow-hidden border-y border-accent-foreground/15 py-5 font-display text-2xl sm:text-4xl"
      >
        <div className="landing-marquee">
          {band(false)}
          {band(true)}
        </div>
      </div>
      <div className="h-12 sm:h-16" />
    </section>
  );
}

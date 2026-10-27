'use client';

import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';
import { ChatMock } from './ChatMock';

// The differentiator: a process no longer needs a system of screens, it needs a
// knowledge base and an agent. Left, the system you would have to build (menu,
// form, buttons). Right, the same request as a chat over a base that already
// has its permissions. Below, where the hierarchy actually lives: the tenant is
// the semantic layer (no data, only judgement); each knowledge base below it
// carries its own roles and, per document, who sees and who writes.
const NAV = ['home', 'vac', 'cert', 'appt', 'reports'] as const;
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

function Field({ label, value, hint }: { label: string; value: string; hint?: boolean }) {
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('rounded border border-border bg-card px-2 py-1', hint && 'text-muted-foreground')}>{value}</span>
    </>
  );
}

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

export function DifferentiatorSection() {
  const { t } = useLandingText();
  const d = 'landing.differentiator';

  return (
    <section id="differentiator" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t(`${d}.eyebrow`)}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">{t(`${d}.title`)}</H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t(`${d}.lede`)}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* The system you would build: one screen per process */}
          <Reveal>
            <article className="landing-card flex h-full flex-col p-6" data-testid="before">
              <header className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl leading-snug">{t(`${d}.before.title`)}</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t(`${d}.before.tag`)}</span>
              </header>
              <div className="mt-5 overflow-hidden rounded-xl border border-border bg-background text-xs" aria-hidden="true">
                <div className="flex gap-4 overflow-x-auto whitespace-nowrap border-b border-border px-3 py-2 text-muted-foreground">
                  {NAV.map((n) => (
                    <span key={n} className={cn(n === 'vac' && 'border-b-2 border-muted-foreground font-semibold text-foreground')}>
                      {t(`${d}.before.nav.${n}`)}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 p-3">
                  <Field label={t(`${d}.before.form.type`)} value={t(`${d}.before.form.typeVal`)} />
                  <Field label={t(`${d}.before.form.start`)} value={t(`${d}.before.form.dateHint`)} hint />
                  <Field label={t(`${d}.before.form.end`)} value={t(`${d}.before.form.dateHint`)} hint />
                  <Field label={t(`${d}.before.form.approver`)} value={t(`${d}.before.form.approverVal`)} hint />
                  <div className="col-span-2 mt-1 flex justify-end gap-2">
                    <span className="rounded border border-border bg-card px-2.5 py-1">{t(`${d}.before.form.cancel`)}</span>
                    <span className="rounded bg-muted-foreground px-2.5 py-1 text-background">{t(`${d}.before.form.submit`)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground">{t(`${d}.before.step`)}</p>
              <p className="mt-2 font-mono text-xs text-destructive">{t(`${d}.before.cost`)}</p>
            </article>
          </Reveal>

          {/* The agent over a base that already exists */}
          <Reveal delay={120}>
            <article className="landing-card flex h-full flex-col p-6 !border-accent/40" data-testid="after">
              <header className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl leading-snug">{t(`${d}.after.title`)}</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t(`${d}.after.tag`)}</span>
              </header>
              <ChatMock
                className="mt-5"
                lines={[
                  { kind: 'u', text: t(`${d}.after.chat.u`) },
                  { kind: 't', text: t(`${d}.after.chat.t`) },
                  { kind: 'a', text: t(`${d}.after.chat.a`), cites: [t(`${d}.after.chat.c1`), t(`${d}.after.chat.c2`)] },
                  { kind: 'x', text: t(`${d}.after.chat.x`) },
                ]}
              />
              <p className="mt-4 font-mono text-xs text-muted-foreground">{t(`${d}.after.step`)}</p>
              <p className="mt-2 border-l-[3px] border-l-emerald-500 pl-3 text-sm leading-relaxed">{t(`${d}.after.win`)}</p>
            </article>
          </Reveal>
        </div>

        <KnowledgeTree />
      </div>
    </section>
  );
}

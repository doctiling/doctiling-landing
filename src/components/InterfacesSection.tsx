'use client';

import { useState } from 'react';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { BrowserFrame } from '@doctiling/ui/molecules/browser-frame';
import { cn } from '@doctiling/ui/cn';
import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// One knowledge base, four surfaces. Studio, chat and mobile are real captures
// of the fictional demo base "Nortera Logística · Comité ejecutivo" (local
// dev.db, answers generated live by the agent); the MCP tab is a terminal
// transcript drawn in HTML so the tool call stays legible at any width.
const SURFACES = [
  { key: 'studio', shot: '/screenshots/nortera-studio.webp' },
  { key: 'chat', shot: '/screenshots/nortera-chat.webp' },
  { key: 'mcp', shot: null },
  { key: 'mobile', shot: '/screenshots/nortera-mobile-chat.webp' },
] as const;

type SurfaceKey = (typeof SURFACES)[number]['key'];

function McpTranscript() {
  const { t } = useLandingText();
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#141a21] font-mono text-[12px] leading-relaxed text-slate-200 shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[11px] text-slate-400">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-2">{t('landing.anywhere.mcp.window')}</span>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <p>
          <span className="text-emerald-400">›</span> {t('landing.anywhere.mcp.prompt')}
        </p>
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <span className="text-sky-300">search_knowledge_base</span>
          <span className="text-slate-500"> · {t('landing.anywhere.mcp.toolCall')}</span>
          <pre className="mt-1.5 whitespace-pre-wrap text-slate-400">{`{ "query": "${t('landing.anywhere.mcp.query')}", "mode": "hybrid" }`}</pre>
          <p className="mt-1.5 text-emerald-400">{t('landing.anywhere.mcp.result')}</p>
        </div>
        <div className="border-l-2 border-emerald-500 pl-3">
          <p className="text-slate-100">{t('landing.anywhere.mcp.answer')}</p>
          <p className="mt-1 text-slate-500">{t('landing.anywhere.mcp.citations')}</p>
        </div>
      </div>
    </div>
  );
}

export function InterfacesSection() {
  const { t } = useLandingText();
  const [active, setActive] = useState<SurfaceKey>('studio');
  const surface = SURFACES.find((s) => s.key === active) ?? SURFACES[0];

  return (
    <section id="anywhere" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <MiniTitle>{t('landing.anywhere.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">{t('landing.anywhere.title')}</H2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-5xl">
          <div
            id="anywhere-panel"
            role="tabpanel"
            aria-labelledby={`anywhere-tab-${surface.key}`}
            className="flex min-h-[20rem] items-center justify-center"
          >
            {surface.key === 'mcp' ? (
              <div className="w-full max-w-2xl">
                <McpTranscript />
              </div>
            ) : surface.key === 'mobile' ? (
              <div className="landing-shot w-64 overflow-hidden rounded-[2.75rem] border-[10px] border-[#141a21] bg-[#141a21] sm:w-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={surface.shot}
                  alt={t('landing.anywhere.mobile.alt')}
                  loading="lazy"
                  className="block h-auto w-full rounded-[2rem]"
                />
              </div>
            ) : (
              <BrowserFrame src={surface.shot} alt={t(`landing.anywhere.${surface.key}.alt`)} width={1440} height={900} />
            )}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            {t(`landing.anywhere.${surface.key}.body`)}
          </p>

          <div
            role="tablist"
            aria-label={t('landing.anywhere.tablistLabel')}
            className="mx-auto mt-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1"
          >
            {SURFACES.map(({ key }) => {
              const selected = key === surface.key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`anywhere-tab-${key}`}
                  aria-selected={selected}
                  aria-controls="anywhere-panel"
                  onClick={() => setActive(key)}
                  className={cn(
                    'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    selected ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(`landing.anywhere.${key}.tab`)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

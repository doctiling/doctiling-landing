'use client';

import { Archive, ScanSearch, Sparkles, UserCheck, Bot, Users } from 'lucide-react';
import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';

// Visitors kept reading "a place to upload documents". This section names the
// two things people confuse us with, then shows the lifecycle — and who does
// each stage — that makes a knowledge base more than storage or retrieval.
const COMPARE = [
  { key: 'dms', Icon: Archive, highlight: false },
  { key: 'vector', Icon: ScanSearch, highlight: false },
  { key: 'doctiling', Icon: Sparkles, highlight: true },
] as const;

const ROLE_ICON = { expert: UserCheck, agent: Bot, both: Users } as const;

const STAGES = [
  { key: 'gather', role: 'both' },
  { key: 'structure', role: 'agent' },
  { key: 'curate', role: 'expert' },
  { key: 'analyze', role: 'both' },
  { key: 'share', role: 'both' },
] as const;

export function KnowledgeSection() {
  const { t } = useLandingText();

  return (
    <section id="knowledge" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.knowledge.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.knowledge.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">{t('landing.knowledge.lede')}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {COMPARE.map(({ key, Icon, highlight }, i) => (
            <Reveal key={key} delay={i * 110}>
              <article
                className={`landing-card landing-card-hover flex h-full flex-col gap-3 p-7 lg:p-8 ${
                  highlight ? '!border-accent !bg-accent text-accent-foreground' : ''
                }`}
              >
                <Icon
                  className={`size-5 ${highlight ? 'text-accent-foreground' : 'text-muted-foreground'}`}
                  aria-hidden="true"
                />
                <span
                  className={`font-mono text-[10px] uppercase tracking-widest ${
                    highlight ? 'text-accent-foreground/70' : 'text-muted-foreground'
                  }`}
                >
                  {t(`landing.knowledge.compare.${key}.kicker`)}
                </span>
                <h3 className="font-display text-2xl leading-snug">
                  {t(`landing.knowledge.compare.${key}.verb`)}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    highlight ? 'text-accent-foreground/85' : 'text-muted-foreground'
                  }`}
                >
                  {t(`landing.knowledge.compare.${key}.body`)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 flex max-w-3xl flex-col gap-3">
          <h3 className="font-display text-3xl leading-snug">{t('landing.knowledge.lifecycleTitle')}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{t('landing.knowledge.lifecycleLede')}</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STAGES.map(({ key, role }, i) => {
            const RoleIcon = ROLE_ICON[role];
            return (
              <Reveal key={key} delay={i * 100}>
                <article className="landing-card landing-card-hover flex h-full flex-col gap-3 p-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent/10 font-display text-lg text-accent">
                    0{i + 1}
                  </span>
                  <h4 className="font-display text-xl leading-snug">
                    {t(`landing.knowledge.stages.${key}.title`)}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.knowledge.stages.${key}.body`)}
                  </p>
                  <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-foreground/80">
                    <RoleIcon className="size-3 text-accent" aria-hidden="true" />
                    {t(`landing.knowledge.roles.${role}`)}
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

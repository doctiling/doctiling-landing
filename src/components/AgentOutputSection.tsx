'use client';

import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { Reveal } from './Reveal';
import { ChartPreview, FlowPreview, MindmapPreview, ComparePreview } from './landing-diagrams';

const OUTPUTS = [
  { key: 'chart', Preview: ChartPreview },
  { key: 'diagram', Preview: FlowPreview },
  { key: 'mindmap', Preview: MindmapPreview },
  { key: 'table', Preview: ComparePreview },
] as const;

export function AgentOutputSection() {
  const { t } = useLandingText();

  return (
    <section id="agent-output" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <Reveal className="flex max-w-3xl flex-col gap-4">
          <MiniTitle>{t('landing.agentOutput.eyebrow')}</MiniTitle>
          <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
            {t('landing.agentOutput.title')}
          </H2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t('landing.agentOutput.lede')}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OUTPUTS.map(({ key, Preview }, i) => (
            <Reveal key={key} delay={i * 110} className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-lg border border-border bg-card/70 p-3">
                <Preview
                  label={t(`landing.agentOutput.items.${key}.previewAlt`)}
                  className="h-auto w-full text-accent/80"
                />
              </div>
              <h3 className="font-display text-xl leading-snug">
                {t(`landing.agentOutput.items.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`landing.agentOutput.items.${key}.body`)}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-10">
          <p className="max-w-3xl border-l-2 border-accent/60 pl-5 text-sm leading-relaxed text-muted-foreground">
            {t('landing.agentOutput.footnote')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

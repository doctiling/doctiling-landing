'use client';

import { useLandingText } from '../host';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@doctiling/ui/molecules/accordion';
import { Reveal } from './Reveal';
import { FAQ_KEYS } from './faq-keys';

export function FaqSection() {
  const { t } = useLandingText();
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <MiniTitle className="mb-6">{t('landing.faq.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.faq.title')}
            </H2>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={120}>
            <Accordion type="single" collapsible className="landing-card w-full divide-y divide-border px-6 sm:px-8">
              {FAQ_KEYS.map((key) => (
                <AccordionItem key={key} value={key} className="border-0">
                  <AccordionTrigger className="gap-4 py-5 text-left font-display text-lg font-normal leading-snug hover:no-underline hover:text-accent">
                    {t(`landing.faq.items.${key}.q`)}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-2xl pb-6 text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.faq.items.${key}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

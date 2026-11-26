'use client';

import Link from 'next/link';
import { ArrowUpRight, Briefcase, Calculator, GraduationCap, Landmark, Scale, Stethoscope } from 'lucide-react';
import { useLandingText } from '../host';
import { useCasePath } from '../routes';
import { useCaseForVertical } from '../use-cases';
import { Reveal } from './Reveal';

const VERTICALS = [
  { key: 'legal', Icon: Scale },
  { key: 'health', Icon: Stethoscope },
  { key: 'finance', Icon: Landmark },
  { key: 'accounting', Icon: Calculator },
  { key: 'research', Icon: GraduationCap },
  { key: 'consulting', Icon: Briefcase },
] as const;

// The home page keeps one line about sectors: a chip per field, straight to its
// use case (or its section of /verticals), and the way to the full page. The
// cards with each field's edge live on /verticals.
export function VerticalsSection() {
  const { t, locale } = useLandingText();

  return (
    <section id="verticals" aria-labelledby="verticals-strip" className="border-t border-border">
      <Reveal className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-5 py-10 sm:px-6 lg:px-10">
        <h2 id="verticals-strip" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {t('landing.verticals.stripLabel')}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {VERTICALS.map(({ key, Icon }) => {
            const useCase = useCaseForVertical(key);
            return (
              <li key={key}>
                <Link
                  href={useCase ? `/${locale}/${useCasePath(useCase)}` : `/${locale}/verticals#${key}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground/85 transition-colors hover:border-primary hover:bg-primary/10 hover:text-foreground"
                >
                  <Icon className="size-3.5 text-accent/70" aria-hidden="true" />
                  {t(`landing.verticals.items.${key}.title`)}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={`/${locale}/verticals`}
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {t('landing.verticals.stripMore')}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}

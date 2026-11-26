'use client';

import { useLandingText } from '../host';
import { Reveal } from './Reveal';

// How the monthly AI balance runs out and is topped up: four steps and the four
// amounts, the minimum first. It used to sit under the plans on the home page;
// it now lives on /pricing and the plans link here (`#top-ups`).
const TOPUP_STEP_KEYS = ['s1', 's2', 's3', 's4'] as const;
const PACK_KEYS = ['p50', 'p200', 'p500', 'p1000'] as const;

export function TopUpsSection() {
  const { t } = useLandingText();

  return (
    <section id="top-ups" className="scroll-mt-20 border-t border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-10">
        <Reveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">{t('landing.tiers.topups.title')}</h2>
            <p className="text-base leading-relaxed text-muted-foreground">{t('landing.tiers.topups.body')}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {TOPUP_STEP_KEYS.map((s, i) => (
                <li key={s} className="border-t border-border pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{i + 1}</span>
                  <p className="mt-1 font-display text-xl leading-snug">{t(`landing.tiers.topups.steps.${s}.title`)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`landing.tiers.topups.steps.${s}.body`)}
                  </p>
                </li>
              ))}
            </ol>
            <div className="landing-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-left">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                      {t('landing.tiers.topups.cols.pack')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">
                      {t('landing.tiers.topups.cols.price')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">
                      {t('landing.tiers.topups.cols.each')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PACK_KEYS.map((pack) => (
                    <tr key={pack} data-pack={pack} className="border-t border-border">
                      <th scope="row" className="px-6 py-4 text-left font-normal">
                        {t(`landing.tiers.topups.packs.${pack}.name`)}
                      </th>
                      <td className="px-6 py-4 text-right font-display text-xl tracking-tight">
                        {t(`landing.tiers.topups.packs.${pack}.price`)}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {t(`landing.tiers.topups.packs.${pack}.each`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-border px-6 py-4 text-xs leading-relaxed text-muted-foreground">
                {t('landing.tiers.topups.note')}
              </p>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

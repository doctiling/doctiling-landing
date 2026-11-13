'use client';

import { H2 } from '@doctiling/ui/atoms/typography';

// FAQ block of the catalogue pages (use cases, comparisons). The same entries
// feed the FAQPage JSON-LD (src/seo.ts), so what the crawler reads is what the
// visitor sees.
export function FaqList({ title, items }: { title: string; items: Array<{ id: string; q: string; a: string }> }) {
  return (
    <section id="faq" className="border-b border-border bg-card/60">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <H2 className="text-balance text-3xl not-italic leading-tight">{title}</H2>
        <dl className="mt-10 flex flex-col divide-y divide-border">
          {items.map(({ id, q, a }) => (
            <div key={id} className="py-6">
              <dt className="font-display text-xl leading-snug">{q}</dt>
              <dd className="mt-3 text-base leading-relaxed text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

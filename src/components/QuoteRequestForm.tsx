'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Info } from 'lucide-react';
import { Button } from '@doctiling/ui/atoms/button';
import { Checkbox } from '@doctiling/ui/atoms/checkbox';
import { Input } from '@doctiling/ui/atoms/input';
import { Label } from '@doctiling/ui/atoms/label';
import { Textarea } from '@doctiling/ui/atoms/textarea';
import { SimpleTooltip } from '@doctiling/ui/molecules/tooltip';
import { useAsyncAction } from '@doctiling/ui/hooks/use-async-action';
import { useRecaptchaV3 } from '@doctiling/ui/hooks/use-recaptcha-v3';
import { useLandingHost } from '../host';
import { LANDING_EVENTS } from '../analytics';

const labelClass = 'text-[10px] font-medium uppercase tracking-widest text-muted-foreground';
const PLANS = ['basico', 'avanzado', 'maximo'] as const;
type Plan = (typeof PLANS)[number];
// The quote names plans as billing does; the price list in the tiers section names them in English.
const TIER_KEY = { basico: 'basic', avanzado: 'advanced', maximo: 'max' } as const satisfies Record<Plan, string>;
const PLAN_FACTS = ['queries', 'daily', 'info'] as const;

// A company asks for a quote (doctiling-billing US13): how many people on each plan. Billing prices it from the
// price list in force and emails a link to accept it; then the company's space is created.
export function QuoteRequestForm() {
  const { t, locale, notify, submitQuoteRequest, recaptchaSiteKey, consent: consentCopy, href, track } = useLandingHost();
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [counts, setCounts] = useState<Record<Plan, string>>({ basico: '', avanzado: '', maximo: '' });
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  /** Where the quote went: the form gives way to a confirmation that stays on screen. */
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { execute: executeCaptcha } = useRecaptchaV3(recaptchaSiteKey);
  const [consentLabelBefore, consentLabelAfter] = consentCopy.label.split('{policy}');

  const members = Object.fromEntries(
    PLANS.map((p) => [p, Number.parseInt(counts[p], 10)]).filter(([, n]) => Number.isInteger(n) && (n as number) > 0),
  ) as Partial<Record<Plan, number>>;
  // What a plan includes, from the same copy as the price list: a company's price per person, the AI balance,
  // what it yields, the space and who it fits. The tooltip shows it; the input carries it as its description.
  const planPrice = (p: Plan) => `${t(`landing.tiers.items.gold.prices.${TIER_KEY[p]}`)} ${t('landing.quote.perPerson')}`;
  const planFacts = (p: Plan) => PLAN_FACTS.map((f) => t(`landing.tiers.plans.items.${TIER_KEY[p]}.${f}`));
  const planFit = (p: Plan) => t(`landing.tiers.plans.items.${TIER_KEY[p]}.fit`);
  const planSummary = (p: Plan) => [planPrice(p), ...planFacts(p), planFit(p)].join(' · ');
  const people = Object.values(members).reduce((a, n) => a + (n ?? 0), 0);

  const { run: submit, pending: submitting } = useAsyncAction(async () => {
    if (!submitQuoteRequest) return;
    if (!company.trim() || !contactName.trim() || !email.trim()) {
      notify({ title: t('landing.quote.errors.missing_fields'), variant: 'destructive' });
      return;
    }
    if (people === 0) {
      notify({ title: t('landing.quote.errors.invalid_members'), variant: 'destructive' });
      return;
    }
    try {
      const captchaToken = (await executeCaptcha('quote_request')) ?? undefined;
      const res = await submitQuoteRequest({
        company,
        contactName,
        contactEmail: email,
        members,
        notes,
        website,
        captchaToken,
        consent: true,
        locale,
      });
      if (res.ok) {
        track(LANDING_EVENTS.lead, { form: 'quote', team_size: String(people) });
        notify({ title: t('landing.quote.success') });
        setSentTo(email.trim());
        setCompany('');
        setContactName('');
        setEmail('');
        setCounts({ basico: '', avanzado: '', maximo: '' });
        setNotes('');
        setConsent(false);
      } else {
        notify({ title: t(`landing.quote.errors.${res.error ?? 'unavailable'}`), variant: 'destructive' });
      }
    } catch (err) {
      console.error('[quote-request] submit failed', err);
      notify({ title: t('landing.quote.errors.unavailable'), variant: 'destructive' });
    }
  });

  if (sentTo) {
    return (
      <div role="status" className="grid gap-4 border border-border bg-card p-7">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{t('landing.quote.sent.kicker')}</p>
        <p className="font-display text-2xl text-foreground">{t('landing.quote.sent.title')}</p>
        <p className="text-sm leading-relaxed text-foreground/85">{t('landing.quote.sent.body', { email: sentTo })}</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground/85">
          <li>{t('landing.quote.sent.step1')}</li>
          <li>{t('landing.quote.sent.step2')}</li>
          <li>{t('landing.quote.sent.step3')}</li>
        </ol>
        <p className="text-[12px] text-muted-foreground">{t('landing.quote.sent.spam')}</p>
        <div>
          <Button type="button" variant="tile" size="tile" onClick={() => setSentTo(null)}>
            {t('landing.quote.sent.again')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="grid gap-4 border border-border bg-card p-7"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="quote-company" className={labelClass}>
            {t('landing.quote.fields.company')}
          </Label>
          <Input id="quote-company" value={company} onChange={(e) => setCompany(e.target.value)} className="rounded-none" autoComplete="organization" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="quote-name" className={labelClass}>
            {t('landing.quote.fields.name')}
          </Label>
          <Input id="quote-name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-none" autoComplete="name" />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="quote-email" className={labelClass}>
            {t('landing.quote.fields.email')}
          </Label>
          <Input id="quote-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-none" autoComplete="email" />
        </div>
      </div>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className={`${labelClass} mb-2`}>{t('landing.quote.fields.people')}</legend>
        {PLANS.map((p) => (
          <div key={p} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Label htmlFor={`quote-${p}`} className={labelClass}>
                {t(`landing.quote.plans.${p}`)}
              </Label>
              <SimpleTooltip
                side="top"
                contentClassName="max-w-[17rem] rounded-none border-border bg-popover p-0 text-left shadow-lg"
                label={
                  <div data-plan-tip={p}>
                    <p className="border-b border-border px-3.5 py-2.5">
                      <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        {t(`landing.quote.plans.${p}`)}
                      </span>
                      <span className="font-display text-xl tabular-nums text-foreground">
                        {t(`landing.tiers.items.gold.prices.${TIER_KEY[p]}`)}
                      </span>{' '}
                      <span className="text-[11px] text-muted-foreground">{t('landing.quote.perPerson')}</span>
                    </p>
                    <ul className="space-y-1 px-3.5 py-2.5 text-[12px] leading-snug text-foreground/85">
                      {planFacts(p).map((fact) => (
                        <li key={fact} className="flex gap-2">
                          <span aria-hidden="true" className="mt-[0.45em] size-1 shrink-0 rounded-full bg-accent" />
                          {fact}
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-border px-3.5 py-2 text-[11px] italic text-muted-foreground">{planFit(p)}</p>
                  </div>
                }
              >
                <button
                  type="button"
                  aria-label={`${t('landing.quote.planInfo')}: ${t(`landing.quote.plans.${p}`)}`}
                  className="inline-flex size-5 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <Info className="size-3.5" aria-hidden="true" />
                </button>
              </SimpleTooltip>
            </div>
            <span id={`quote-${p}-info`} className="sr-only">
              {planSummary(p)}
            </span>
            <Input
              id={`quote-${p}`}
              aria-describedby={`quote-${p}-info`}
              type="number"
              min={0}
              inputMode="numeric"
              value={counts[p]}
              onChange={(e) => setCounts((c) => ({ ...c, [p]: e.target.value }))}
              className="rounded-none"
            />
          </div>
        ))}
      </fieldset>
      <div className="space-y-1">
        <Label htmlFor="quote-notes" className={labelClass}>
          {t('landing.quote.fields.notes')}
        </Label>
        <Textarea id="quote-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="rounded-none" />
      </div>
      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
          <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5 rounded-none" />
          <span>
            {consentLabelBefore}
            <Link href={href('dataProcessing')} className="font-medium underline underline-offset-2 hover:text-foreground" target="_blank" rel="noreferrer">
              {consentCopy.policyLabel}
            </Link>
            {consentLabelAfter}
          </span>
        </label>
        {consentCopy.notice}
      </div>
      <div>
        <Button type="submit" variant="tile-filled" size="tile" disabled={submitting || !consent}>
          {submitting ? t('landing.quote.submitting') : t('landing.quote.submit')}
          <ArrowUpRight className="ml-1 size-4" />
        </Button>
      </div>
    </form>
  );
}

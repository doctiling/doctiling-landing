'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@doctiling/ui/atoms/button';
import { Checkbox } from '@doctiling/ui/atoms/checkbox';
import { Input } from '@doctiling/ui/atoms/input';
import { Label } from '@doctiling/ui/atoms/label';
import { Textarea } from '@doctiling/ui/atoms/textarea';
import { useAsyncAction } from '@doctiling/ui/hooks/use-async-action';
import { useRecaptchaV3 } from '@doctiling/ui/hooks/use-recaptcha-v3';
import { useLandingHost } from '../host';
import { LANDING_EVENTS } from '../analytics';

const labelClass = 'text-[10px] font-medium uppercase tracking-widest text-muted-foreground';
const PLANS = ['basico', 'avanzado', 'maximo'] as const;
type Plan = (typeof PLANS)[number];

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
  const { execute: executeCaptcha } = useRecaptchaV3(recaptchaSiteKey);
  const [consentLabelBefore, consentLabelAfter] = consentCopy.label.split('{policy}');

  const members = Object.fromEntries(
    PLANS.map((p) => [p, Number.parseInt(counts[p], 10)]).filter(([, n]) => Number.isInteger(n) && (n as number) > 0),
  ) as Partial<Record<Plan, number>>;
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
            <Label htmlFor={`quote-${p}`} className={labelClass}>
              {t(`landing.quote.plans.${p}`)}
            </Label>
            <Input
              id={`quote-${p}`}
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

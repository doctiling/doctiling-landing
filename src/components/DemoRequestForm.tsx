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

const labelClass = 'text-[10px] font-medium uppercase tracking-widest text-muted-foreground';

export function DemoRequestForm() {
  const { t, locale, notify, submitDemoRequest, recaptchaSiteKey, consent: consentCopy, href } = useLandingHost();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const { execute: executeCaptcha } = useRecaptchaV3(recaptchaSiteKey);
  const [consentLabelBefore, consentLabelAfter] = consentCopy.label.split('{policy}');

  const reset = () => {
    setName('');
    setCompany('');
    setEmail('');
    setTeamSize('');
    setMessage('');
    setWebsite('');
    setConsent(false);
  };

  const { run: submit, pending: submitting } = useAsyncAction(async () => {
    // Email-only is a valid lead (same contract as the hero capture); the rest
    // of the fields sharpen it but never block it.
    if (!email.trim()) {
      notify({ title: t('landing.demo.errors.invalid_email'), variant: 'destructive' });
      return;
    }
    // The button is disabled until this is ticked; this guard only covers a
    // forced submit (e.g. Enter on a field before the click handler runs).
    if (!consent) {
      notify({ title: t('landing.demo.errors.consent_required'), variant: 'destructive' });
      return;
    }
    try {
      const captchaToken = (await executeCaptcha('demo_request')) ?? undefined;
      const res = await submitDemoRequest({
        name,
        company,
        email,
        teamSize,
        message,
        website,
        captchaToken,
        consent: true,
        locale: locale,
      });
      if (res.ok) {
        notify({ title: t('landing.demo.success') });
        reset();
      } else {
        notify({ title: t(`landing.demo.errors.${res.error ?? 'unknown'}`), variant: 'destructive' });
      }
    } catch (err) {
      console.error('[demo-request] submit failed', err);
      notify({ title: t('landing.demo.errors.unknown'), variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 border border-border bg-card p-7">
      {/* Honeypot — hidden from humans, bots fill it and the request is dropped server-side. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="demo-website">Website</label>
        <input
          id="demo-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="demo-name" className={labelClass}>
            {t('landing.demo.fields.name')}
          </Label>
          <Input
            id="demo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('landing.demo.fields.namePlaceholder')}
            className="rounded-none"
            autoComplete="name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="demo-company" className={labelClass}>
            {t('landing.demo.fields.company')}
          </Label>
          <Input
            id="demo-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t('landing.demo.fields.companyPlaceholder')}
            className="rounded-none"
            autoComplete="organization"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="demo-email" className={labelClass}>
            {t('landing.demo.fields.email')}
          </Label>
          <Input
            id="demo-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('landing.demo.fields.emailPlaceholder')}
            className="rounded-none"
            autoComplete="email"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="demo-team" className={labelClass}>
            {t('landing.demo.fields.teamSize')}
          </Label>
          <Input
            id="demo-team"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder={t('landing.demo.fields.teamSizePlaceholder')}
            className="rounded-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="demo-message" className={labelClass}>
          {t('landing.demo.fields.message')}
        </Label>
        <Textarea
          id="demo-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('landing.demo.fields.messagePlaceholder')}
          rows={4}
          className="rounded-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
          <Checkbox
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            className="mt-0.5 rounded-none"
          />
          <span>
            {consentLabelBefore}
            <Link
              href={href('dataProcessing')}
              className="font-medium underline underline-offset-2 hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              {consentCopy.policyLabel}
            </Link>
            {consentLabelAfter}
          </span>
        </label>
        {consentCopy.notice}
      </div>

      <div>
        <Button type="submit" variant="tile-filled" size="tile" disabled={submitting || !consent}>
          {submitting ? t('landing.demo.submitting') : t('landing.demo.submit')}
          <ArrowUpRight className="ml-1 size-4" />
        </Button>
      </div>
    </form>
  );
}

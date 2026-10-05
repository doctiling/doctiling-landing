'use client';

import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@doctiling/ui/atoms/button';
import { Input } from '@doctiling/ui/atoms/input';
import { Label } from '@doctiling/ui/atoms/label';
import { SimpleTooltip } from '@doctiling/ui/molecules/tooltip';
import { useAsyncAction } from '@doctiling/ui/hooks/use-async-action';
import { useRecaptchaV3 } from '@doctiling/ui/hooks/use-recaptcha-v3';
import { useLandingHost } from '../host';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// One field is the whole ask: the invitation flow only needs an address to
// write to. Name, company and use case are collected later, in the full form.
export function HeroAccessForm({ detailsHref }: { detailsHref: string }) {
  const { t, notify, submitDemoRequest, recaptchaSiteKey } = useLandingHost();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { execute: executeCaptcha } = useRecaptchaV3(recaptchaSiteKey);

  const { run: submit, pending } = useAsyncAction(async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      notify({ title: t('landing.demo.errors.invalid_email'), variant: 'destructive' });
      return;
    }
    try {
      const captchaToken = (await executeCaptcha('demo_request')) ?? undefined;
      const res = await submitDemoRequest({ email: value, captchaToken });
      if (res.ok) {
        setSent(true);
        return;
      }
      notify({ title: t(`landing.demo.errors.${res.error ?? 'unknown'}`), variant: 'destructive' });
    } catch (err) {
      console.error('[hero-access] submit failed', err);
      notify({ title: t('landing.demo.errors.unknown'), variant: 'destructive' });
    }
  });

  if (sent) {
    return (
      <div className="landing-card flex flex-col items-start gap-2 px-5 py-4">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <Check className="size-4 shrink-0 text-emerald-500" />
          {t('landing.hero.access.success')}
        </p>
        <a
          href={detailsHref}
          className="text-xs uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t('landing.hero.access.details')}
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-end"
    >
      <div className="flex-1 space-y-1">
        <Label
          htmlFor="hero-email"
          className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground"
        >
          {t('landing.hero.access.emailLabel')}
        </Label>
        <Input
          id="hero-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('landing.hero.access.emailPlaceholder')}
          className="h-12 rounded-full bg-card px-5 shadow-sm"
          autoComplete="email"
        />
      </div>
      <SimpleTooltip label={t('landing.hero.access.submitHint')}>
        <Button type="submit" variant="pill" size="pill" disabled={pending}>
          {pending ? t('landing.demo.submitting') : t('landing.hero.access.submit')}
          <ArrowUpRight className="size-4" />
        </Button>
      </SimpleTooltip>
    </form>
  );
}

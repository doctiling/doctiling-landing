'use client';

import type { ReactNode } from 'react';
import { Apple, ArrowUpRight, Check, Copy, FileText, Github, Terminal, MonitorSmartphone } from 'lucide-react';
import { Button } from '@doctiling/ui/atoms/button';
import { H2, MiniTitle } from '@doctiling/ui/atoms/typography';
import { SimpleTooltip } from '@doctiling/ui/molecules/tooltip';
import { useCopyFeedback } from '@doctiling/ui/hooks/use-copy-feedback';
import { useLandingHost, useLandingText } from '../host';
import { Reveal } from './Reveal';

// The binaries live in a separate PUBLIC repo — the code repo is private, so
// an anonymous brew/scoop/curl fetch against it would 404. See
// docs/runbooks/self-hosting.md § "Distribution architecture".
export const RELEASES_URL = 'https://github.com/doctiling/releases';
// Self-host is sovereign use under a paid license; its text lives next to the installers.
export const LICENSE_URL = `${RELEASES_URL}/blob/main/LICENSE`;

export const INSTALL_COMMANDS = [
  { key: 'mac', Icon: Apple, command: 'brew tap doctiling/tap && brew install doctiling' },
  {
    key: 'windows',
    Icon: MonitorSmartphone,
    command: 'scoop bucket add doctiling https://github.com/doctiling/scoop-bucket && scoop install doctiling',
  },
  {
    key: 'linux',
    Icon: Terminal,
    command: 'curl -fsSL https://raw.githubusercontent.com/doctiling/releases/main/install.sh | sh',
  },
] as const;

const SPLIT = ['license', 'hosted'] as const;

// `section`: the connect page block (#self-host). `panel`: the same content inside the
// pricing tabs, where the quote form sits on the same page.
export function SelfHostSection({ variant = 'section' }: { variant?: 'section' | 'panel' }) {
  const { t, locale } = useLandingText();
  const { submitQuoteRequest } = useLandingHost();
  const { copiedKey, copy } = useCopyFeedback();
  // A license is quoted like a company plan; without a quote form, the demo request takes it.
  const quoteAnchor = submitQuoteRequest ? '#cotizar' : '#demo';
  const quoteHref = variant === 'panel' ? quoteAnchor : `/${locale}${quoteAnchor}`;
  const Wrapper = variant === 'panel' ? PanelWrapper : SectionWrapper;

  return (
    <Wrapper>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <MiniTitle className="mb-6">{t('landing.selfHost.eyebrow')}</MiniTitle>
            <H2 className="text-balance text-4xl not-italic leading-tight sm:text-5xl">
              {t('landing.selfHost.title')}
            </H2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              {t('landing.selfHost.lede')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SimpleTooltip label={t('landing.selfHost.licenseHint')}>
                <Button asChild variant="pill" size="pill">
                  <a href={quoteHref} data-license-quote>
                    {t('landing.selfHost.licenseCta')} <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </SimpleTooltip>
              <SimpleTooltip label={t('landing.selfHost.repoHint')}>
                <Button asChild variant="pill-outline" size="pill">
                  <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">
                    <Github className="size-4" />
                    {t('landing.selfHost.repoCta')}
                  </a>
                </Button>
              </SimpleTooltip>
            </div>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t('landing.selfHost.sourceNote')}{' '}
              <SimpleTooltip label={t('landing.selfHost.licenseLinkHint')}>
                <a
                  href={LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                >
                  <FileText className="size-3" aria-hidden="true" />
                  {t('landing.selfHost.licenseLink')}
                </a>
              </SimpleTooltip>
            </p>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-7">
            <div className="flex flex-col gap-px bg-border">
              {INSTALL_COMMANDS.map(({ key, Icon, command }) => (
                <div key={key} className="bg-card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {t(`landing.selfHost.channels.${key}`)}
                    </span>
                    <SimpleTooltip label={t('landing.selfHost.copyHint')}>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`${t('landing.selfHost.copy')} · ${key}`}
                        onClick={() => copy(command, key)}
                      >
                        {copiedKey === key ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </SimpleTooltip>
                  </div>
                  <code className="mt-3 block whitespace-pre-wrap break-all text-[13px] leading-relaxed text-foreground/90">
                    {command}
                  </code>
                </div>
              ))}
            </div>

            <div className="mt-px grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
              {SPLIT.map((side) => (
                <div key={side} className="bg-card p-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    {t(`landing.selfHost.${side}.price`)}
                  </span>
                  <h3 className="mt-2 font-display text-xl leading-snug">
                    {t(`landing.selfHost.${side}.title`)}
                  </h3>
                  <ul className="mt-4 space-y-1.5">
                    {(['p1', 'p2', 'p3'] as const).map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        <span>{t(`landing.selfHost.${side}.bullets.${p}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
    </Wrapper>
  );
}

function SectionWrapper({ children }: { children: ReactNode }) {
  return (
    <section id="self-host" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">{children}</div>
    </section>
  );
}

function PanelWrapper({ children }: { children: ReactNode }) {
  return <div className="landing-card p-8 lg:p-10">{children}</div>;
}

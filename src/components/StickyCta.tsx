'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { Button } from '@doctiling/ui/atoms/button';
import { SimpleTooltip } from '@doctiling/ui/molecules/tooltip';
import { useLandingText } from '../host';

// The page runs ~14 screens deep with the next conversion point near the
// bottom; this keeps one reachable at any scroll depth.
const HERO_HEIGHT = 700;

export function StickyCta({ href }: { href: string }) {
  const { t } = useLandingText();
  const [pastHero, setPastHero] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > HERO_HEIGHT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A fixed-position banner has no natural place to stop: without this it
  // sits on top of the footer's last ~60px once the visitor reaches the
  // bottom of the page.
  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!pastHero || dismissed || nearFooter) return null;

  return (
    <div className="landing-card landing-card-in fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 !rounded-full p-1.5 pl-4 shadow-xl print:hidden sm:bottom-6">
      <p className="hidden min-w-0 text-sm text-muted-foreground md:block">{t('landing.sticky.pitchShort')}</p>
      <SimpleTooltip label={t('landing.sticky.hint')}>
        <Button asChild variant="pill" size="pill-sm">
          <Link href={href}>
            {t('landing.hero.ctaPrimary')} <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </SimpleTooltip>
      <SimpleTooltip label={t('landing.sticky.dismiss')}>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full"
          aria-label={t('landing.sticky.dismiss')}
          onClick={() => setDismissed(true)}
        >
          <X className="size-4" />
        </Button>
      </SimpleTooltip>
    </div>
  );
}

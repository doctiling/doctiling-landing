'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { useLandingText } from '../host';

// A click-to-load facade over the vertical demo short: the poster is a local
// asset, so nothing reaches YouTube until the visitor presses play. Then the
// privacy-enhanced embed (youtube-nocookie, the host's allowed frame-src)
// replaces it and starts playing.
export function HeroVideo({ videoId, poster }: { videoId: string; poster: string }) {
  const { t } = useLandingText();
  const [playing, setPlaying] = useState(false);

  return (
    <div className="landing-card relative mx-auto aspect-[9/16] w-full max-w-[20rem] overflow-hidden bg-[#141a21]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
          title={t('landing.hero.videoTitle')}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t('landing.hero.videoPlay')}
          className="group absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-4 ring-background/60 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
          >
            <Play className="ml-1 size-7 fill-current" />
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur"
          >
            <Play className="size-3.5 fill-current" />
            {t('landing.hero.videoPlay')}
          </span>
        </button>
      )}
    </div>
  );
}

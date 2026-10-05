// Editorial SVG illustrations for the marketing landing. All shapes inherit
// `currentColor` so the same component looks right on dark, light, hero,
// section, and footer backgrounds. Kept inline (no external SVG files) so
// the markup can be tweaked alongside the surrounding copy.

import type { SVGProps } from 'react';

type IllustrationProps = SVGProps<SVGSVGElement>;

export function HeroIllustration(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <pattern id="hero-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" stroke="currentColor" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="320" height="320" fill="url(#hero-grid)" />

      {/* document stack */}
      <rect x="44" y="56" width="180" height="220" rx="4" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="56" y="44" width="180" height="220" rx="4" stroke="currentColor" strokeOpacity="0.55" />
      <rect x="68" y="32" width="180" height="220" rx="4" fill="currentColor" fillOpacity="0.04" />
      <g opacity="0.9">
        <line x1="86" y1="62" x2="208" y2="62" />
        <line x1="86" y1="78" x2="208" y2="78" />
        <line x1="86" y1="94" x2="170" y2="94" />
        <line x1="86" y1="118" x2="208" y2="118" />
        <line x1="86" y1="134" x2="190" y2="134" />
        <line x1="86" y1="158" x2="208" y2="158" />
        <line x1="86" y1="174" x2="160" y2="174" />
      </g>

      {/* citation marker */}
      <g transform="translate(180 188)">
        <circle r="22" fill="currentColor" fillOpacity="0.08" />
        <circle r="22" />
        <path d="M-9 -6h6v8c0 4-2 7-5 9M3 -6h6v8c0 4-2 7-5 9" />
      </g>

      {/* agent thread line */}
      <path
        d="M250 80 C280 110 280 170 230 200 C200 220 170 220 150 240"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeDasharray="3 4"
      />
      <circle cx="250" cy="80" r="4" fill="currentColor" />
      <circle cx="150" cy="240" r="4" fill="currentColor" />
    </svg>
  );
}

export function FeatureIllustration({
  name,
  ...props
}: IllustrationProps & {
  name: 'knowledgeBase' | 'agent' | 'mirror' | 'rag' | 'tools' | 'mcp' | 'collab';
}) {
  const common = {
    viewBox: '0 0 64 64',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };

  switch (name) {
    case 'knowledgeBase':
      return (
        <svg {...common}>
          <rect x="14" y="10" width="36" height="44" rx="3" />
          <line x1="20" y1="20" x2="44" y2="20" />
          <line x1="20" y1="28" x2="44" y2="28" />
          <line x1="20" y1="36" x2="36" y2="36" />
          <line x1="14" y1="46" x2="50" y2="46" strokeOpacity="0.5" />
          <circle cx="40" cy="46" r="2" fill="currentColor" />
        </svg>
      );
    case 'agent':
      return (
        <svg {...common}>
          <rect x="14" y="20" width="36" height="28" rx="6" />
          <circle cx="25" cy="34" r="2" fill="currentColor" />
          <circle cx="39" cy="34" r="2" fill="currentColor" />
          <line x1="32" y1="14" x2="32" y2="20" />
          <circle cx="32" cy="11" r="3" />
          <line x1="20" y1="48" x2="20" y2="54" />
          <line x1="44" y1="48" x2="44" y2="54" />
        </svg>
      );
    case 'mirror':
      return (
        <svg {...common}>
          <rect x="10" y="14" width="44" height="36" rx="3" />
          <line x1="32" y1="14" x2="32" y2="50" />
          <line x1="16" y1="22" x2="27" y2="22" />
          <line x1="16" y1="30" x2="27" y2="30" />
          <line x1="16" y1="38" x2="23" y2="38" />
          <line x1="37" y1="22" x2="48" y2="22" strokeOpacity="0.6" />
          <line x1="37" y1="30" x2="48" y2="30" strokeOpacity="0.6" />
          <circle cx="39" cy="38" r="1.5" fill="currentColor" />
          <line x1="42" y1="38" x2="48" y2="38" strokeOpacity="0.6" />
        </svg>
      );
    case 'rag':
      return (
        <svg {...common}>
          <circle cx="24" cy="32" r="14" />
          <path d="M34 42l10 10" />
          <path d="M18 32h12M24 26v12" strokeOpacity="0.6" />
          <rect x="40" y="14" width="14" height="14" rx="2" />
          <line x1="44" y1="18" x2="50" y2="18" />
          <line x1="44" y1="22" x2="48" y2="22" />
        </svg>
      );
    case 'tools':
      return (
        <svg {...common}>
          <rect x="10" y="14" width="14" height="36" rx="2" />
          <rect x="28" y="22" width="14" height="28" rx="2" />
          <rect x="46" y="10" width="10" height="40" rx="2" />
          <line x1="14" y1="22" x2="20" y2="22" />
          <line x1="14" y1="30" x2="20" y2="30" />
          <line x1="32" y1="30" x2="38" y2="30" />
          <line x1="32" y1="38" x2="38" y2="38" />
        </svg>
      );
    case 'mcp':
      return (
        <svg {...common}>
          <circle cx="20" cy="32" r="6" />
          <circle cx="44" cy="20" r="6" />
          <circle cx="44" cy="44" r="6" />
          <line x1="26" y1="32" x2="38" y2="22" />
          <line x1="26" y1="32" x2="38" y2="42" />
          <path d="M44 14v-4M44 54v-4" strokeOpacity="0.5" />
        </svg>
      );
    case 'collab':
      return (
        <svg {...common}>
          <circle cx="20" cy="26" r="6" />
          <path d="M10 46c0-6 4-10 10-10s10 4 10 10" />
          <circle cx="42" cy="22" r="5" strokeOpacity="0.7" />
          <path d="M34 42c0-5 4-9 8-9s8 4 8 9" strokeOpacity="0.7" />
        </svg>
      );
  }
}

export function WorkflowStepIllustration({
  step,
  ...props
}: IllustrationProps & { step: 'gather' | 'curate' | 'operate' }) {
  const common = {
    viewBox: '0 0 80 80',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };

  if (step === 'gather') {
    return (
      <svg {...common}>
        <rect x="18" y="14" width="44" height="52" rx="3" />
        <line x1="26" y1="26" x2="54" y2="26" />
        <line x1="26" y1="34" x2="54" y2="34" />
        <line x1="26" y1="42" x2="42" y2="42" />
        <circle cx="56" cy="56" r="8" fill="currentColor" fillOpacity="0.1" />
        <line x1="56" y1="52" x2="56" y2="60" />
        <line x1="52" y1="56" x2="60" y2="56" />
      </svg>
    );
  }
  if (step === 'curate') {
    return (
      <svg {...common}>
        <path d="M16 50v8a4 4 0 0 0 4 4h40a4 4 0 0 0 4-4v-8" />
        <path d="M40 14v32" />
        <path d="M28 26l12-12 12 12" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M18 18h36a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H32l-10 10v-10h-4a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4z" />
      <circle cx="30" cy="32" r="1.5" fill="currentColor" />
      <circle cx="38" cy="32" r="1.5" fill="currentColor" />
      <circle cx="46" cy="32" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function PunctuationMark(props: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M24 18c-8 4-12 12-12 22v28h22V40H22c0-8 4-14 14-18l-12-4zM62 18c-8 4-12 12-12 22v28h22V40H60c0-8 4-14 14-18l-12-4z" />
    </svg>
  );
}

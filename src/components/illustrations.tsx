// Editorial SVG illustrations for the marketing landing. All shapes inherit
// `currentColor` so the same component looks right on dark, light, hero,
// section, and footer backgrounds. Kept inline (no external SVG files) so
// the markup can be tweaked alongside the surrounding copy.

import type { SVGProps } from 'react';

type IllustrationProps = SVGProps<SVGSVGElement>;

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

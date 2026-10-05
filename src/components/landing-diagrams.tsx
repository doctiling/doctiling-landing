// Animated, decorative diagrams for the marketing landing. Every shape inherits
// `currentColor` so one component reads correctly on card, accent and footer
// backgrounds. Motion comes from the `landing-*` classes in globals.css, which
// are neutralized under prefers-reduced-motion — the meaning always lives in the
// HTML beside the drawing, never in the movement.

import type { SVGProps } from 'react';

type DiagramProps = SVGProps<SVGSVGElement> & { label: string };

const frame = {
  viewBox: '0 0 320 200',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Svg({ label, children, ...props }: DiagramProps) {
  return (
    <svg role="img" aria-label={label} {...frame} {...props}>
      {children}
    </svg>
  );
}

export function TextDocPreview({ label, ...props }: DiagramProps) {
  return (
    <Svg label={label} {...props}>
      <rect x="24" y="16" width="272" height="168" rx="6" strokeOpacity="0.35" />
      <rect x="44" y="36" width="96" height="10" rx="2" fill="currentColor" fillOpacity="0.55" stroke="none" />
      {[62, 78, 94].map((y, i) => (
        <rect
          key={y}
          x="44"
          y={y}
          width={i === 2 ? 150 : 232}
          height="6"
          rx="3"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="none"
          className="landing-typeline"
          style={{ animationDelay: `${i * 260}ms` }}
        />
      ))}
      <rect x="36" y="114" width="248" height="52" rx="4" fill="currentColor" fillOpacity="0.05" strokeOpacity="0.45" />
      <rect x="36" y="114" width="3" height="52" rx="1.5" fill="currentColor" stroke="none" />
      {[126, 140].map((y, i) => (
        <rect
          key={y}
          x="52"
          y={y}
          width={i === 1 ? 128 : 196}
          height="6"
          rx="3"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="none"
          className="landing-typeline"
          style={{ animationDelay: `${900 + i * 260}ms` }}
        />
      ))}
      <g className="landing-blink">
        <rect x="52" y="152" width="52" height="12" rx="6" fill="currentColor" fillOpacity="0.14" stroke="none" />
        <text x="59" y="161" fontSize="8" fill="currentColor" stroke="none" fontFamily="monospace">
          #12
        </text>
      </g>
    </Svg>
  );
}

export function TableDocPreview({ label, ...props }: DiagramProps) {
  const cols = [44, 108, 172, 236];
  const rows = [70, 96, 122, 148];
  return (
    <Svg label={label} {...props}>
      <rect x="24" y="16" width="272" height="168" rx="6" strokeOpacity="0.35" />
      <rect x="36" y="34" width="248" height="24" rx="3" fill="currentColor" fillOpacity="0.1" stroke="none" />
      {cols.map((x) => (
        <rect key={x} x={x} y="42" width="40" height="8" rx="2" fill="currentColor" fillOpacity="0.5" stroke="none" />
      ))}
      {rows.map((y, r) => (
        <g key={y}>
          <line x1="36" y1={y - 8} x2="284" y2={y - 8} strokeOpacity="0.25" />
          {cols.map((x, c) => (
            <rect
              key={x}
              x={x}
              y={y}
              width={c === 3 ? 28 : 40}
              height="8"
              rx="2"
              fill="currentColor"
              fillOpacity={c === 3 ? 0.45 : 0.2}
              stroke="none"
              className="landing-blink"
              style={{ animationDelay: `${(r * 4 + c) * 90}ms` }}
            />
          ))}
        </g>
      ))}
      <line x1="36" y1="160" x2="284" y2="160" strokeOpacity="0.25" />
      <text x="36" y="176" fontSize="9" fill="currentColor" stroke="none" fontFamily="monospace" opacity="0.6">
        SELECT … WHERE
      </text>
    </Svg>
  );
}

export function GraphDocPreview({ label, ...props }: DiagramProps) {
  const nodes = [
    { x: 160, y: 100, r: 15, hub: true },
    { x: 70, y: 52, r: 9 },
    { x: 68, y: 148, r: 9 },
    { x: 250, y: 46, r: 9 },
    { x: 258, y: 132, r: 9 },
    { x: 166, y: 172, r: 7 },
    { x: 118, y: 30, r: 6 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 6],
    [3, 4],
    [2, 5],
  ] as const;
  return (
    <Svg label={label} {...props}>
      <rect x="24" y="16" width="272" height="168" rx="6" strokeOpacity="0.35" />
      <g strokeOpacity="0.5">
        {edges.map(([a, b], i) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            className="landing-draw"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </g>
      <circle cx="160" cy="100" r="42" strokeOpacity="0.25" strokeDasharray="3 5" />
      {nodes.map((n, i) => (
        <g key={`${n.x}-${n.y}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r + 5}
            fill="currentColor"
            fillOpacity="0.1"
            stroke="none"
            className="landing-node"
            style={{ animationDelay: `${i * 240}ms` }}
          />
          <circle cx={n.x} cy={n.y} r={n.r} fill="currentColor" fillOpacity={n.hub ? 0.7 : 0.35} stroke="none" />
        </g>
      ))}
    </Svg>
  );
}

export function ConnectMiniPreview({ label, ...props }: DiagramProps) {
  const spokes = [
    { x: 62, y: 46, d: 'M104 58 C130 62 138 84 148 96' },
    { x: 62, y: 122, d: 'M104 138 C130 134 138 114 148 104' },
    { x: 202, y: 46, d: 'M256 58 C230 62 222 84 212 96' },
    { x: 202, y: 122, d: 'M256 138 C230 134 222 114 212 104' },
  ];
  return (
    <Svg label={label} {...props}>
      <g className="text-accent">
        {spokes.map((s, i) => (
          <g key={s.d}>
            <path d={s.d} stroke="currentColor" strokeOpacity="0.45" className="landing-flow" />
            <circle
              r="2.6"
              fill="currentColor"
              stroke="none"
              className="landing-packet"
              style={{ offsetPath: `path("${s.d}")`, animationDelay: `${i * 320}ms` }}
            />
          </g>
        ))}
        <rect x="148" y="86" width="64" height="28" rx="8" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeOpacity="0.6" />
      </g>
      {spokes.map((s) => (
        <rect key={`${s.x}-${s.y}`} x={s.x} y={s.y} width="42" height="24" rx="5" strokeOpacity="0.45" fill="currentColor" fillOpacity="0.04" />
      ))}
      {[110, 160, 210].map((x) => (
        <rect key={x} x={x} y="156" width="40" height="18" rx="9" strokeOpacity="0.35" fill="currentColor" fillOpacity="0.04" />
      ))}
      <path d="M180 114 L130 156 M180 114 L180 156 M180 114 L230 156" strokeOpacity="0.3" strokeDasharray="3 5" />
    </Svg>
  );
}

export function VerticalsMiniPreview({ label, ...props }: DiagramProps) {
  const tiles = [0, 1, 2, 3, 4, 5];
  return (
    <Svg label={label} {...props}>
      {tiles.map((i) => {
        const x = 40 + (i % 3) * 84;
        const y = 44 + Math.floor(i / 3) * 66;
        return (
          <g key={i}>
            <rect x={x} y={y} width="68" height="50" rx="6" strokeOpacity="0.4" fill="currentColor" fillOpacity="0.04" />
            <circle
              cx={x + 16}
              cy={y + 18}
              r="5"
              fill="currentColor"
              stroke="none"
              className="landing-blink"
              style={{ animationDelay: `${i * 180}ms` }}
            />
            <rect x={x + 12} y={y + 30} width="44" height="6" rx="3" fill="currentColor" fillOpacity="0.28" stroke="none" />
          </g>
        );
      })}
    </Svg>
  );
}

export function ChartPreview({ label, ...props }: DiagramProps) {
  const bars = [
    { x: 60, h: 54 },
    { x: 108, h: 92 },
    { x: 156, h: 68 },
    { x: 204, h: 116 },
    { x: 252, h: 84 },
  ];
  return (
    <Svg label={label} {...props}>
      <line x1="40" y1="164" x2="292" y2="164" strokeOpacity="0.4" />
      <line x1="40" y1="24" x2="40" y2="164" strokeOpacity="0.4" />
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={164 - b.h}
          width="26"
          height={b.h}
          rx="2"
          fill="currentColor"
          fillOpacity={i === 3 ? 0.7 : 0.32}
          stroke="none"
          className="landing-bar"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </Svg>
  );
}

export function FlowPreview({ label, ...props }: DiagramProps) {
  return (
    <Svg label={label} {...props}>
      <rect x="34" y="80" width="70" height="38" rx="4" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.05" />
      <rect x="130" y="30" width="70" height="38" rx="4" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.05" />
      <rect x="130" y="130" width="70" height="38" rx="4" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.05" />
      <rect x="226" y="80" width="62" height="38" rx="19" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.05" />
      <g className="landing-flow" strokeOpacity="0.7">
        <path d="M104 94 C118 94 118 49 130 49" />
        <path d="M104 104 C118 104 118 149 130 149" />
        <path d="M200 49 C214 49 214 94 226 94" />
        <path d="M200 149 C214 149 214 104 226 104" />
      </g>
      {[
        [69, 99],
        [165, 49],
        [165, 149],
        [257, 99],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 20} y={y - 4} width="40" height="7" rx="3" fill="currentColor" fillOpacity="0.28" stroke="none" />
      ))}
    </Svg>
  );
}

export function MindmapPreview({ label, ...props }: DiagramProps) {
  const leaves = [
    { x: 240, y: 42 },
    { x: 240, y: 82 },
    { x: 240, y: 122 },
    { x: 240, y: 162 },
  ];
  return (
    <Svg label={label} {...props}>
      <g strokeOpacity="0.55" className="landing-draw">
        {leaves.map((l) => (
          <path key={l.y} d={`M96 100 C150 100 160 ${l.y} ${l.x - 24} ${l.y}`} />
        ))}
      </g>
      <rect x="34" y="86" width="62" height="28" rx="14" fill="currentColor" fillOpacity="0.6" stroke="none" />
      {leaves.map((l, i) => (
        <g key={l.y}>
          <rect
            x={l.x - 24}
            y={l.y - 11}
            width="58"
            height="22"
            rx="11"
            fill="currentColor"
            fillOpacity="0.14"
            stroke="none"
            className="landing-blink"
            style={{ animationDelay: `${i * 220}ms` }}
          />
          <rect x={l.x - 14} y={l.y - 3} width="34" height="6" rx="3" fill="currentColor" fillOpacity="0.4" stroke="none" />
        </g>
      ))}
    </Svg>
  );
}

export function ComparePreview({ label, ...props }: DiagramProps) {
  return (
    <Svg label={label} {...props}>
      <rect x="28" y="26" width="264" height="148" rx="5" strokeOpacity="0.35" />
      <line x1="120" y1="26" x2="120" y2="174" strokeOpacity="0.3" />
      <line x1="206" y1="26" x2="206" y2="174" strokeOpacity="0.3" />
      <line x1="28" y1="60" x2="292" y2="60" strokeOpacity="0.4" />
      {['A', 'B'].map((_, c) => (
        <rect key={c} x={c === 0 ? 136 : 222} y="38" width="54" height="8" rx="2" fill="currentColor" fillOpacity="0.5" stroke="none" />
      ))}
      {[80, 108, 136, 160].map((y, r) => (
        <g key={y}>
          <rect x="44" y={y} width="58" height="7" rx="3" fill="currentColor" fillOpacity="0.35" stroke="none" />
          <rect
            x="136"
            y={y}
            width="54"
            height="7"
            rx="3"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="none"
            className="landing-blink"
            style={{ animationDelay: `${r * 150}ms` }}
          />
          <rect
            x="222"
            y={y}
            width="54"
            height="7"
            rx="3"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="none"
            className="landing-blink"
            style={{ animationDelay: `${r * 150 + 80}ms` }}
          />
        </g>
      ))}
    </Svg>
  );
}

type ConnectLabels = {
  core: string;
  coreSub: string;
  channels: string[];
  stores: string[];
  protocol: string;
  query: string;
  answer: string;
  storesCaption: string;
};

const CHANNEL_GLYPHS = [
  // phone
  'M-6 -11h12a2 2 0 0 1 2 2v18a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-18a2 2 0 0 1 2 -2z M-2 16h4',
  // chat bubble
  'M-10 -8h20a2 2 0 0 1 2 2v11a2 2 0 0 1 -2 2h-13l-6 5v-5h-1a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2z',
  // terminal
  'M-11 -9h22a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-22a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2z M-6 -2l4 4l-4 4 M1 6h6',
  // building
  'M-10 11v-20h12v20 M2 11v-12h8v12 M-6 -5h4 M-6 1h4 M5 -5h2 M5 1h2 M-13 11h26',
];

const STORE_GLYPHS = [
  // stacked lines (text)
  <path key="text" d="M-9 -6h18 M-9 0h18 M-9 6h11" stroke="currentColor" />,
  // grid (tables)
  <path key="table" d="M-9 -7h18v14h-18z M-9 -2h18 M-9 3h18 M-3 -7v14 M3 -7v14" stroke="currentColor" />,
  // nodes and edges (graphs)
  <g key="graph" stroke="currentColor">
    <path d="M-6 -4 L6 -6 M-6 -4 L-2 6 M6 -6 L-2 6" strokeOpacity="0.7" />
    <circle cx="-6" cy="-4" r="2.6" fill="currentColor" />
    <circle cx="6" cy="-6" r="2.6" fill="currentColor" />
    <circle cx="-2" cy="6" r="2.6" fill="currentColor" />
  </g>,
];

// Hub-and-spoke with live traffic: four client surfaces on the outside, the
// knowledge base in the middle, the three storage substrates underneath. Dots
// travel the connectors in both directions — query in, cited answer back.
// `role="img"` + the label make the whole drawing one opaque node for assistive
// tech; the cards next to it carry the same information as text.
export function ConnectDiagram({
  label,
  labels,
  ...props
}: SVGProps<SVGSVGElement> & { label: string; labels: ConnectLabels }) {
  const boxes = [
    { x: 30, y: 60, text: labels.channels[0], path: 'M220 95 C272 95 276 166 295 176' },
    { x: 30, y: 250, text: labels.channels[1], path: 'M220 285 C272 285 276 226 295 216' },
    { x: 600, y: 60, text: labels.channels[2], path: 'M600 95 C548 95 544 166 525 176' },
    { x: 600, y: 250, text: labels.channels[3], path: 'M600 285 C548 285 544 226 525 216' },
  ];
  const storePaths = [
    'M255 348 C255 300 410 300 410 252',
    'M410 348 L410 252',
    'M565 348 C565 300 410 300 410 252',
  ];

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 820 430"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <defs>
        <pattern id="connect-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" stroke="currentColor" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="820" height="430" fill="url(#connect-grid)" stroke="none" />

      {/* connectors + traffic */}
      <g className="text-accent">
        {[...boxes.map((b) => b.path), ...storePaths].map((d, i) => (
          <g key={d}>
            <path d={d} stroke="currentColor" strokeOpacity="0.45" className="landing-flow" style={{ animationDelay: `${i * 180}ms` }} />
            <circle
              r="3.5"
              fill="currentColor"
              stroke="none"
              className="landing-packet"
              style={{ offsetPath: `path("${d}")`, animationDelay: `${i * 340}ms` }}
            />
            {i < 4 && (
              <circle
                r="3"
                fill="currentColor"
                fillOpacity="0.55"
                stroke="none"
                className="landing-packet-back"
                style={{ offsetPath: `path("${d}")`, animationDelay: `${i * 340 + 900}ms` }}
              />
            )}
          </g>
        ))}
      </g>

      {/* client surfaces */}
      {boxes.map((b, i) => (
        <g key={b.text}>
          <rect x={b.x} y={b.y} width="190" height="70" rx="8" strokeOpacity="0.45" fill="currentColor" fillOpacity="0.03" />
          <g transform={`translate(${b.x + 34} ${b.y + 35})`} strokeOpacity="0.8" className="text-accent">
            <path d={CHANNEL_GLYPHS[i]} stroke="currentColor" />
          </g>
          <text x={b.x + 62} y={b.y + 41} fontSize="16" fill="currentColor" stroke="none" fillOpacity="0.9">
            {b.text}
          </text>
        </g>
      ))}

      {/* the knowledge base */}
      <g className="text-accent">
        <rect x="295" y="140" width="230" height="112" rx="12" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeOpacity="0.6" />
        <rect x="345" y="127" width="130" height="26" rx="13" fill="currentColor" fillOpacity="0.9" stroke="none" />
        <text x="410" y="145" textAnchor="middle" fontSize="12" fontFamily="monospace" className="fill-background" stroke="none">
          {labels.protocol}
        </text>
      </g>
      <text x="410" y="196" textAnchor="middle" fontSize="19" fill="currentColor" stroke="none">
        {labels.core}
      </text>
      <text x="410" y="222" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fillOpacity="0.65">
        {labels.coreSub}
      </text>

      {/* traffic legend */}
      <g fontSize="11" fontFamily="monospace" fill="currentColor" stroke="none" fillOpacity="0.55">
        <text x="240" y="176" textAnchor="end">
          {labels.query}
        </text>
        <text x="580" y="176">
          {labels.answer}
        </text>
      </g>

      {/* storage substrates */}
      {labels.stores.map((store, i) => {
        const x = 180 + i * 155;
        return (
          <g key={store}>
            <rect x={x} y="348" width="150" height="50" rx="10" strokeOpacity="0.4" fill="currentColor" fillOpacity="0.03" />
            <g transform={`translate(${x + 28} 373)`} className="text-accent" strokeOpacity="0.9">
              {STORE_GLYPHS[i]}
            </g>
            <text x={x + 52} y="379" fontSize="14" fill="currentColor" stroke="none" fillOpacity="0.8">
              {store}
            </text>
          </g>
        );
      })}
      <text x="410" y="418" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="currentColor" stroke="none" fillOpacity="0.45">
        {labels.storesCaption}
      </text>
    </svg>
  );
}

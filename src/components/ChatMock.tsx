'use client';

import { cn } from '@doctiling/ui/cn';

// A static chat transcript as the end user sees it: the person's bubble, the
// tools the agent ran, the agent's answer with block citations and, when it
// wrote something, the action it left behind. HeroChatDemo animates the same
// shapes; this one renders at rest (verticals, differentiator).
export type ChatLine =
  | { kind: 'u' | 't' | 'x'; text: string }
  | { kind: 'a'; text: string; cites?: readonly string[] };

export function ChatMock({ lines, className, label }: { lines: readonly ChatLine[]; className?: string; label?: string }) {
  return (
    <div className={cn('flex flex-col gap-2.5 rounded-xl border border-border bg-background p-3 sm:p-4', className)} aria-label={label}>
      {lines.map((line, i) => {
        if (line.kind === 'u') {
          return (
            <p key={i} className="max-w-[92%] self-end rounded-2xl rounded-br-md bg-accent px-3.5 py-2.5 text-sm leading-snug text-accent-foreground">
              {line.text}
            </p>
          );
        }
        if (line.kind === 't') {
          return (
            <p key={i} className="max-w-full overflow-x-auto whitespace-nowrap rounded-lg bg-secondary/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {line.text}
            </p>
          );
        }
        if (line.kind === 'x') {
          return (
            <p key={i} className="self-start rounded-md border border-dashed border-emerald-600/70 px-2.5 py-1.5 font-mono text-[11px] text-emerald-700">
              {line.text}
            </p>
          );
        }
        const cites = line.kind === 'a' ? line.cites : undefined;
        return (
          <div key={i} className="max-w-[92%] self-start rounded-2xl rounded-bl-md bg-secondary/60 px-3.5 py-2.5 text-sm leading-relaxed">
            {line.text}
            {cites?.map((c) => (
              <span key={c} className="mx-0.5 inline-block rounded border border-primary/60 bg-card px-1 align-middle font-mono text-[10px] text-primary">
                {c}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { cn } from '@doctiling/ui/cn';
import { useInView } from '@doctiling/ui/hooks/use-in-view';

// The reveal behaviour is generic (design system); the `landing-reveal`
// transition is app CSS (globals.css), so the styled wrapper stays here.
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn('landing-reveal', inView && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

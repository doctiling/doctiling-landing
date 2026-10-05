import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';
import { Reveal } from '../../src/components/Reveal';

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let lastCallback: IOCallback | null = null;
const observe = vi.fn();
const disconnect = vi.fn();

class IOStub {
  constructor(cb: IOCallback) {
    lastCallback = cb;
  }
  observe = observe;
  disconnect = disconnect;
  unobserve = vi.fn();
}

const originalIO = globalThis.IntersectionObserver;

beforeEach(() => {
  lastCallback = null;
  observe.mockClear();
  disconnect.mockClear();
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IOStub;
});

afterEach(() => {
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = originalIO;
});

describe('Reveal', () => {
  it('starts hidden, observes the element, and reveals on intersection', () => {
    renderWithHost(
      <Reveal>
        <span>content</span>
      </Reveal>,
    );
    const el = screen.getByText('content').parentElement as HTMLElement;
    expect(el).toHaveClass('landing-reveal');
    expect(el).not.toHaveClass('is-visible');
    expect(observe).toHaveBeenCalledTimes(1);

    act(() => {
      lastCallback?.([{ isIntersecting: true }]);
    });
    expect(el).toHaveClass('is-visible');
    expect(disconnect).toHaveBeenCalled();
  });

  it('stays hidden while the element is not intersecting', () => {
    renderWithHost(
      <Reveal>
        <span>c2</span>
      </Reveal>,
    );
    act(() => {
      lastCallback?.([{ isIntersecting: false }]);
    });
    const el = screen.getByText('c2').parentElement as HTMLElement;
    expect(el).not.toHaveClass('is-visible');
  });

  it('applies a transition delay style when delay is set', () => {
    renderWithHost(
      <Reveal delay={120} className="extra">
        <span>c3</span>
      </Reveal>,
    );
    const el = screen.getByText('c3').parentElement as HTMLElement;
    expect(el).toHaveClass('extra');
    expect(el.style.transitionDelay).toBe('120ms');
  });

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      undefined;
    renderWithHost(
      <Reveal>
        <span>c4</span>
      </Reveal>,
    );
    const el = screen.getByText('c4').parentElement as HTMLElement;
    expect(el).toHaveClass('is-visible');
  });
});

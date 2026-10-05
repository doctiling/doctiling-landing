import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithHost } from '../helpers/host';
import userEvent from '@testing-library/user-event';


import { StickyCta } from '../../src/components/StickyCta';

let ioCallback: IntersectionObserverCallback | null = null;
class IntersectionObserverMock {
  constructor(cb: IntersectionObserverCallback) {
    ioCallback = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

function intersectFooter(isIntersecting: boolean) {
  act(() => {
    ioCallback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

function scrollTo(y: number) {
  act(() => {
    window.scrollY = y;
    window.dispatchEvent(new Event('scroll'));
  });
}

beforeEach(() => {
  window.scrollY = 0;
});

afterEach(() => {
  window.scrollY = 0;
});

describe('StickyCta', () => {
  it('stays hidden while the hero is still on screen', () => {
    renderWithHost(<StickyCta href="#demo" />);
    expect(screen.queryByRole('link', { name: /landing\.hero\.ctaPrimary/ })).not.toBeInTheDocument();
  });

  it('appears once the visitor has scrolled past the hero', () => {
    renderWithHost(<StickyCta href="#demo" />);
    scrollTo(1200);
    expect(screen.getByRole('link', { name: /landing\.hero\.ctaPrimary/ })).toHaveAttribute(
      'href',
      '#demo',
    );
  });

  it('hides again when the visitor scrolls back up to the hero', () => {
    renderWithHost(<StickyCta href="#demo" />);
    scrollTo(1200);
    scrollTo(100);
    expect(screen.queryByRole('link', { name: /landing\.hero\.ctaPrimary/ })).not.toBeInTheDocument();
  });

  it('stays dismissed for the rest of the visit once closed', async () => {
    const user = userEvent.setup();
    renderWithHost(<StickyCta href="#demo" />);
    scrollTo(1200);

    await user.click(screen.getByRole('button', { name: /landing\.sticky\.dismiss/ }));
    expect(screen.queryByRole('link', { name: /landing\.hero\.ctaPrimary/ })).not.toBeInTheDocument();

    scrollTo(2400);
    expect(screen.queryByRole('link', { name: /landing\.hero\.ctaPrimary/ })).not.toBeInTheDocument();
  });

  it('hides once the footer scrolls into view, to stop covering it', () => {
    renderWithHost(
      <>
        <div id="site-footer" />
        <StickyCta href="#demo" />
      </>,
    );
    scrollTo(1200);
    expect(screen.getByRole('link', { name: /landing\.hero\.ctaPrimary/ })).toBeInTheDocument();

    intersectFooter(true);
    expect(screen.queryByRole('link', { name: /landing\.hero\.ctaPrimary/ })).not.toBeInTheDocument();
  });

  it('reappears if the visitor scrolls back up away from the footer', () => {
    renderWithHost(
      <>
        <div id="site-footer" />
        <StickyCta href="#demo" />
      </>,
    );
    scrollTo(1200);
    intersectFooter(true);
    intersectFooter(false);
    expect(screen.getByRole('link', { name: /landing\.hero\.ctaPrimary/ })).toBeInTheDocument();
  });
});

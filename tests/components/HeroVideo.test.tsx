import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithHost } from '../helpers/host';
import { HeroVideo } from '../../src/components/HeroVideo';

describe('HeroVideo', () => {
  it('shows a local poster and loads nothing from YouTube before play', () => {
    const { container } = renderWithHost(<HeroVideo videoId="-i3DmNClIZE" poster="/landing/video/hero-short.webp" />);
    expect(container.querySelector('iframe')).toBeNull();
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/landing/video/hero-short.webp');
    expect(screen.getByRole('button', { name: 'landing.hero.videoPlay' })).toBeInTheDocument();
  });

  it('swaps in the privacy-enhanced embed, autoplaying, on click', async () => {
    const { container } = renderWithHost(<HeroVideo videoId="-i3DmNClIZE" poster="/landing/video/hero-short.webp" />);
    await userEvent.click(screen.getByRole('button', { name: 'landing.hero.videoPlay' }));
    const frame = container.querySelector('iframe');
    expect(frame).toHaveAttribute(
      'src',
      expect.stringMatching(/^https:\/\/www\.youtube-nocookie\.com\/embed\/-i3DmNClIZE\?.*autoplay=1/),
    );
    expect(frame).toHaveAttribute('title', 'landing.hero.videoTitle');
    expect(screen.queryByRole('button', { name: 'landing.hero.videoPlay' })).toBeNull();
  });
});

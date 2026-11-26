/**
 * Doctiling's public brand profiles. One list feeds the footer links and the
 * schema.org `sameAs` (./seo), so a new channel is added in one place.
 * Only real, live profiles go here. Kept apart from ./seo so the client
 * footer does not pull the SEO module into its bundle.
 */
export interface SocialProfile {
  readonly label: string;
  readonly url: string;
}

export const SOCIAL_PROFILES: readonly SocialProfile[] = [
  { label: 'YouTube', url: 'https://www.youtube.com/@doctiling' },
  { label: 'X', url: 'https://x.com/doctiling' },
  { label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61597137983933' },
];

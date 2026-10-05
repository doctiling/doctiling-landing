import en from './en.json';
import es from './es.json';

export type Messages = { [key: string]: string | Messages };
export type TranslateFn = (key: string, values?: Record<string, unknown>) => string;

export const LANDING_LOCALES = ['en', 'es'] as const;
export type LandingLocale = (typeof LANDING_LOCALES)[number];

export const LANDING_MESSAGES: Record<LandingLocale, Messages> = { en, es };

/** Any unknown locale falls back to Spanish, the landing's default language. */
export function toLandingLocale(locale: string | undefined): LandingLocale {
  return locale === 'en' ? 'en' : 'es';
}

export function landingMessages(locale: string | undefined): Messages {
  return LANDING_MESSAGES[toLandingLocale(locale)];
}

function lookup(messages: Messages, path: string): string {
  let node: string | Messages | undefined = messages;
  for (const key of path.split('.')) {
    node = typeof node === 'object' && node !== null ? node[key] : undefined;
    if (node === undefined) return path;
  }
  return typeof node === 'string' ? node : path;
}

/** Dictionary lookup with `{var}` interpolation; a missing key renders as the key itself. */
export function translate(messages: Messages, key: string, values?: Record<string, unknown>): string {
  const message = lookup(messages, key);
  if (!values) return message;
  return message.replace(/{(\w+)}/g, (match, name) =>
    values[name] !== undefined ? String(values[name]) : match,
  );
}

export { en as landingEn, es as landingEs };

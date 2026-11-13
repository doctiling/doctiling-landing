// Shared by the client FAQ section and the server-rendered FAQPage JSON-LD —
// must stay outside any 'use client' module so the server sees a real array.
export const FAQ_KEYS = [
  'what',
  'dms',
  'grounded',
  'rag',
  'privacy',
  'free',
  'pricing',
  'queries',
  'billing',
  'mcp',
  'langs',
] as const;

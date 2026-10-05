// The one expression that decides whether copy names the AI vendor. Shared by
// the white-label guard (product surface) and the CSF profile guard (security
// docs a customer reads) so the two can never drift apart.
export const VENDOR = /\b(anthropic|claude|sonnet|haiku|opus)\b/i;

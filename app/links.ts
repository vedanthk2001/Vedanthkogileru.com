/**
 * Outbound links used in more than one place. Kept here so a URL never drifts
 * between components.
 */
export const LINKS = {
  /** Teenvesting YouTube channel. Empty string renders the name as plain text
   *  instead of a dead link, so this is safe to blank out. */
  teenvesting: 'https://www.youtube.com/@Teenvesting',
  linkedin: 'https://linkedin.com/in/vedanth-kogileru',
  github: 'https://github.com/vedanthk2001',
} as const

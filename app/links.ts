/**
 * Outbound links used in more than one place. Kept here so a URL never drifts
 * between components.
 */
export const LINKS = {
  /** Teenvesting YouTube channel. Empty until confirmed — an empty string makes
   *  the components render the name as plain text rather than a dead link. */
  teenvesting: '',
  linkedin: 'https://linkedin.com/in/vedanth-kogileru',
  github: 'https://github.com/vedanthk2001',
} as const

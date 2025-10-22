/**
 * Game configuration constants
 */
export const DEFAULT_CONFIG = {
  duration: 1000,
  cardSelector: '.js-cards',
  shuffleDelay: 400,
};

export const SELECTORS = {
  cardsContainer: '.js-cards',
  card: '.game__card',
};

export const CSS_CLASSES = {
  flipped: 'flipped',
  matched: 'has-match',
  noEvent: 'no-event',
  srOnly: 'sr-only',
};

export const ARIA = {
  role: {
    button: 'button',
    status: 'status',
  },
  live: {
    polite: 'polite',
  },
};

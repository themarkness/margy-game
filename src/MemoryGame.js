import { DEFAULT_CONFIG, CSS_CLASSES, ARIA } from './config.js';

/**
 * MemoryGame class - Handles the memory matching game logic
 */
export class MemoryGame {
  /**
   * @param {Object} config - Configuration options
   * @param {number} config.duration - Animation duration in ms
   * @param {string} config.cardSelector - CSS selector for cards container
   * @param {number} config.shuffleDelay - Delay before shuffle animation
   */
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize game state
    this.gameState = {
      moves: 0,
      matches: 0,
      isProcessing: false,
    };

    // Initialize DOM elements with error handling
    this.cardsContainer = document.querySelector(this.config.cardSelector);

    if (!this.cardsContainer) {
      throw new Error(
        `Cards container not found with selector: ${this.config.cardSelector}`
      );
    }

    this.cards = Array.from(this.cardsContainer.children);

    if (this.cards.length === 0) {
      throw new Error('No cards found in the container');
    }

    this.init();
  }

  /**
   * Initialize the game - set up event listeners
   */
  init() {
    // Use event delegation for better performance
    this.cardsContainer.addEventListener('click', (event) => {
      const card = event.target.closest('.game__card');

      if (card && this.canFlipCard(card)) {
        this.flip(card);
      }
    });

    // Add keyboard support for accessibility
    this.cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', ARIA.role.button);
      card.setAttribute('aria-label', `Card ${index + 1}`);

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (this.canFlipCard(card)) {
            this.flip(card);
          }
        }
      });
    });
  }

  /**
   * Check if a card can be flipped
   * @param {HTMLElement} card - The card element
   * @returns {boolean}
   */
  canFlipCard(card) {
    return (
      !card.classList.contains(CSS_CLASSES.flipped) &&
      !card.classList.contains(CSS_CLASSES.matched) &&
      !this.gameState.isProcessing
    );
  }

  /**
   * Shuffle all cards and reset the game
   */
  shuffleCards() {
    this.cards.forEach((card) => {
      const randomNumber = Math.floor(Math.random() * this.cards.length) + 1;

      card.classList.remove(CSS_CLASSES.matched);
      card.setAttribute('aria-label', `Card ${randomNumber}`);

      setTimeout(() => {
        card.style.order = `${randomNumber}`;
      }, this.config.shuffleDelay);
    });

    // Reset game state
    this.gameState.moves = 0;
    this.gameState.matches = 0;

    this.announceToScreenReader('Cards shuffled! New game started.');
  }

  /**
   * Check if all cards have been matched
   */
  checkAllCards() {
    if (!this.cards.every((card) => card.classList.contains(CSS_CLASSES.matched))) {
      return;
    }

    this.announceToScreenReader(
      `Congratulations! All cards matched in ${this.gameState.moves} moves!`
    );

    setTimeout(() => {
      this.shuffleCards();
    }, this.config.duration);
  }

  /**
   * Temporarily disable card interactions
   */
  stopEvent() {
    this.gameState.isProcessing = true;
    this.cardsContainer.classList.add(CSS_CLASSES.noEvent);

    setTimeout(() => {
      this.cardsContainer.classList.remove(CSS_CLASSES.noEvent);
      this.gameState.isProcessing = false;
    }, this.config.duration);
  }

  /**
   * Check if two cards match
   * @param {HTMLElement} firstCard - First card to compare
   * @param {HTMLElement} secondCard - Second card to compare
   */
  checkIfMatched(firstCard, secondCard) {
    const firstAnimal = firstCard.dataset.animal;
    const secondAnimal = secondCard.dataset.animal;

    if (firstAnimal === secondAnimal) {
      firstCard.classList.remove(CSS_CLASSES.flipped);
      secondCard.classList.remove(CSS_CLASSES.flipped);

      firstCard.classList.add(CSS_CLASSES.matched);
      secondCard.classList.add(CSS_CLASSES.matched);

      firstCard.setAttribute('aria-label', `Card matched: ${firstAnimal}`);
      secondCard.setAttribute('aria-label', `Card matched: ${secondAnimal}`);

      this.gameState.matches++;
      this.announceToScreenReader(`Match found! ${this.gameState.matches} matches so far.`);

      this.checkAllCards();
    } else {
      this.announceToScreenReader('No match. Cards will flip back.');

      setTimeout(() => {
        firstCard.classList.remove(CSS_CLASSES.flipped);
        secondCard.classList.remove(CSS_CLASSES.flipped);
      }, this.config.duration);
    }
  }

  /**
   * Flip a card
   * @param {HTMLElement} selectedCard - The card to flip
   */
  flip(selectedCard) {
    selectedCard.classList.add(CSS_CLASSES.flipped);
    this.gameState.moves++;

    const flippedCards = this.cards.filter((card) =>
      card.classList.contains(CSS_CLASSES.flipped)
    );

    if (flippedCards.length === 2) {
      this.stopEvent();
      this.checkIfMatched(flippedCards[0], flippedCards[1]);
    }
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', ARIA.role.status);
    announcement.setAttribute('aria-live', ARIA.live.polite);
    announcement.className = CSS_CLASSES.srOnly;
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Get current game statistics
   * @returns {Object} Game statistics
   */
  getStats() {
    return {
      moves: this.gameState.moves,
      matches: this.gameState.matches,
      totalPairs: this.cards.length / 2,
      isComplete: this.cards.every((card) => card.classList.contains(CSS_CLASSES.matched)),
    };
  }

  /**
   * Reset the game
   */
  reset() {
    this.shuffleCards();
  }
}

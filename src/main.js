import { MemoryGame } from './MemoryGame.js';

/**
 * Initialize the memory game
 */
function initGame() {
  try {
    const game = new MemoryGame();

    // Expose game instance for debugging in development
    if (import.meta.env.DEV) {
      window.memoryGame = game;
      console.log('Memory game initialized. Access via window.memoryGame');
    }

    return game;
  } catch (error) {
    console.error('Failed to initialize game:', error);
    alert('Failed to start the game. Please refresh the page.');
    throw error;
  }
}

// Initialize the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

export { initGame };

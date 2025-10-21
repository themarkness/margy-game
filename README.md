# Margy Matching Memory Game

A vanilla JavaScript memory card matching game with modern tooling and accessibility features.

## Features

- Pure vanilla JavaScript (no frameworks)
- ES6 modules architecture
- Full keyboard accessibility
- Screen reader support
- Responsive design
- CSS custom properties for easy theming
- Modern development tools (Vite, ESLint, Prettier)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Available Scripts

- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint JavaScript files
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted

### Project Structure

```
margy-game/
├── src/
│   ├── config.js         # Game configuration and constants
│   ├── MemoryGame.js     # Main game class
│   └── main.js           # Application entry point
├── images/               # Game images and assets
├── index.html            # Main game page
├── page-2.html           # Second game variation
├── style.css             # Styles with CSS custom properties
├── vite.config.js        # Vite configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
└── package.json          # Project dependencies
```

## Code Quality

### Linting

The project uses ESLint with recommended rules:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Formatting

Code formatting is handled by Prettier:

```bash
npm run format       # Format all files
npm run format:check # Check formatting
```

## Accessibility

The game includes comprehensive accessibility features:

- **Keyboard Navigation**: Use Tab to navigate, Enter/Space to flip cards
- **ARIA Labels**: Screen reader announcements for game state
- **Focus Indicators**: Clear visual focus states
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Customization

### Theming

The game uses CSS custom properties for easy theming. Edit `:root` in `style.css`:

```css
:root {
  --color-primary: #2f7b02;  /* Card background color */
  --color-bg: #ffffff;        /* Background color */
  --card-columns: 5;          /* Number of columns */
  --transition-duration: 400ms; /* Animation speed */
}
```

### Game Configuration

Customize game behavior in `src/config.js` or pass options to the constructor:

```javascript
const game = new MemoryGame({
  duration: 1000,      // Time before cards flip back
  shuffleDelay: 400,   // Delay for shuffle animation
});
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 modules support required
- CSS Grid and Custom Properties support required

## License

See [license.txt](license.txt)

## Credits

Original concept: [CodePen](https://codepen.io/jstarnate/pen/QoagLr)
Refactored with modern JavaScript practices and accessibility improvements.

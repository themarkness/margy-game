# Mobile Tap Bug Investigation

## Issue
Cards don't flip on mobile tap (Chrome) after page refresh.

## Root Cause Analysis

### 1. Event Delegation Issue
**Current code (src/MemoryGame.js:46-52):**
```javascript
this.cardsContainer.addEventListener('click', (event) => {
  const card = event.target.closest('.game__card');

  if (card && this.canFlipCard(card)) {
    this.flip(card);
  }
});
```

**Problem:**
- On mobile, `event.target` when tapping might be:
  - The `<svg>` element inside `.game__back-card`
  - The `<path>` elements inside the SVG
  - The `<img>` element inside `.game__front-card`
- The `closest('.game__card')` should work in theory, BUT...

### 2. Potential Issues

#### A. SVG Touch Events
SVGs can sometimes interfere with touch events on mobile. The event might not bubble correctly through the SVG elements.

#### B. CSS pointer-events
The CSS has:
```css
.game__card.flipped,
.game__card.has-match {
  pointer-events: none;
}
```
This is correct for flipped cards, but shouldn't affect unflipped cards.

#### C. Touch vs Click Events
Mobile browsers fire touch events first (`touchstart`, `touchend`), then synthesize click events. However:
- If a touch event is cancelled or prevented, click won't fire
- Fast taps might not always trigger click events reliably
- Some browsers have a 300ms delay on click events (mostly fixed now)

#### D. Event Target Specificity
When tapping on mobile:
1. User taps on the card
2. Touch hits the SVG path or image
3. Event bubbles up: `path` → `svg` → `div.game__back-card` → `div.game__card`
4. The `event.target` is the deepest element (path/svg/img)
5. `closest('.game__card')` should find the parent card

### 3. Comparison with Original Code

**Original code had individual listeners:**
```javascript
game.cards.forEach(card => {
  card.addEventListener('click', game.flip.bind(game, card));
});
```

**Key difference:**
- Original: Direct listener on each `.game__card` element
- Refactored: Event delegation on `.game__cards` container

**Why this matters:**
- Direct listeners on the card element guarantee the listener fires when the card or any child is clicked
- Event delegation relies on event bubbling, which can be interrupted

### 4. Hypothesis

The most likely cause is that on mobile Chrome, the touch event handling is interfering with event bubbling. Specifically:

1. **SVG elements might be blocking event propagation** on touch
2. The browser might not properly synthesize click events from touches on SVG children
3. The `closest()` method might not work correctly in mobile Chrome when the target is an SVG child element

## Proposed Solutions

### Solution 1: Add Touch Event Handlers (Recommended)
Add explicit touch event handlers alongside click events:

```javascript
const handleCardInteraction = (event) => {
  const card = event.target.closest('.game__card');
  if (card && this.canFlipCard(card)) {
    event.preventDefault(); // Prevent double-firing
    this.flip(card);
  }
};

this.cardsContainer.addEventListener('click', handleCardInteraction);
this.cardsContainer.addEventListener('touchend', handleCardInteraction);
```

### Solution 2: Add pointer-events CSS
Add to SVG elements to make them "transparent" to pointer events:

```css
.game__back-card svg,
.game__front-card img {
  pointer-events: none;
}
```

This ensures touches pass through to the parent card element.

### Solution 3: Use Individual Listeners (Fallback)
Revert to the original approach of adding listeners directly to each card:

```javascript
this.cards.forEach((card) => {
  card.addEventListener('click', () => {
    if (this.canFlipCard(card)) {
      this.flip(card);
    }
  });
});
```

### Solution 4: Combination Approach (Best)
Combine Solutions 1 and 2:
1. Add CSS to make SVG/images transparent to pointer events
2. Add touch event handlers for better mobile support
3. Keep event delegation for better performance

## Testing Checklist
- [ ] Test on iOS Safari
- [ ] Test on Chrome Mobile (Android)
- [ ] Test on Chrome Mobile (iOS)
- [ ] Test on Firefox Mobile
- [ ] Test desktop still works
- [ ] Test with touch screen laptop
- [ ] Verify no double-firing of events
- [ ] Check console for errors

## Next Steps
1. Implement Solution 4 (combination approach)
2. Test on actual mobile device
3. Verify fix works
4. Commit and push

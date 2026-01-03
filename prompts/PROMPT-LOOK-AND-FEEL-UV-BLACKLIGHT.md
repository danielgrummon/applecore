# Oogie Boogie's Lair - Design System Prompt

## Overview
This design system defines the visual language for applications inspired by Oogie Boogie's lair aesthetic. It encompasses two complementary arcade styles that should be used to ensure consistent look and feel across all new applications:

1. **SPIDER GAMEZ** - UV blacklight theme inspired by Oogie Boogie's lair from The Nightmare Before Christmas
2. **Flash Owls** - Retro arcade/neon inspired by 1980s-90s arcade games

Both aesthetics share common principles: dark backgrounds, glowing effects, monospace typography, and arcade game styling with modern web capabilities.

---

# SPIDER GAMEZ - UV Blacklight Theme

## UV Blacklight Color Palette

### Oogie Boogie UV Colors
Use these UV blacklight-reactive colors for the shadowy, eerie atmosphere:

```css
--oogie-black: #0a0a0a;
--oogie-purple: #9D00FF;
--oogie-dark-purple: #6B00B3;
--oogie-violet: #BF00FF;
--oogie-blue: #00F0FF;
--oogie-electric-blue: #0080FF;
--oogie-green: #00FF41;
--oogie-lime: #7FFF00;
--oogie-red: #FF0055;
--oogie-pink: #FF00AA;
--oogie-gold: #FFD700;
--oogie-orange: #FF6600;
```

### Night Scene Colors
For darker, atmospheric game elements (like the hopper game):

- **Dark Grass**: `#003300` - Very dark green for ground
- **Lily Pads**: `#006600` - Lighter green than grass
- **Dark Water**: `#004080` - Deep UV blue
- **Dark Brown**: `#3d2817` - For logs and wood elements
- **Dark Turtles**: `#2d5a3d` - Muted green
- **Dark Alligators**: `#1a4d2e` - Deeper dark green
- **Dark Lime**: `#4d9900` - Muted lime for player characters
- **Snake Body**: `#8b4513` - Dark saddle brown
- **Snake Head**: `#8b0000` - Dark red
- **Dark Purple Road**: `#1a0a2e` - For roads and paths

### UV Background Pattern
Deep purple radiating to black:

```css
background: radial-gradient(ellipse at center, #1a0033 0%, #000000 100%);
```

### UV Blacklight Overlay Effect
Creates the signature UV glow atmosphere:

```css
.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(157, 0, 255, 0.08) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 70% 80%,
    rgba(0, 240, 255, 0.06) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 50% 50%,
    rgba(0, 255, 65, 0.04) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 1;
  animation: uvPulse 8s ease-in-out infinite;
}

@keyframes uvPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## SPIDER GAMEZ Typography

### Font Family
**Monospace Only**: `'Courier New', monospace`
- Consistent with arcade aesthetic across all text

### Font Size Scale (SPIDER GAMEZ)
- **Arcade Title**: 64px (main landing "SPIDER GAMEZ")
- **Game Titles**: 48px
- **Game Buttons**: 24px
- **Button Labels**: 16-18px
- **Stats Labels**: 18px
- **Stats Values**: 32px
- **Credits/Footer**: 12-16px

### Letter Spacing
- **Arcade Title**: 12px
- **Game Buttons**: 2px
- **Button Labels**: 1px
- **Footer Text**: 3px

### Text Shadow - UV Glow
Multi-layer text shadows for blacklight effect:

```css
text-shadow:
  0 0 10px currentColor,
  0 0 20px currentColor;
```

For intense title glow:
```css
text-shadow:
  0 0 20px var(--oogie-purple),
  0 0 40px var(--oogie-violet),
  0 0 60px var(--oogie-blue),
  0 0 80px var(--oogie-green),
  0 0 100px var(--oogie-purple);
```

---

## SPIDER GAMEZ Button Styles

### Game Selection Buttons
Dark semi-transparent with UV purple borders:

```css
background: rgba(10, 10, 10, 0.8);
color: var(--oogie-green);
border: 3px solid var(--oogie-purple);
border-radius: 10px;
padding: 1.5rem 3rem;
font-size: 24px;
font-weight: bold;
font-family: 'Courier New', monospace;
letter-spacing: 2px;
box-shadow:
  0 0 20px var(--oogie-purple),
  0 0 30px var(--oogie-violet),
  inset 0 0 15px rgba(157, 0, 255, 0.2);
transition: all 0.3s ease;
```

### Button Hover State
Transform to UV blue glow:

```css
transform: scale(1.05);
background: rgba(20, 0, 40, 0.9);
border-color: var(--oogie-blue);
color: var(--oogie-blue);
box-shadow:
  0 0 30px var(--oogie-blue),
  0 0 50px var(--oogie-electric-blue),
  0 0 70px var(--oogie-purple),
  inset 0 0 25px rgba(0, 240, 255, 0.3);
```

### Button Active State
```css
transform: scale(0.95);
```

### Exit/Control Buttons
Smaller utility buttons for game controls:

```css
background: rgba(10, 10, 10, 0.8);
color: var(--oogie-green);
border: 2px solid var(--oogie-purple);
border-radius: 5px;
padding: 10px;
font-size: 16px;
font-weight: bold;
letter-spacing: 1px;
box-shadow:
  0 0 10px var(--oogie-purple),
  inset 0 0 10px rgba(157, 0, 255, 0.2);
```

---

## SPIDER GAMEZ Special Effects

### Blacklight Glow Animation
Cycles through UV color spectrum:

```css
@keyframes blacklightGlow {
  0% {
    color: var(--oogie-violet);
    text-shadow:
      0 0 20px var(--oogie-purple),
      0 0 40px var(--oogie-violet),
      0 0 60px var(--oogie-blue),
      0 0 80px var(--oogie-green),
      0 0 100px var(--oogie-purple);
  }
  25% {
    color: var(--oogie-blue);
    text-shadow:
      0 0 20px var(--oogie-blue),
      0 0 40px var(--oogie-electric-blue),
      0 0 60px var(--oogie-green),
      0 0 80px var(--oogie-purple),
      0 0 100px var(--oogie-blue);
  }
  50% {
    color: var(--oogie-green);
    text-shadow:
      0 0 20px var(--oogie-green),
      0 0 40px var(--oogie-lime),
      0 0 60px var(--oogie-blue),
      0 0 80px var(--oogie-pink),
      0 0 100px var(--oogie-green);
  }
  75% {
    color: var(--oogie-pink);
    text-shadow:
      0 0 20px var(--oogie-red),
      0 0 40px var(--oogie-pink),
      0 0 60px var(--oogie-purple),
      0 0 80px var(--oogie-blue),
      0 0 100px var(--oogie-pink);
  }
  100% {
    color: var(--oogie-violet);
    text-shadow:
      0 0 20px var(--oogie-purple),
      0 0 40px var(--oogie-violet),
      0 0 60px var(--oogie-blue),
      0 0 80px var(--oogie-green),
      0 0 100px var(--oogie-purple);
  }
}

/* Apply to title */
animation: blacklightGlow 4s ease-in-out infinite;
```

### Rainbow Glow (Footer Text)
Simpler 3-color cycle:

```css
@keyframes rainbowGlow {
  0% {
    color: var(--oogie-purple);
    text-shadow: 0 0 15px var(--oogie-purple), 0 0 30px var(--oogie-violet);
  }
  33% {
    color: var(--oogie-blue);
    text-shadow: 0 0 15px var(--oogie-blue), 0 0 30px var(--oogie-electric-blue);
  }
  66% {
    color: var(--oogie-green);
    text-shadow: 0 0 15px var(--oogie-green), 0 0 30px var(--oogie-lime);
  }
  100% {
    color: var(--oogie-purple);
    text-shadow: 0 0 15px var(--oogie-purple), 0 0 30px var(--oogie-violet);
  }
}

animation: rainbowGlow 3s infinite;
```

### Spider Swing Animation
For decorative spider emojis:

```css
.spider {
  position: absolute;
  font-size: 48px;
  filter: drop-shadow(0 0 8px var(--oogie-purple))
          drop-shadow(0 0 15px var(--oogie-violet));
  animation: spiderSwing 4s ease-in-out infinite;
}

@keyframes spiderSwing {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(20px) rotate(5deg);
  }
}
```

### UV Drop Shadow for Icons
For emoji icons and game elements:

```css
filter: drop-shadow(0 0 10px var(--oogie-purple))
        drop-shadow(0 0 20px var(--oogie-violet));
```

Hover state:
```css
filter: drop-shadow(0 0 15px var(--oogie-blue))
        drop-shadow(0 0 25px var(--oogie-electric-blue));
```

---

## SPIDER GAMEZ Game Element Styling

### Sidebar/Stats Panel
```css
background: rgba(10, 10, 10, 0.8);
border-right: 2px solid var(--oogie-purple);
padding: 2rem 1rem;
box-shadow: 2px 0 20px rgba(157, 0, 255, 0.3);
```

### Stat Labels
```css
color: var(--oogie-lime);
font-size: 18px;
font-weight: bold;
font-family: 'Courier New', monospace;
letter-spacing: 2px;
text-shadow: 0 0 10px var(--oogie-lime);
```

### Stat Values
```css
color: var(--oogie-violet);
font-size: 32px;
font-weight: bold;
font-family: 'Courier New', monospace;
text-shadow:
  0 0 10px var(--oogie-purple),
  0 0 20px var(--oogie-violet);
```

### Canvas Game Elements
For HTML5 Canvas games, avoid blur effects for clarity:

```javascript
// AVOID shadowBlur in canvas - causes blurriness
ctx.shadowBlur = 0; // Keep at 0

// Use solid UV colors instead
ctx.fillStyle = '#9D00FF'; // UV Purple
ctx.fillStyle = '#00FF41'; // UV Green
ctx.fillStyle = '#00F0FF'; // UV Blue
ctx.fillStyle = '#FF0055'; // UV Red
ctx.fillStyle = '#FF00AA'; // UV Pink
ctx.fillStyle = '#FFD700'; // Gold
ctx.fillStyle = '#FF6600'; // Orange
```

---

## SPIDER GAMEZ Design Principles

1. **UV Blacklight Aesthetic**: Colors that appear to glow under blacklight
2. **Dark Lair Atmosphere**: Deep purple/black backgrounds with subtle UV overlay
3. **No Canvas Blur**: Avoid shadowBlur on canvas elements for crisp visuals
4. **Night Scene Variants**: Use darker, muted versions of UV colors for atmospheric scenes
5. **Spider Theme**: Incorporate spider web motifs and swinging spider decorations
6. **Purple-to-Blue Transitions**: Hover states shift from purple to blue
7. **Green Primary Actions**: Use UV green for primary text and player elements
8. **Multi-Layer Shadows**: Stack box-shadows and text-shadows for depth
9. **Pulsing Overlays**: Subtle breathing animations for UV glow effects
10. **Monospace Consistency**: Courier New throughout for arcade authenticity

---

# Flash Owls - Retro Neon Arcade Theme

## Color Palette

### Primary Neon Accent Colors
Use these vibrant neon colors for interactive elements, borders, and glowing effects:

- **Magenta/Pink**: `#ff00ff` - Primary accent color for borders, glows, and emphasis
- **Cyan/Aqua**: `#00ffff` - Secondary accent for borders and informational text
- **Lime Green**: `#00ff00` - Success states, correct answers, positive feedback
- **Yellow**: `#ffff00` - Warnings, highlights, call-to-action elements
- **Orange**: `#ff6600` - Warm accent for labels and gradient transitions
- **Purple**: `#9933ff` - Configuration elements and decorative accents
- **Red**: `#ff0000` - Errors, wrong answers, critical warnings

### Background Colors
Create depth with dark, semi-transparent backgrounds:

- **Primary Background**: `radial-gradient(circle at center, #1a0033, #0d001a, #000000)`
  - Deep purple gradient radiating from center to black
- **Card Backgrounds**: `rgba(26, 0, 51, 0.9)`
  - Semi-transparent dark purple for depth and layering
- **Alternative Overlays**: `rgba(0, 0, 0, 0.5)`
  - Semi-transparent black for modals and overlays

### Theme Gradient Variations
Provide 8 theme options with dark gradients in different color families:

1. **Purple** (Default): `linear-gradient(135deg, #1a0033, #330066, #1a0033)`
2. **Maroon**: `linear-gradient(135deg, #330011, #660022, #330011)`
3. **Blue**: `linear-gradient(135deg, #001a33, #003366, #001a33)`
4. **Green**: `linear-gradient(135deg, #001a00, #003300, #001a00)`
5. **Brown/Orange**: `linear-gradient(135deg, #331100, #663300, #331100)`
6. **Dark Blue**: `linear-gradient(135deg, #0d1a33, #1a3366, #0d1a33)`
7. **Dark Magenta**: `linear-gradient(135deg, #33001a, #660033, #33001a)`
8. **Dark Red**: `linear-gradient(135deg, #1a0011, #330022, #1a0011)`

### Text Colors
- **Primary Text**: `#ffffff` (White) - All standard text
- **Success Text**: `#00ff00` (Green) - Success messages, correct indicators
- **Error Text**: `#ff00ff` (Magenta) - Error messages, emphasis
- **Warning Text**: `#ffff00` (Yellow) - Warnings, alerts
- **Info Text**: `#00ffff` (Cyan) - Informational content
- **Disabled Text**: `#666` or `#999` - Inactive elements

---

## Typography

### Font Family
**Monospace Only**: `'Courier New', monospace`
- Apply to ALL text elements for consistent retro arcade aesthetic

### Font Size Scale
- **Hero Title**: 72px (main landing titles)
- **Game Title**: 64px (page titles in games)
- **Completion Title**: 48px (end screens)
- **Large Stats**: 64px (prominent statistics)
- **Medium Stats**: 48px (header values)
- **Buttons**: 24px-32px (interactive elements)
- **Body Text**: 18-24px (paragraphs, descriptions)
- **Small Labels**: 14-16px (metadata, captions)

### Font Styling
- **Weight**: Bold for headings, buttons, stats; Normal for body text
- **Transform**: `text-transform: uppercase` for buttons, headings, labels
- **Letter Spacing**:
  - 12px for hero titles
  - 8px for game titles
  - 4px for buttons
  - 2-3px for labels and smaller headings

---

## Button Styles

### Primary Game Buttons
Large, glowing buttons with gradient backgrounds and multi-layer shadows:

```css
background: linear-gradient(135deg, #ff00ff 0%, #ff6600 50%, #ffff00 100%);
border: 4px solid #00ff00;
border-radius: 15px;
color: #000000;
font-size: 32px;
font-weight: bold;
text-transform: uppercase;
letter-spacing: 4px;
padding: 20px 40px;
box-shadow:
  0 0 20px rgba(255, 0, 255, 0.6),
  0 0 40px rgba(0, 255, 0, 0.4),
  inset 0 0 20px rgba(255, 255, 255, 0.2);
cursor: pointer;
transition: all 0.3s ease;
```

### Button Hover State
Enhance the glow, change gradient, scale up, and lift the button:

```css
background: linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #00ff00 100%);
border-color: #ff00ff;
transform: scale(1.08) translateY(-5px);
box-shadow:
  0 0 40px rgba(255, 0, 255, 1),
  0 0 60px rgba(0, 255, 255, 0.8),
  0 0 80px rgba(0, 255, 0, 0.6);
```

### Button Active/Press State
Slight scale and position adjustment for tactile feedback:

```css
transform: scale(1.02) translateY(-2px);
```

### Button Disabled State
Grayscale with reduced opacity:

```css
background: linear-gradient(135deg, #333 0%, #111 100%);
border-color: #666;
color: #666;
cursor: not-allowed;
opacity: 0.4;
```

### Submit/Action Button (Ready State)
Yellow gradient with green border and pulsing animation:

```css
background: linear-gradient(90deg, #ffff00, #ff6600);
border-color: #00ff00;
box-shadow: 0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 60px #ffff00;
animation: submitReady 1s infinite alternate;
```

### Button Variants

**Success Button ("Knew It")**:
```css
background: linear-gradient(135deg, #00ff00 0%, #00ffff 100%);
border: 4px solid #00ff00;
```

**Error Button ("Didn't Know")**:
```css
background: linear-gradient(135deg, #ff6600 0%, #ff00ff 100%);
border: 4px solid #ff00ff;
```

**Navigation Buttons**:
- Back: `background: rgba(255, 255, 0, 0.2)` with `border: 3px solid #ffff00`
- Previous: `background: rgba(0, 255, 255, 0.2)` with `border: 3px solid #00ffff`

---

## Layout Elements

### Cards and Containers
Semi-transparent dark backgrounds with glowing borders:

```css
background: rgba(26, 0, 51, 0.9);
border: 4px solid #ff00ff;
border-radius: 15px;
padding: 25px;
box-shadow:
  0 0 30px rgba(255, 0, 255, 0.6),
  0 8px 20px rgba(0, 0, 0, 0.5),
  inset 0 0 30px rgba(255, 0, 255, 0.1);
```

### Question Cards
Cyan-bordered cards with medium padding:

```css
background: rgba(26, 0, 51, 0.8);
border: 3px solid #00ffff;
border-radius: 15px;
padding: 1.5rem;
box-shadow: 0 0 15px #00ffff, 0 0 30px rgba(0, 255, 255, 0.3);
```

### Configuration Sections
Green-bordered sections for settings:

```css
background: rgba(26, 0, 51, 0.9);
border: 4px solid #00ff00;
border-radius: 15px;
padding: 25px;
```

### Flash Cards with 3D Flip
Two-sided cards with distinct styling:

**Front Face**:
```css
background: rgba(26, 0, 51, 0.9);
border: 4px solid #00ffff;
border-radius: 20px;
min-height: 500px;
box-shadow: 0 0 30px #00ffff;
```

**Back Face**:
```css
background: rgba(0, 26, 13, 0.9);
border: 4px solid #00ff00;
border-radius: 20px;
min-height: 500px;
box-shadow: 0 0 30px #00ff00;
transform: rotateY(180deg);
```

---

## Special Visual Effects

### Neon Text Glow
Multi-layer text shadows for intense neon effect:

```css
text-shadow:
  0 0 10px #ff00ff,
  0 0 20px #ff00ff,
  0 0 40px #ff00ff,
  0 0 80px #ff00ff;
```

### Multi-Color Box Glow
Layered box shadows in multiple neon colors:

```css
box-shadow:
  0 0 30px rgba(255, 0, 255, 0.6),
  0 0 60px rgba(0, 255, 255, 0.8),
  0 0 80px rgba(0, 255, 0, 0.6);
```

### Icon Drop Shadow Glow
For SVG icons and graphics:

```css
filter: drop-shadow(0 0 20px #ff6600);
```

### Backdrop Blur
For overlays and modals:

```css
backdrop-filter: blur(10px);
```

### Animated Shine Effect
Moving light reflection across buttons:

```css
.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -200%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  to { left: 200%; }
}
```

### Sparkle Background
Animated starfield effect:

```css
background-image:
  radial-gradient(2px 2px at 20% 30%, #ff00ff, transparent),
  radial-gradient(2px 2px at 60% 70%, #00ff00, transparent),
  radial-gradient(1px 1px at 50% 50%, #ffff00, transparent);
background-size: 200% 200%;
animation: sparkle 8s ease-in-out infinite;
opacity: 0.3;

@keyframes sparkle {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
}
```

---

## Spacing and Borders

### Border Specifications
- **Primary Borders**: 4px solid (major containers, buttons)
- **Secondary Borders**: 3px solid (cards, sections)
- **Thin Borders**: 2px solid (small elements, dividers)

### Border Radius Values
- **Large Cards/Containers**: 15-20px
- **Buttons**: 10-15px
- **Small Elements**: 8px
- **Circular Elements**: 50% (badges, radio buttons)
- **Pills**: 25px (tags, badges)

### Padding Scale
- **Large Containers**: 25px or 3rem
- **Medium Elements**: 1.5rem or 20px
- **Buttons**: 20px 40px (vertical horizontal)
- **Small Elements**: 12px 24px

### Gap/Spacing Between Elements
- **Large Gaps** (major sections): 30px or 2rem
- **Medium Gaps** (between cards): 20px or 1.5rem
- **Small Gaps** (within cards): 15px or 1rem

---

## Interactive States

### Hover Effects
Apply to all interactive elements:
- Scale: `transform: scale(1.05)` to `scale(1.08)`
- Lift: `translateY(-5px)`
- Enhanced glow: Increase box-shadow intensity
- Gradient shift: Rotate through neon color spectrum

### Focus States
High visibility outlines:

```css
.element:focus {
  outline: none;
  border-color: #ff00ff;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.8);
}
```

### Success States
Green background tint with glow:

```css
.success {
  background: rgba(0, 255, 0, 0.15);
  border: 3px solid #00ff00;
  color: #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
}
```

### Error States
Magenta background tint with glow:

```css
.error {
  background: rgba(255, 0, 255, 0.15);
  border: 3px solid #ff00ff;
  color: #ff00ff;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
}
```

### Correct Answer Indication
Green tinted background:

```css
.correct {
  background: rgba(0, 255, 0, 0.2);
  border: 2px solid #00ff00;
  color: #00ff00;
}
```

### Wrong Answer Indication
Red tinted background:

```css
.wrong {
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid #ff0000;
  color: #ff0000;
}
```

### Disabled States
- Opacity: 0.3 to 0.5
- Grayscale colors: `#666`, `#999`
- Cursor: `cursor: not-allowed`
- Remove all animations

---

## Animation Library

### Core Animations

**Glow Pulse** (3s infinite alternate):
```css
@keyframes glowPulse {
  from {
    box-shadow: 0 0 20px currentColor;
    transform: translateY(0);
  }
  to {
    box-shadow: 0 0 40px currentColor, 0 0 60px currentColor;
    transform: translateY(-5px);
  }
}
```

**Color Cycle** (3s infinite):
```css
@keyframes colorCycle {
  0% { color: #ff00ff; text-shadow: 0 0 20px #ff00ff; }
  25% { color: #00ff00; text-shadow: 0 0 20px #00ff00; }
  50% { color: #ffff00; text-shadow: 0 0 20px #ffff00; }
  75% { color: #00ffff; text-shadow: 0 0 20px #00ffff; }
  100% { color: #ff00ff; text-shadow: 0 0 20px #ff00ff; }
}
```

**Bounce** (2s infinite):
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
```

**Float** (6s infinite):
```css
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(5deg); }
  75% { transform: translateY(-10px) rotate(-5deg); }
}
```

**Fade In** (0.5s):
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Scale Pop** (0.8s):
```css
@keyframes scalePop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1.0); opacity: 1; }
}
```

**Blink** (2s infinite):
```css
@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.4; }
}
```

**Timer Warning Pulse** (0.5s infinite):
```css
@keyframes timerPulse {
  0%, 100% { transform: scale(1.0); }
  50% { transform: scale(1.05); }
}
```

### Animation Usage Guidelines
- Use `infinite` for persistent effects (glows, floats)
- Use `alternate` for ping-pong animations
- Keep durations between 0.3s - 8s
- Apply `ease-in-out` timing for smooth organic motion
- Stack animations for complex effects

---

## Accessibility Considerations

### High Contrast
- Maintain high contrast between text and backgrounds
- Neon colors on dark backgrounds provide excellent visibility
- Minimum contrast ratio: 7:1 for normal text, 4.5:1 for large text

### Interactive Element Sizing
- Minimum button size: 44x44px for touch targets
- Large padding for easy clicking/tapping
- Clear visual separation between interactive elements

### Focus Indicators
- Always provide visible focus states
- Use bright neon outlines (magenta, cyan) for keyboard navigation
- Never remove focus indicators without replacement

### Motion Sensitivity
- Provide option to reduce motion/disable animations
- Use `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Implementation Notes

### Layer Hierarchy
1. Background gradient (deepest)
2. Sparkle/star field overlay (or UV overlay for SPIDER GAMEZ)
3. Content cards (semi-transparent)
4. Interactive elements (buttons, inputs)
5. Glowing effects (box-shadow, text-shadow)
6. Overlays/modals (highest)

### Performance Optimization
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `left`, `right`, `top`, `bottom`
- Use `will-change` sparingly for complex animations
- Consolidate box-shadows when possible
- **SPIDER GAMEZ**: Avoid `shadowBlur` on canvas for performance and clarity

### Responsive Design
- Mobile-first approach
- Reduce glow effects on mobile for performance
- Simplify animations on smaller screens
- Maintain minimum touch target sizes
- Scale font sizes proportionally

### Browser Compatibility
- Test neon effects across browsers (Safari may render glows differently)
- Provide fallbacks for `backdrop-filter`
- Use vendor prefixes for transforms where needed
- Ensure monospace font fallbacks are available

---

## Design Principles Summary

### Common Principles (Both Themes)
1. **Dark Backgrounds**: High-contrast colors on deep purple/black backgrounds
2. **Glowing Effects**: Liberal use of box-shadow and text-shadow
3. **Monospace Typography**: Consistent Courier New font throughout
4. **Bold and Uppercase**: Headings and buttons are bold with wide letter spacing
5. **Smooth Interactions**: All interactive elements have hover states with scale and glow
6. **Animated Feedback**: Use animations to provide feedback
7. **Semi-Transparent Layers**: Create depth with rgba backgrounds
8. **Accessibility First**: High contrast, large targets, keyboard navigation
9. **Performance Aware**: GPU-accelerated animations, optimized effects

### SPIDER GAMEZ Specific
10. **UV Blacklight Colors**: Purple, violet, blue, green palette
11. **No Canvas Blur**: Keep canvas rendering crisp
12. **Purple-to-Blue Transitions**: Signature hover effect
13. **Spider Theme Elements**: Web motifs and swinging spiders

### Flash Owls Specific
10. **Bright Neon Colors**: Magenta, cyan, lime, yellow palette
11. **Gradient Buttons**: Multi-color gradients on interactive elements
12. **Sparkle Effects**: Animated starfield backgrounds
13. **Theme Variations**: 8 color scheme options

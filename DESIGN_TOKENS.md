# 🎨 Design Tokens - Bererech Aviator Style

## Color Palette

### Primary Colors
```css
/* Backgrounds */
--bg-primary: #0F0F0F;      /* Main background */
--bg-secondary: #1C1C1C;    /* Cards, panels */
--bg-tertiary: #111111;     /* Header bar */

/* Text */
--text-primary: #FFFFFF;    /* Main text */
--text-secondary: #9CA3AF;  /* Gray-400, secondary text */
--text-muted: #6B7280;      /* Gray-500, muted text */

/* Borders */
--border-primary: #374151;  /* Gray-700 */
--border-secondary: #1F2937; /* Gray-800 */
```

### Accent Colors
```css
/* Success / Win */
--success: #00FF80;         /* Neon green */
--success-dark: #00CC66;    /* Darker green */
--success-glow: rgba(0, 255, 128, 0.5);

/* Error / Loss */
--error: #FF3366;           /* Pink-red */
--error-light: #FF6B9D;     /* Light pink */
--error-glow: rgba(255, 51, 102, 0.5);

/* Warning / Active */
--warning: #00FFFF;         /* Cyan */
--warning-glow: rgba(0, 255, 255, 0.5);

/* Special */
--purple: #9D4EDD;          /* Purple accent */
--purple-glow: rgba(157, 78, 221, 0.5);

--gold: #FFD700;            /* Gold for high values */
--gold-glow: rgba(255, 215, 0, 0.5);
```

### Gradient Definitions
```css
/* Logo Gradient */
background: linear-gradient(to right, #FF3366, #FF6B9D);

/* Button Gradient */
background: linear-gradient(to right, #00FF80, #00CC66);

/* Game Area Gradient */
background: linear-gradient(to bottom right, #0F0F0F, #1a1a2e, #0F0F0F);

/* Tab Underline Gradient */
background: linear-gradient(to right, #FF3366, #00FF80);
```

## Typography

### Font Families
```css
--font-primary: system-ui, -apple-system, sans-serif;
--font-mono: 'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px - Labels, small info */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Button text */
--text-xl: 1.25rem;    /* 20px - Input values */
--text-2xl: 1.5rem;    /* 24px - Section headers */
--text-3xl: 1.875rem;  /* 30px - Large headers */
--text-4xl: 2.25rem;   /* 36px - Extra large */
--text-5xl: 3rem;      /* 48px - Huge text */
--text-6xl: 3.75rem;   /* 60px - Massive */
--text-7xl: 4.5rem;    /* 72px - Multiplier display */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

## Spacing

### Padding/Margin Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### Gap Scale
```css
--gap-2: 0.5rem;      /* 8px - Tight spacing */
--gap-3: 0.75rem;     /* 12px - Default spacing */
--gap-4: 1rem;        /* 16px - Comfortable spacing */
--gap-6: 1.5rem;      /* 24px - Large spacing */
```

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px - rounded-lg */
--radius-lg: 0.75rem;    /* 12px - rounded-xl */
--radius-xl: 1rem;       /* 16px - rounded-2xl */
--radius-2xl: 1.5rem;    /* 24px - rounded-3xl */
--radius-full: 9999px;   /* Circular */
```

## Shadows

### Box Shadows
```css
/* Standard Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.4);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.5);

/* Glow Shadows */
--shadow-green-glow: 0 0 20px rgba(0, 255, 128, 0.5);
--shadow-pink-glow: 0 0 20px rgba(255, 51, 102, 0.5);
--shadow-cyan-glow: 0 0 20px rgba(0, 255, 255, 0.5);
--shadow-purple-glow: 0 0 20px rgba(157, 78, 221, 0.5);
--shadow-gold-glow: 0 0 20px rgba(255, 215, 0, 0.5);
```

### Text Shadows
```css
/* Multiplier Glow */
--text-shadow-green: 0 0 30px rgba(0, 255, 128, 0.8), 0 0 60px rgba(0, 255, 128, 0.4);
--text-shadow-pink: 0 0 30px rgba(255, 51, 102, 0.8);
--text-shadow-cyan: 0 0 20px rgba(0, 255, 255, 0.6);
```

## Transitions

```css
/* Duration */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Timing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Combined */
--transition-smooth: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
```

## Component-Specific Tokens

### Header
```css
--header-height: 56px;
--header-bg: #111111;
--header-border: #374151;
```

### Multiplier Bar
```css
--multiplier-bar-height: 60px;
--multiplier-bar-bg: #0F0F0F;
--pill-padding: 0.5rem 1rem;
```

### Game Area
```css
--game-area-height: 400px;
--game-area-bg: linear-gradient(to bottom right, #0F0F0F, #1a1a2e, #0F0F0F);
--plane-size: 5rem; /* 80px */
```

### Bet Panel
```css
--bet-panel-bg: #1C1C1C;
--bet-panel-border: #374151;
--bet-panel-padding: 1rem;
--input-height: 48px;
--button-height: 56px;
```

### Player List
```css
--avatar-size: 40px;
--list-item-height: 60px;
--list-max-height: 400px;
```

### Chat Button
```css
--chat-button-size: 56px;
--chat-button-position: 1.5rem; /* bottom & right */
```

## Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

## Animation Keyframes

### Bounce (Plane)
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Pulse (Countdown, Crash)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Scale (Hover)
```css
@keyframes scale-up {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}
```

## Usage Examples

### Button with Glow
```tsx
className="
  bg-gradient-to-r from-[#00FF80] to-[#00CC66]
  text-black font-black text-lg
  px-6 py-4 rounded-xl
  shadow-lg shadow-[#00FF80]/50
  hover:scale-110 transition-all duration-300
"
```

### Glowing Multiplier
```tsx
className="
  text-7xl font-black text-[#00FF80]
"
style={{
  textShadow: '0 0 30px rgba(0, 255, 128, 0.8), 0 0 60px rgba(0, 255, 128, 0.4)'
}}
```

### Card Container
```tsx
className="
  bg-[#1C1C1C] rounded-2xl
  border border-gray-800
  p-4 shadow-lg
"
```

### Input Field
```tsx
className="
  w-full bg-[#0F0F0F]
  text-white text-xl font-bold
  px-4 py-3 rounded-xl
  border border-gray-700
  focus:border-[#00FF80] focus:outline-none
"
```

### Avatar Circle
```tsx
className="
  w-10 h-10 rounded-full
  bg-gradient-to-br from-[#FF3366] to-[#9D4EDD]
  flex items-center justify-center
  text-white text-xs font-bold
"
```

## Color Usage Guidelines

### When to Use Each Color

#### Green (#00FF80)
- ✅ Win states
- ✅ Cash out buttons
- ✅ Positive feedback
- ✅ Success messages
- ✅ Active multipliers

#### Pink-Red (#FF3366)
- ❌ Loss states
- ❌ Crash indicators
- ❌ Error messages
- ❌ Logo gradient
- ❌ Destructive actions

#### Cyan (#00FFFF)
- ⏳ Active/waiting states
- ⏳ Countdown timers
- ⏳ In-progress indicators
- ⏳ Medium multipliers

#### Purple (#9D4EDD)
- 🎯 High multipliers (5x-10x)
- 🎯 Special states
- 🎯 Avatar gradients

#### Gold (#FFD700)
- 🏆 Very high multipliers (10x+)
- 🏆 Top wins
- 🏆 Achievements

## Accessibility

### Contrast Ratios
```
White on #0F0F0F: 19.5:1 (AAA)
#00FF80 on #0F0F0F: 12.8:1 (AAA)
#FF3366 on #0F0F0F: 7.2:1 (AA)
#00FFFF on #0F0F0F: 13.1:1 (AAA)
```

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-[#00FF80]
focus:ring-offset-2
focus:ring-offset-[#0F0F0F]
```

## Print Styles

```css
@media print {
  /* Hide decorative elements */
  .chat-button { display: none; }
  .multiplier-bar { display: none; }
  
  /* Adjust colors for print */
  background: white !important;
  color: black !important;
}
```

---

## Quick Reference Card

```
BACKGROUNDS:  #0F0F0F, #1C1C1C, #111111
TEXT:         #FFFFFF, #9CA3AF, #6B7280
BORDERS:      #374151, #1F2937

SUCCESS:      #00FF80 → #00CC66
ERROR:        #FF3366 → #FF6B9D
WARNING:      #00FFFF
SPECIAL:      #9D4EDD, #FFD700

SPACING:      2, 3, 4, 6 (8px, 12px, 16px, 24px)
RADIUS:       lg, xl, 2xl, full (8px, 12px, 16px, ∞)
SHADOWS:      lg + glow variants
TRANSITIONS:  300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

**Use these tokens consistently across all components for a cohesive design system!**

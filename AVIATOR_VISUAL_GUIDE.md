# 🎨 Aviator Style Visual Guide

## Component Breakdown

### 1. HeaderBar
```
┌────────────────────────────────────────────┐
│ Bererech          Balance: 1000.00 ETB    │
│ (pink gradient)   (neon green)            │
└────────────────────────────────────────────┘
```
- Height: ~50px
- Background: `#111111`
- Border bottom: gray-800

### 2. MultiplierBar
```
┌────────────────────────────────────────────┐
│ [2.79x] [1.38x] [20.09x] [3.45x] [1.12x] →│
│  cyan    pink    gold     purple   pink    │
└────────────────────────────────────────────┘
```
- Horizontal scroll
- Each pill: rounded-lg with glow
- Auto-colored by value

### 3. GameArea
```
┌────────────────────────────────────────────┐
│                                            │
│              ✈️                            │
│                                            │
│            15.67x                          │
│           FLYING...                        │
│                                            │
└────────────────────────────────────────────┘
```
- Height: 400px
- Radial gradient background
- Centered content
- Glowing multiplier text

### 4. BetPanel
```
┌────────────────────────────────────────────┐
│ BET AMOUNT                                 │
│ ┌──────────────────────────────────┐ ETB  │
│ │ 100.00                           │      │
│ └──────────────────────────────────┘      │
│                                            │
│ [10] [50] [100] [500] [1000]              │
│                                            │
│ Auto Bet              [Toggle]            │
│ Auto Cash Out         [Toggle]            │
│   At: [2.00] x                            │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │   BET 100.00 ETB                     │  │
│ │   (green gradient button)            │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ POTENTIAL WIN                        │  │
│ │ 1567.00 ETB                          │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### 5. Tabs + BetsList
```
┌────────────────────────────────────────────┐
│ All Bets | My Bets | Top Wins              │
│ ────────                                   │
├────────────────────────────────────────────┤
│ [AB] Ahmed B.        100 ETB    ⏳ 2.45x  │
│ [SK] Sara K.         500 ETB    ✓ 3.20x   │
│ [MH] Mohammed H.     250 ETB    ✗ Lost    │
│ [FT] Fatima T.       1000 ETB   ⏳ 2.45x  │
└────────────────────────────────────────────┘
```

### 6. ChatButton
```
                                    ┌───┐
                                    │ 💬│
                                    └───┘
```
- Fixed bottom-right
- Pink gradient circle
- Hover: scale up

## Color Usage Guide

### Backgrounds
- Main: `#0F0F0F`
- Cards: `#1C1C1C`
- Inputs: `#0F0F0F`
- Borders: `#374151` (gray-700/800)

### Text Colors
- Primary: `#FFFFFF` (white)
- Secondary: `#9CA3AF` (gray-400)
- Success: `#00FF80` (neon green)
- Error: `#FF3366` (pink-red)
- Warning: `#00FFFF` (cyan)

### Accent Colors
- Buttons: `#00FF80` → `#00CC66` gradient
- Logo: `#FF3366` → `#FF6B9D` gradient
- Active: `#00FFFF`
- High value: `#FFD700`

## Typography Scale

```
text-xs    → 12px  (labels, small info)
text-sm    → 14px  (secondary text)
text-base  → 16px  (body text)
text-lg    → 18px  (button text)
text-xl    → 20px  (input values)
text-2xl   → 24px  (section headers)
text-7xl   → 72px  (multiplier display)
```

## Spacing System

```
gap-2  → 8px   (tight spacing)
gap-3  → 12px  (default spacing)
gap-4  → 16px  (comfortable spacing)
p-3    → 12px  (small padding)
p-4    → 16px  (default padding)
p-6    → 24px  (large padding)
```

## Border Radius

```
rounded-lg   → 8px   (small elements)
rounded-xl   → 12px  (buttons, inputs)
rounded-2xl  → 16px  (cards, panels)
rounded-3xl  → 24px  (game area)
rounded-full → 50%   (circles, toggles)
```

## Shadows & Effects

### Box Shadows
```css
shadow-lg → 0 10px 15px rgba(0,0,0,0.3)
shadow-[#00FF80]/50 → Green glow
shadow-[#FF3366]/50 → Pink glow
```

### Text Shadows
```css
/* Active multiplier */
text-shadow: 0 0 30px rgba(0,255,128,0.8)

/* Crashed state */
text-shadow: 0 0 30px rgba(255,51,102,0.8)
```

## Animation Classes

```css
animate-bounce  → Plane during flight
animate-pulse   → Countdown, crashed state
transition-all  → Smooth state changes
hover:scale-110 → Button hover effect
```

## Responsive Breakpoints

```
Mobile:  < 640px  (1 column)
Tablet:  640-1024px (1-2 columns)
Desktop: > 1024px (3 columns)
```

## State Indicators

### Bet Status
- 🟢 Active: Yellow/Cyan with pulse
- ✓ Won: Green with glow
- ✗ Lost: Red

### Connection
- Connected: Hidden
- Disconnected: Red banner top-right

### Game State
- Break: Cyan countdown
- Playing: Green multiplier with glow
- Crashed: Red multiplier with pulse

## Best Practices

1. **Always use dark backgrounds** (`#0F0F0F` or `#1C1C1C`)
2. **Neon colors for important actions** (green buttons, pink alerts)
3. **Glowing effects on active elements** (text-shadow, box-shadow)
4. **Smooth transitions** (300ms cubic-bezier)
5. **Bold typography** (font-bold, font-black)
6. **Rounded corners everywhere** (minimum rounded-lg)
7. **Consistent spacing** (use gap-3, gap-4)
8. **Color-coded feedback** (green=good, red=bad, cyan=active)

---

**Design Philosophy**: Dark, modern, casino-style with neon accents and smooth animations.

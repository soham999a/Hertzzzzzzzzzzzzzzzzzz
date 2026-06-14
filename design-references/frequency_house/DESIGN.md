---
name: Frequency House
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#9c9a9a'
  on-tertiary-container: '#333232'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  mono-label:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 20px
---

## Brand & Style
The design system is engineered for a premium, immersive audio experience, targeting audiophiles and late-night listeners who value high-fidelity aesthetics. The personality is sophisticated, nocturnal, and high-end, mirroring the tactile feel of luxury audio hardware.

The visual style is **Glassmorphic Minimalism** set against a **Dark-first** foundation. It utilizes deep blacks, muted surfaces, and vibrant glowing accents to create a sense of infinite depth. Subtle dot-grid textures are used as background overlays to evoke a technical, engineered feel. The emotional response should be one of focused immersion, where the interface recedes to let the music and live broadcast take center stage.

## Colors
The palette is dominated by `neutral` (#0A0A0A) to ensure a true-black OLED experience. `tertiary` (#141414) serves as the surface color for cards and elevated containers. 

The **Primary Accent** is a high-energy Gold/Amber gradient that transitions from Orange-500 to Amber-500. This gradient is reserved for high-importance interactions: "Live" indicators, primary buttons, and progress seekers. All text should maintain high contrast; primary body and headings utilize pure white, while secondary metadata uses a muted zinc gray to maintain hierarchy without clutter.

## Typography
This design system utilizes **Inter** exclusively to maintain a modern, systematic clarity. To achieve the "premium audio" look, headings (Display and Headline-LG) utilize a bold weight and negative letter spacing, occasionally employing uppercase styling to mimic high-end hardware labels.

Hierarchy is established through weight and color rather than just size. Metadata (e.g., timestamps, bitrates) should use the `mono-label` style to provide a technical, precision-oriented feel. For mobile devices, display type scales down to prevent awkward wrapping while maintaining its heavy visual weight.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous safe-area margins. 
- **Desktop:** 12-column grid with 24px gutters.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.

Content is organized into logical "strips" or "shelves" common in streaming interfaces. Horizontal scrolling is preferred for category browsing on mobile. Elements should be spaced using an 8px base unit to ensure rhythmic consistency. Negative space is used aggressively to separate live content from library navigation.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.
1. **Base:** The background (#0A0A0A) with a subtle 5% opacity dot-grid overlay.
2. **Surface:** Cards (#141414) with a subtle 1px inner border (white at 5% opacity) to define edges.
3. **Glass Overlay:** Modals and player bars use a 20px backdrop blur with a semi-transparent (#141414 at 80% opacity) fill.
4. **Glow:** Active elements (like the "Now Playing" card) utilize a soft, 32px Gaussian blur shadow using the primary Gold color at 15% opacity to simulate light emission.

## Shapes
The shape language combines structured **Rounded-XL (12px)** corners for large containers and **Pill** shapes for interactive navigation.
- **Cards & Albums:** Always 12px (`rounded-lg`) or 24px (`rounded-xl`) depending on scale.
- **Tabs & Secondary Buttons:** Fully rounded (pill-shaped) to differentiate them from the content grid.
- **Progress Bars:** Pill-shaped tracks with glowing circular handles.

## Components
- **Primary Buttons:** Pill-shaped with the Gold/Amber gradient. Text is black for maximum legibility on the vibrant background.
- **Live Indicators:** A small pill containing "LIVE" text in `label-caps`. Must include a pulsing animation using a 4px Gold outer glow.
- **Glass Cards:** Cards use the #141414 surface with a 12px corner radius. On hover, the 1px border opacity increases from 5% to 20%.
- **Dividers:** Use a 1px height. In high-prominence areas, dividers should use a subtle 50% width centered gradient that fades into the background.
- **Navigation Tabs:** Pill-shaped containers. The active state has a solid Gold fill, while inactive states have a ghost-style border.
- **Input Fields:** Darker than the card surface (#050505), with a 1px Zinc-800 border that glows Gold when focused.
- **Visualizers:** Low-opacity frequency bars integrated into the background of the "Now Playing" section to provide rhythmic feedback.
---
name: Slate & Indigo
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#44474c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#75777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#515f74'
  primary: '#303e51'
  on-primary: '#ffffff'
  primary-container: '#475569'
  on-primary-container: '#bbcae1'
  inverse-primary: '#b9c7df'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#231fb5'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e3fcc'
  on-tertiary-container: '#c4c4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3fc'
  primary-fixed-dim: '#b9c7df'
  on-primary-fixed: '#0d1c2e'
  on-primary-fixed-variant: '#3a485b'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
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
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

# Design System: Slate & Indigo

## Brand & Style
The brand identity is sophisticated, professional, and calm. The style is **Corporate / Modern**, emphasizing reliability, clarity, and a balanced interface. 

The UI evokes a sense of stability through the use of cool slate tones and precise indigo accents. The design language avoids unnecessary decoration, focusing instead on high-quality typography and subtle depth to guide the user's attention.

## Colors
The color palette is built on a foundation of neutral slates, providing a professional and accessible backdrop.

*   **Primary (#475569):** A deep slate gray used for core structural elements and primary actions.
*   **Secondary (#64748B):** A lighter slate used for supporting information.
*   **Tertiary (#6366F1):** A vibrant indigo used sparingly for call-to-actions and highlights.
*   **Neutral (#FFFFFF):** A clean white base for surfaces and containers.

The "neutral" color variant ensures that the interface remains grounded and minimizes visual fatigue.

## Typography
The system uses **Geist** across all roles—a modern typeface designed for precision and readability.

*   **Headlines:** Set in Geist with semi-bold weights for authoritative clarity.
*   **Body:** Standard body text uses a 16px base for comfortable reading.
*   **Labels:** Used for buttons and metadata, maintaining legibility at small sizes.

## Layout & Spacing
The layout follows a **Fluid Grid** philosophy. A baseline spacing unit of 8px governs all margins and padding. 

*   **Desktop:** 12-column grid, 24px margins.
*   **Mobile:** 4-column grid, 16px margins.

## Elevation & Depth
The system utilizes **Tonal Layers** and soft, ambient shadows. Depth is conveyed through subtle shifts in surface color and low-opacity shadows. Interactive elements often use low-contrast outlines to define boundaries against the white background.

## Shapes
The UI utilizes a **Rounded** aesthetic (0.5rem / 8px). This softens the corporate slate tones, making the interface feel more approachable. 

*   **Standard Elements:** 8px corner radius (buttons, inputs).
*   **Large Elements:** 16px corner radius (cards).

## Components
*   **Buttons:** Primary buttons use Tertiary indigo (#6366F1). Secondary buttons use Primary slate (#475569).
*   **Inputs:** 1px border in Secondary slate (#64748B) with an 8px corner radius.
*   **Cards:** White backgrounds (#FFFFFF) with a 16px corner radius and soft ambient shadows.
*   **Chips:** Rounded-pill containers using a light slate tint for categorization.
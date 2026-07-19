---
name: ArchGuard
colors:
  surface: '#13121b'
  surface-dim: '#13121b'
  surface-bright: '#3a3841'
  surface-container-lowest: '#0e0d15'
  surface-container-low: '#1c1b23'
  surface-container: '#201f27'
  surface-container-high: '#2a2932'
  surface-container-highest: '#35343d'
  on-surface: '#e5e0ed'
  on-surface-variant: '#c8c4d7'
  inverse-surface: '#e5e0ed'
  inverse-on-surface: '#312f38'
  outline: '#928ea0'
  outline-variant: '#474554'
  surface-tint: '#c6bfff'
  primary: '#c6bfff'
  on-primary: '#2900a0'
  primary-container: '#6c5ce7'
  on-primary-container: '#faf6ff'
  inverse-primary: '#5847d2'
  secondary: '#46eae5'
  on-secondary: '#003735'
  secondary-container: '#00cec9'
  on-secondary-container: '#005250'
  tertiary: '#ffb1c8'
  on-tertiary: '#650033'
  tertiary-container: '#bd4775'
  on-tertiary-container: '#fff5f6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6bfff'
  on-primary-fixed: '#160066'
  on-primary-fixed-variant: '#4029ba'
  secondary-fixed: '#5af9f3'
  secondary-fixed-dim: '#2edcd7'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#00504e'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb1c8'
  on-tertiary-fixed: '#3e001d'
  on-tertiary-fixed-variant: '#861949'
  background: '#13121b'
  on-background: '#e5e0ed'
  surface-variant: '#35343d'
  critical: '#FF4757'
  warning: '#FECA57'
  info: '#A0A3BD'
  bg-base: '#0F0E17'
  surface-1: '#1A1932'
  surface-2: '#232246'
  surface-3: '#2D2B55'
  border-subtle: '#3D3B6E'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
---

# DESIGN.md — ArchGuard: Architecture Reviewer + CI/CD Guardian

## Brand Identity

**Product Name:** ArchGuard
**Tagline:** Architecture review that enforces itself.
**Personality:** Authoritative, precise, trustworthy. A security-first DevOps tool that feels like a seasoned staff engineer watching every PR. The visual language balances technical density with clarity — dark mode by default, sharp data visualizations, and status-driven color semantics.

---

## Color System

### Mode
- **Default appearance:** Dark mode

### Primary Palette
- **Primary (Seed):** `#6C5CE7` — Electric Indigo. Used for primary actions, active states, selected nav items, and the graph's "current node" highlight.
- **Secondary:** `#00CEC9` — Teal Cyan. Used for success states, passing checks, healthy scores, and positive deltas.
- **Tertiary:** `#FD79A8` — Soft Rose. Used for accent highlights, badges, and interactive hover states.

### Semantic Colors
- **Critical / Block:** `#FF4757` — Red. Merge-blocking findings, critical CVEs, failed checks.
- **Warning / Warn:** `#FECA57` — Amber. Non-blocking warnings, debt-score increases, advisory notices.
- **Pass / Success:** `#00CEC9` — Teal (reuses secondary). Clean checks, passing policy gates.
- **Info / Neutral:** `#A0A3BD` — Muted Lavender-Gray. Secondary text, metadata, timestamps.

### Surface Colors (Dark Mode)
- **Background:** `#0F0E17` — Deep Space. Main app background.
- **Surface 1:** `#1A1932` — Elevated cards, side panels, modals.
- **Surface 2:** `#232246` — Active/hovered card states, dropdown menus.
- **Surface 3:** `#2D2B55` — Selected items, active filters, focused inputs.
- **Border:** `#3D3B6E` — Subtle borders on cards, dividers, graph edges.

### Dynamic Color Variant
- **Variant:** VIBRANT — to keep status-driven colors punchy against the dark background.

---

## Typography

### Font Families
- **Headlines / Display:** `Space Grotesk` — geometric, technical, modern. Used for page titles, section headers, and metric callouts.
- **Body / UI:** `Inter` — highly legible at small sizes, excellent for data-dense interfaces. Used for all body text, table content, code annotations, and form labels.
- **Code / Monospace:** `JetBrains Mono` — used inside code diffs, file paths, terminal output, and inline code references.
- **Labels:** `Space Grotesk` — matching headlines for consistency on chips, badges, and status labels.

---

## Shape & Roundness

- **Roundness:** `ROUND_EIGHT` (8px border-radius) — sharp enough to feel technical, rounded enough to feel modern.
- Cards, modals, and panels use 12px radius.
- Buttons and inputs use 8px radius.
- Chips, badges, and status pills use full roundness (999px).

---

## Spacing System

| Token   | Value |
|---------|-------|
| xs      | 4px   |
| sm      | 8px   |
| md      | 16px  |
| lg      | 24px  |
| xl      | 32px  |
| 2xl     | 48px  |
| 3xl     | 64px  |
| 4xl     | 96px  |

---

## Iconography

- **Style:** Outlined, 1.5px stroke weight, 24px default size.
- **Icon Set:** Lucide Icons.

---

## Screen Inventory

### 1. Onboarding / Connect
**Purpose:** GitHub App installation flow.

### 2. Dashboard (Home)
**Purpose:** Overview of all connected repositories and system health.

### 3. Repository Detail
**Purpose:** Deep dive into a single repo's architecture and health.

### 4. PR Analysis Detail
**Purpose:** Full results of a single PR's diff-scoped analysis.

### 5. Interactive Architecture Graph (Full Page)
**Purpose:** Explore the full dependency graph of a repo.

### 6. Policy Configuration
**Purpose:** Configure merge-blocking and warning rules per repo.

### 7. Auto-Remediation Queue
**Purpose:** Review and merge auto-generated fix PRs.

### 8. Settings
**Purpose:** Global app and account settings.

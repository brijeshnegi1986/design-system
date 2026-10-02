# JeshApps Design System

## Purpose

This repository is the shared design system for projects inside `~/JeshApps`.

It is the single source of truth for:

- Design tokens
- Brand tokens
- Semantic color modes
- Component tokens
- Spacing
- Radius
- Typography
- Shared UI components
- Design-system documentation

## Source of Truth

Figma is the design-authoring source.

This repository is the engineering source of truth.

The intended flow is:

Figma
→ exported design tokens
→ import script
→ normalised repository tokens
→ Style Dictionary
→ generated distribution output
→ consuming projects

Do not manually duplicate design-system tokens inside individual projects when an equivalent token exists here.

## Current Figma Source

Primary Figma file:

Design System Version 1.0

Only use the approved Design System Version 1.0 file as the current design reference unless explicitly instructed otherwise.

## Token Architecture

Tokens are organised into:

- `tokens/primitives/`
  - Raw foundational values such as colour scales.

- `tokens/semantics/`
  - Meaning-based tokens.
  - Supports Light and Dark modes.

- `tokens/component/`
  - Component-specific tokens and states.

- `tokens/spacing/`
  - Spacing scale.

- `tokens/radius/`
  - Border-radius scale.

## Brands

Brand-specific configuration belongs under:

`brands/<brand>/`

The system must support multiple brands in the future.

Do not hard-code the current brand into shared token architecture.

## Figma Imports

Figma exports are kept under:

`docs/figma-export/`

The import process must be repeatable.

Do not manually modify generated Figma export files.

Normalised token files under `tokens/` may be generated from those exports.

## Consuming Projects

Projects inside `~/JeshApps` should consume this design system rather than independently recreating:

- Colours
- Semantic colours
- Spacing
- Radius
- Typography
- Component tokens
- Shared components

Current consuming projects may include:

- Stakemate
- NegiFlow
- NegiFlow Platform
- JeshNegi
- Customer Feedback Intelligence

Each project may have its own product requirements, but shared visual foundations should come from this design system.

## Platform Differences

The design system must support different implementation platforms.

Examples:

- Web / Next.js
- React Native / Expo
- Future platforms

Do not assume that CSS is the only output format.

Keep source tokens platform-independent.

## Token Rules

Prefer semantic tokens in application code.

For example:

Use:

`color.background.default`

instead of directly using:

`#F8FAFC`

Use primitive tokens only when defining the design system itself or when a semantic mapping genuinely does not exist.

Do not introduce arbitrary colours into consuming projects without documenting why they cannot use an existing token.

## Light and Dark Modes

Semantic colour tokens support:

- Light
- Dark

Consuming applications should use semantic tokens rather than hard-coded mode-specific colours.

## Components

Shared components should eventually live under:

`components/`

Components must consume design tokens rather than hard-coded visual values wherever practical.

## Changes

Before changing an existing token:

1. Check its Figma definition.
2. Check where the token is used.
3. Determine whether the change affects Light, Dark, components, or brands.
4. Update the source/import process where appropriate.
5. Run validation.
6. Document breaking changes.

Do not silently rename or delete established tokens.

## Generated Files

Generated outputs must be reproducible from source tokens.

The current generated distribution is:

`dist/tokens/tokens.json`

`dist/` is intentionally gitignored.

Do not manually edit generated build output.

The generation flow is:

```text
npm run tokens:import
npm run tokens:validate
npx style-dictionary build --config sd.config.mjs 

## Validation

Every token change must pass the repository validation checks before being consumed by projects.

## Git

This repository is independently version controlled.

Use meaningful commits.

Design-system changes should be versionable so consuming projects can update deliberately.

## Claude Code Rules

Before making changes:

1. Read this file.
2. Inspect the existing repository structure.
3. Preserve the token architecture.
4. Do not invent values that are not present in the design system.
5. Do not modify Figma-derived values without explicit instruction.
6. Prefer the smallest safe change.
7. Run relevant validation after changes.

When generating user-facing copy or documentation, use the global humanizer instruction when available.


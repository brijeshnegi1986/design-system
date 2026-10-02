# JeshApps Design System

## Purpose

This repository is the shared design system for projects inside `~/JeshApps`.

It is the single source of truth for:

* Design tokens
* Brand tokens
* Semantic color modes
* Component tokens
* Spacing
* Radius
* Typography
* Shared UI components
* Design-system documentation

## Source of Truth

Figma is the design-authoring source.

This repository is the engineering source of truth.

The intended flow is:

```text
Figma
→ exported design tokens
→ import script
→ normalised repository tokens
→ Style Dictionary
→ generated distribution output
→ consuming projects
```

Do not manually duplicate design-system tokens inside individual projects when an equivalent token exists here.

## Current Figma Source

Primary Figma file:

**Design System Version 1.0**

Only use the approved Design System Version 1.0 file as the current design reference unless explicitly instructed otherwise.

## Token Architecture

The design system uses seven Figma token collections:

1. Primitives
2. Brands
3. Typography
4. Semantics
5. Components
6. Spacing
7. Radius

Tokens are organised into:

* `tokens/primitives/`

  * Raw foundational values such as color scales.

* `tokens/brands/`

  * Brand-specific design tokens.
  * Preserves all Figma Brand modes.
  * Current modes:

    * `Default`
    * `Jeshnegi.com`
    * `Negiflow.com`
    * `FortressMinds`

* `tokens/typography/`

  * Typography tokens.
  * Preserves all Figma Typography modes.
  * Current modes:

    * `Default`
    * `Jeshnegi.com`
    * `Negiflow.com`
    * `FortressMinds`

* `tokens/semantics/`

  * Meaning-based tokens.
  * Supports Light and Dark modes.

* `tokens/component/`

  * Component-specific tokens and states.

* `tokens/spacing/`

  * Spacing scale.

* `tokens/radius/`

  * Border-radius scale.

Do not change the token hierarchy or arbitrarily select a single Brand or Typography mode.

## Brands

Brand-specific design tokens are defined in the Figma `Brands` collection and imported under:

`tokens/brands/`

The current Brand modes are:

* `Default`
* `Jeshnegi.com`
* `Negiflow.com`
* `FortressMinds`

Brand tokens must remain mode-aware and must not be hard-coded into consuming projects.

Do not create a separate root-level `brands/` directory for brand tokens.

If brand-specific implementation configuration is required in the future, it must remain separate from the Figma-derived token source.

## Figma Imports

Figma exports are kept under:

`docs/figma-export/`

The import process must be repeatable.

Do not manually modify generated Figma export files.

Normalised token files under `tokens/` are generated from those exports.

The importer must:

* Preserve the Figma token hierarchy.
* Preserve aliases and references.
* Remove Figma-specific `$extensions` from runtime token data.
* Preserve all defined modes.
* Never replace an alias with a manually copied value.
* Never hard-code individual token names or values.

## Consuming Projects

Projects inside `~/JeshApps` should consume this design system rather than independently recreating:

* Colors
* Semantic colors
* Spacing
* Radius
* Typography
* Component tokens
* Shared components

Current consuming projects may include:

* Stakemate
* NegiFlow
* NegiFlow Platform
* JeshNegi
* Customer Feedback Intelligence

Each project may have its own product requirements, but shared visual foundations should come from this design system.

## Platform Differences

The design system must support different implementation platforms.

Examples:

* Web / Next.js
* React Native / Expo
* Future platforms

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

Do not introduce arbitrary colors into consuming projects without documenting why they cannot use an existing token.

## Light and Dark Modes

Semantic color tokens support:

* Light
* Dark

Consuming applications should use semantic tokens rather than hard-coded mode-specific colors.

## Components

Shared components live under:

`components/`

Components must consume design tokens rather than hard-coded visual values wherever practical.

Component-specific design tokens belong under:

`tokens/component/`

Do not mix component implementation code with token source files.

## Packages

`packages/` is reserved for distributable platform-specific design-system packages.

Potential future packages may include:

* React / web
* React Native / Expo
* Other supported platforms

Do not create platform packages until the component architecture requires them.

## Changes

Before changing an existing token:

1. Check its Figma definition.
2. Check where the token is used.
3. Determine whether the change affects Light, Dark, Components, Brands, or Typography.
4. Update the source/import process where appropriate.
5. Run validation.
6. Run the distribution build.
7. Document breaking changes.

Do not silently rename or delete established tokens.

## Generated Files

Generated outputs must be reproducible from source tokens.

The current generated distribution is:

```text
dist/tokens/tokens.json
dist/tokens/brands.json
dist/tokens/typography.json
```

`dist/` is intentionally gitignored.

Do not manually edit generated build output.

The existing `dist/tokens/tokens.json` contains the established five-collection bundle:

* Primitives
* Semantics
* Components
* Spacing
* Radius

Brands and Typography are distributed separately so their mode namespaces remain distinct.

The generation flow is:

```text
npm run tokens:import
npm run tokens:validate
npm run tokens:build
```

## Validation

Every token change must pass the repository validation checks before being consumed by projects.

Run:

```text
npm run tokens:validate
```

For the complete distribution build and validation:

```text
npm run tokens:build
```

Generated distribution files must not contain Figma `$extensions`.

Brand aliases must remain references and must resolve against the available primitive tokens.

## Git

This repository is independently version controlled.

Use meaningful commits.

Design-system changes should be versionable so consuming projects can update deliberately.

Do not commit generated `dist/` output unless explicitly required.

## Claude Code Rules

Before making changes:

1. Read this file.
2. Inspect the existing repository structure.
3. Preserve the token architecture.
4. Do not invent values that are not present in the design system.
5. Do not modify Figma-derived values without explicit instruction.
6. Prefer the smallest safe change.
7. Run relevant validation after changes.
8. Do not commit unless explicitly requested.

When generating user-facing copy or documentation, use the global humanizer instruction when available.

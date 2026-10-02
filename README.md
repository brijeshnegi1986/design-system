# JeshApps Design System

Shared design tokens and design-system foundations for projects inside `~/JeshApps`.

## Purpose

This repository provides a common source for:

* Primitive colour tokens
* Semantic Light and Dark colour tokens
* Component tokens
* Spacing
* Radius
* Brand configuration
* Figma-derived design-system documentation

The design-authoring source is Figma.

This repository is the engineering source of truth for the normalised tokens consumed by JeshApps projects.

## Repository Structure

```text
design-system/

├── brands/
├── docs/
│   └── figma-export/
├── scripts/
│   ├── import-figma-tokens.py
│   └── validate-tokens.py
├── tokens/
│   ├── primitives/
│   ├── brands/
│   ├── typography/
│   ├── semantics/
│   ├── component/
│   ├── spacing/
│   └── radius/
├── sd.config.mjs
├── package.json
└── CLAUDE.md
```

## Figma Source

The approved Figma design system is:

### Design System Version 1.0

The seven imported collections are Primitives, Brands, Typography, Semantics,
Components, Spacing, and Radius. Brand and Typography each preserve the modes
`Default`, `Jeshnegi.com`, `Negiflow.com`, and `FortressMinds`.

Figma is the design-authoring source.

Figma exports are stored under:

```text
docs/figma-export/
```

The exported Figma files are imported into the normalised token files under:

```text
tokens/
```

## When Figma Changes

When you update an existing variable, add a new variable, or add new component tokens in Figma:

1. Export the updated Figma variables/tokens.
2. Replace the relevant files under `docs/figma-export/`.
3. Run `npm run tokens:import`.
4. Validate the tokens with `npm run tokens:validate`.
5. Build and verify the complete distribution with `npm run tokens:build`.
6. Review the changes.
7. Commit and push the changes to GitHub.

The generated distribution includes:

```text
dist/tokens/tokens.json
dist/tokens/brands.json
dist/tokens/typography.json
```

`dist/tokens/tokens.json` is the existing five-collection bundle for
Primitives, Semantics, Components, Spacing, and Radius. Brands and Typography
are separate files, each with its collection namespace and all four modes.

The `dist/` directory is intentionally not committed to Git.

## Important

Do not manually edit the files generated from Figma.

If a token needs to change, change it in Figma and then repeat the import process.

Do not silently rename or delete existing tokens because consuming projects may already depend on them.

## Consuming Projects

Projects inside `~/JeshApps` should consume this design system rather than independently recreating:

* Colours
* Semantic colours
* Spacing
* Radius
* Component tokens

Current consuming projects may include:

* Stakemate
* NegiFlow
* NegiFlow Platform
* JeshNegi
* Customer Feedback Intelligence

## Light and Dark Modes

Semantic colour tokens support:

* Light
* Dark

Applications should use semantic tokens rather than hard-coded mode-specific colours.

## Design Principles

Prefer semantic tokens in application code.

For example:

```text
color.background.default
```

instead of:

```text
#F8FAFC
```

Primitive tokens should generally only be used when defining the design system itself or when no suitable semantic token exists.

## Versioning

This repository is independently version controlled.

Design-system changes should be committed with meaningful messages so consuming projects can update deliberately.

## Basic Commands

Import Figma tokens:

```bash
npm run tokens:import
```

Validate tokens:

```bash
npm run tokens:validate
```

Build distribution tokens:

```bash
npm run tokens:build
```

Check repository status:

```bash
git status
```

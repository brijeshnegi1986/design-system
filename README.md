# JeshApps Design System

Shared design system for projects inside `~/JeshApps`.

## What this is

This repository contains the shared design tokens and foundations used across
JeshApps projects.

The design system is authored in Figma and maintained in code through this
repository.

## Included

* Primitive colour tokens
* Semantic Light and Dark colour tokens
* Component tokens
* Spacing tokens
* Radius tokens
* Brand configuration
* Figma token exports

## Token Structure

```text
tokens/
├── primitives/
├── semantics/
├── component/
├── spacing/
└── radius/
```

## Figma Source

Current approved source:

**Design System Version 1.0**

Figma exports are stored in:

`docs/figma-export/`

## Projects

The design system is intended to be shared across projects in `~/JeshApps`,
including:

* StakeMate
* NegiFlow
* NegiFlow Platform
* JeshNegi
* Customer Feedback Intelligence

## Principles

Use the shared design system instead of recreating equivalent design values
inside individual projects.

Prefer semantic tokens over raw colour values.

Do not modify Figma-derived values without checking the approved Figma source.

## Status

Initial Figma-derived design token foundation.

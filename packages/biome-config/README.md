# `@hoite-dev/biome-config`

Shared Biome configuration package for the monorepo.

## Purpose

- Provide one reusable Biome base configuration for apps and packages.
- Keep linting and formatting behavior consistent across the repo.

## Package boundary

- Owns shared Biome config files and related package metadata.
- Does not own framework-specific lint setup beyond Biome.

## Usage

Extend this package from workspace-level `biome.json` files where needed.

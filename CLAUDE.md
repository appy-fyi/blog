# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Remotion (video creation in React) project generating video content for the blog at https://appy.fyi. Very early stage — starter template not yet customized.

## Commands

Use `bun`, not `npm`/`npx`, for installs and scripts (e.g. `bun install`, `bunx remotion render ...`).

- `bun run dev` — launch Remotion Studio (`remotion studio`)
- `bun run build` — bundle the project (`remotion bundle`)
- `bun run upgrade` — upgrade Remotion and related packages
- `bun run lint` — `eslint src && tsc` (lint + typecheck combined; no separate typecheck script)
- No `test` script exists.
- No `format` script exists — run `bunx prettier --write .` manually. Prettier config: `useTabs: false`, `tabWidth: 2`, `bracketSpacing: true`.
- Rendering a video is not a package.json script — use `bunx remotion render <composition-id> <output>` directly per README.

## Conventions

- Components are typed `React.FC<Props>` with `Props` as an inline `type` alias.
- `tsconfig.json` has `strict: true` and `noUnusedLocals: true`.
- Double-quote strings, semicolons, 2-space indent.

## Gotchas

- `remotion.config.ts` (enables the Rspack bundler and Tailwind v4 via `@remotion/tailwind-v4`'s `enableTailwind` override) is **not** read by `npx remotion render` / other Node APIs — that comment is at the top of the file. Pass equivalent options as CLI flags/API args when scripting renders.
- `tsconfig.json` excludes `remotion.config.ts` from type-checking scope.
- Tailwind v4 is wired through the Rspack bundler override, not a `tailwind.config.js`/PostCSS setup — no such files exist.
- `appy.svg` and `claude.svg` sit at the repo root rather than in `public/`; `public/` is currently empty. Static assets Remotion should load via `staticFile()` need to go in `public/`.

## Workflow

- `todo.txt` tracks pending work; the `/todo` slash command (`.claude/commands/todo.md`) picks the top actionable item, implements it, and moves it to a `Done:` section.
- No branching convention — commit directly to `main`.

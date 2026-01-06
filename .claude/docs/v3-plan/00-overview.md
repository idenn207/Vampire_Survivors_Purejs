# V3 Development Overview

## Project Goal

Build Vampire Survivors V3 using the `reference-framework` with ES6 modules, replacing the V2 IIFE pattern with modern JavaScript module architecture.

## Key Changes from V2

| Aspect | V2 | V3 |
|--------|----|----|
| Module System | IIFE + `window.VampireSurvivors` | ES6 `import`/`export` |
| Loading | Script tags in order | `<script type="module">` |
| Framework | Embedded in `src/` | External `reference-framework/` |
| Entry Point | `app.js` with namespace | `main.js` with imports |

## MVP Scope

The Minimum Viable Product includes:

1. **Player** - WASD/Arrow movement, 100 HP
2. **Weapon** - Auto-firing projectile targeting nearest enemy
3. **Enemies** - Spawn outside screen, chase player
4. **Combat** - Collision detection, damage system
5. **HUD** - Health bar display
6. **Game Over** - Death screen with restart

## Development Approach

- **Phase-based**: 6 phases from setup to complete MVP
- **Documented**: Each phase documented in `.claude/docs/v3-completion/`
- **Framework-first**: Leverage existing framework components
- **Minimal custom code**: Only build what framework doesn't provide

## Framework Repository

**Source:** https://github.com/idenn207/roguelike_framework.git

**Location:** `/workspaces/Vampire_Survivors_Purejs/reference-framework/`

## Document Navigation

| Document | Content |
|----------|---------|
| [01-mvp-features.md](./01-mvp-features.md) | MVP feature specifications |
| [02-project-structure.md](./02-project-structure.md) | File and folder structure |
| [03-development-phases.md](./03-development-phases.md) | Phase breakdown with milestones |
| [04-system-architecture.md](./04-system-architecture.md) | System design and priorities |
| [05-entity-components.md](./05-entity-components.md) | Entity and component specifications |
| [06-future-features.md](./06-future-features.md) | Post-MVP feature roadmap |

## Reference Documentation

Existing V3 reference docs in `.claude/docs/v3-reference/`:
- Architecture evolution guide
- Core systems documentation
- Framework usage guide
- Framework gap analysis

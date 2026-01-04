# V3 Reference Documentation Overview

This documentation provides context for developing V3 of Vampire Survivors using the `reference-framework`. It documents what was developed in V2, the purpose behind each decision, issues encountered, solutions implemented, and how the systems function.

## Project Summary

**Vampire Survivors** is a roguelike survival game built in **pure JavaScript** with Canvas 2D rendering. No build tools or bundlers - files are loaded directly via `<script>` tags or ES6 modules.

### Key Statistics

| Category | Count |
|----------|-------|
| Weapons | 110+ across 5 tiers |
| Tech Cores | 15 element-based |
| Enemy Types | 8+ with unique AI |
| Boss Tiers | 3 (Elite, Miniboss, Main Boss) |
| Attack Types | 8 (Projectile, Laser, Melee, Area, etc.) |
| Systems | 22 with priority 0-120 |
| Total Commits | 114 (Dec 22 - Jan 4, 2026) |

## Architecture At a Glance

### V2 (Current Implementation)
- **Module Pattern**: IIFE + Global Namespace (`window.VampireSurvivors`)
- **Loading**: Script tags in `index.html` in dependency order
- **Structure**: `src/` directory with core, systems, entities, components, data

### V3 (Target with reference-framework)
- **Module Pattern**: ES6 modules with `import`/`export`
- **Loading**: ES6 module resolution via `<script type="module">`
- **Structure**: Framework in `reference-framework/`, game code in separate directory

## Document Navigation

| Document | Purpose |
|----------|---------|
| [01-architecture-evolution.md](./01-architecture-evolution.md) | V2→V3 migration path, module patterns |
| [02-core-systems.md](./02-core-systems.md) | All 22 systems with priorities and purposes |
| [03-design-patterns.md](./03-design-patterns.md) | Registry+Aggregator, Behavior, Pool, Events |
| [04-issues-and-solutions.md](./04-issues-and-solutions.md) | Known issues from V2 and their resolutions |
| [05-framework-usage.md](./05-framework-usage.md) | How to use reference-framework for V3 |
| [06-code-conventions.md](./06-code-conventions.md) | Naming, file structure, best practices |
| [07-data-architecture.md](./07-data-architecture.md) | Registry/Aggregator pattern deep dive |
| [08-weapon-system.md](./08-weapon-system.md) | Attack types, targeting, behaviors |
| [09-framework-gaps.md](./09-framework-gaps.md) | Framework limitations and custom implementations needed |

## Quick Reference: Namespace Hierarchy (V2)

```javascript
window.VampireSurvivors = {
  Core:       // Game, EventBus, Time, Input, Camera
  Components: // Transform, Velocity, Health, Weapon, etc.
  Entities:   // Entity, Player, Enemy, Projectile, Pickup
  Systems:    // All 22 game systems
  Behaviors:  // Weapon behaviors (Projectile, Laser, Melee, etc.)
  Managers:   // EntityManager, BuffDebuffManager
  Data:       // WeaponData, EnemyData, BossData, TechCoreData
  Pool:       // projectilePool, pickupPool, etc.
  UI:         // HUD components, screens
  Utils:      // Vector2
  Debug:      // DebugPanel, DebugConsole
};
```

## Quick Reference: Framework Modules (V3)

```javascript
// Core
import { Game, EventBus, Time, Input, Camera } from './core/index.js';

// ECS
import { Entity, Component, System, EntityManager, World } from './ecs/index.js';

// Components
import { Transform, Velocity } from './components/index.js';

// Library Extensions
import { ObjectPool, StateMachine } from './lib/RF/core/index.js';
import { Health, Shield, Collider } from './lib/RF/components/index.js';
import { Registry } from './lib/RF/patterns/index.js';
```

## Development Timeline Highlights

| Date | Milestone |
|------|-----------|
| Dec 22 | Unified Buff/Debuff system |
| Dec 23 | Sprite/image support for all weapons |
| Dec 24 | Summon AI, self-destruct enemy improvements |
| Dec 28 | Tile-based background, Unity-style events |
| Dec 31 | Weapon catalog generator |
| Jan 1 | Class diagram visualization tool |
| Jan 3 | Framework extraction, call flow analyzer |
| Jan 4 | Framework submodule, v1 cleanup |

## How to Use This Documentation

1. **Starting V3 development**: Read [01-architecture-evolution.md](./01-architecture-evolution.md) first
2. **Understanding systems**: See [02-core-systems.md](./02-core-systems.md)
3. **Avoiding past mistakes**: Review [04-issues-and-solutions.md](./04-issues-and-solutions.md)
4. **Using the framework**: Follow [05-framework-usage.md](./05-framework-usage.md)
5. **Adding weapons**: Reference [08-weapon-system.md](./08-weapon-system.md)
6. **Planning custom features**: Check [09-framework-gaps.md](./09-framework-gaps.md) for what needs implementation

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vampire Survivors-inspired roguelike game built in **pure JavaScript** with Canvas 2D rendering. No build tools or bundlers - files are loaded via `<script>` tags in dependency order.

## Development

### Running

Open `index.html` directly in a browser, or use a local server:
```bash
npx http-server -p 8080 -o
```

### Debug Mode

Press **F3** to toggle debug panel (shows FPS, entity counts, collision info, console logs).

## Architecture

### Module Pattern: IIFE + Namespace

All code uses IIFE (Immediately Invoked Function Expression) with a global namespace:

```javascript
(function (Systems) {
  'use strict';
  // imports from namespace
  var Transform = window.VampireSurvivors.Components.Transform;

  class MySystem extends System { ... }

  Systems.MySystem = MySystem;
})(window.VampireSurvivors.Systems);
```

**Namespace hierarchy:**

- `VampireSurvivors.Core` - Game, EventBus, Time, Input, Camera
- `VampireSurvivors.Components` - Transform, Velocity, Sprite, Collider, Health, Weapon, etc.
- `VampireSurvivors.Entities` - Entity, Player, Enemy, Boss, Projectile, Pickup
- `VampireSurvivors.Systems` - All game systems
- `VampireSurvivors.Behaviors` - Weapon behaviors (ProjectileBehavior, LaserBehavior, etc.)
- `VampireSurvivors.Managers` - EntityManager, BlacklistManager
- `VampireSurvivors.Data` - WeaponData, WaveData, BossData, DropTable configs
- `VampireSurvivors.Pool` - Object pools (projectilePool, areaEffectPool, pickupPool)
- `VampireSurvivors.UI` - HUD components (StatusPanel, WeaponSlots, LevelUpScreen, etc.)
- `VampireSurvivors.Utils` - Vector2
- `VampireSurvivors.Debug` - DebugConfig, DebugPanel, DebugConsole, DebugManager

### ECS (Entity Component System)

- **Entity**: Container with unique ID, holds components via Map, supports tags
- **Component**: Pure data (Transform, Velocity, Sprite, Collider)
- **System**: Logic processors with priority-based execution order

**System priorities (lower = earlier):**
| Priority | System | Purpose |
|----------|--------|---------|
| 0 | BackgroundSystem | Draw grid |
| 4 | WaveSystem | Wave progression |
| 5 | PlayerSystem | Input → Velocity |
| 8 | EnemySystem | Spawn + AI |
| 8 | TraversalEnemySystem | Screen-crossing enemies |
| 8 | BossSystem | Boss spawning + patterns |
| 10 | MovementSystem | Velocity → Position |
| 15 | ProjectileSystem | Projectile lifecycle |
| 15 | AreaEffectSystem | Area damage zones |
| 20 | CollisionSystem | Detect collisions |
| 25 | CombatSystem | Damage dealing |
| 30 | DropSystem | Loot spawning |
| 35 | PickupSystem | Collect items |
| 40 | WeaponSystem | Fire weapons |
| 50 | CameraSystem | Follow player |
| 100 | RenderSystem | Draw entities |
| 110 | HUDSystem | UI overlay |
| 115 | LevelUpSystem | Level-up screen |
| 120 | GameOverSystem | Death screen |

### Weapon System (Behavior Pattern)

Weapons are data-driven via `src/data/WeaponData.js`. Each weapon has:
- `attackType`: PROJECTILE, LASER, MELEE_SWING, AREA_DAMAGE, PARTICLE
- `targetingMode`: NEAREST, RANDOM, MOUSE, ROTATING, CHAIN
- `isAuto`: true for auto-fire, false for manual (mouse click)

Weapon behaviors in `src/behaviors/` execute the attack logic based on type.

### Collision Layers (Bitmask)

```javascript
CollisionLayer.PLAYER = 1;   // 0b00001
CollisionLayer.ENEMY = 2;    // 0b00010
CollisionLayer.TERRAIN = 4;  // 0b00100
CollisionLayer.HITBOX = 8;   // 0b01000
CollisionLayer.PICKUP = 16;  // 0b10000
```

### Script Loading Order (index.html)

10 phases in strict dependency order. When adding new files:
1. Create file using IIFE pattern
2. Add `<script>` tag in `index.html` in correct phase
3. Register with namespace: `Namespace.ClassName = ClassName;`

## Code Conventions

### Naming

- Classes: `PascalCase`
- Methods: `camelCase` (verb-first: `getValue`, `setPlayer`)
- Constants: `UPPER_SNAKE_CASE`
- Private members: `_leadingUnderscore`
- Booleans: `is/has/can/should` prefix
- Event handlers: `handle` prefix

### File Structure

```javascript
/**
 * @fileoverview Description
 * @module ModuleName
 */
(function (Namespace) {
  'use strict';

  // ============================================
  // Imports
  // ============================================

  // ============================================
  // Constants
  // ============================================

  // ============================================
  // Class Definition
  // ============================================
  class ClassName {
    // Static Properties
    // Instance Properties (private: _underscore)
    // Constructor
    // Public Methods
    // Private Methods
    // Getters / Setters
    // Lifecycle (dispose)
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Namespace.ClassName = ClassName;
})(window.VampireSurvivors.Namespace);
```

### Event Bus Usage

```javascript
var events = window.VampireSurvivors.Core.events;
events.on('collision:detected', function(collision) { ... });
events.emit('player:damaged', { amount: 10 });
```

## Key Files

- `src/app.js` - Entry point, wires systems and creates player
- `src/core/Game.js` - Game loop, state management
- `src/managers/EntityManager.js` - Entity creation/querying
- `src/entities/Entity.js` - Base entity class with component/tag system
- `src/data/WeaponData.js` - All weapon definitions and stats
- `src/data/WaveData.js` - Enemy wave configurations
- `src/systems/WeaponSystem.js` - Weapon firing orchestration

## Project Versions

- `src/` - Current v2 (simplified ECS)
- `v1/` - Archived v1 (more complex, includes weapons/pools/scenes)

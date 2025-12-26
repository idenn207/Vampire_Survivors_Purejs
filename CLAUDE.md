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
| 1 | CoreSelectionSystem | Tech core selection at start |
| 4 | WaveSystem | Wave progression |
| 5 | PlayerSystem | Input → Velocity |
| 6 | StatusEffectSystem | Apply buffs/debuffs |
| 8 | EnemySystem | Spawn + AI |
| 8 | TraversalEnemySystem | Screen-crossing enemies |
| 8 | BossSystem | Boss spawning + patterns |
| 10 | MovementSystem | Velocity → Position |
| 15 | ProjectileSystem | Projectile lifecycle |
| 15 | AreaEffectSystem | Area damage zones |
| 15 | MineSystem | Deployable mines |
| 15 | SummonSystem | Summoned minions |
| 20 | CollisionSystem | Detect collisions |
| 25 | CombatSystem | Damage dealing |
| 30 | DropSystem | Loot spawning |
| 35 | PickupSystem | Collect items |
| 40 | WeaponSystem | Fire weapons |
| 50 | CameraSystem | Follow player |
| 100 | RenderSystem | Draw entities |
| 110 | HUDSystem | UI overlay |
| 112 | TechTreeSystem | Tech progression UI |
| 115 | LevelUpSystem | Level-up screen |
| 116 | TabScreenSystem | Stats/evolution tabs (Tab key) |
| 120 | GameOverSystem | Death screen |

### Weapon System (Behavior Pattern)

Weapons are data-driven with modular file structure:
- Individual weapon files in `src/data/weapons/basic/` (common, uncommon, rare, epic)
- Core weapon chains in `src/data/weapons/core/` (evolved weapons tied to tech cores)
- `WeaponAggregator.js` merges all weapons into `Data.WeaponData`

Each weapon has:
- `attackType`: PROJECTILE, LASER, MELEE_SWING, AREA_DAMAGE, PARTICLE, MINE, SUMMON
- `targetingMode`: NEAREST, RANDOM, MOUSE, ROTATING, CHAIN
- `isAuto`: true for auto-fire, false for manual (mouse click)
- `tier`: 1-5 (common → legendary), affects stat multipliers

Weapon behaviors in `src/behaviors/` execute the attack logic based on type.

### Tech Core System

15 element-based cores in `src/data/techcores/`. Each core:
- Grants a starting weapon and evolution chain (up to 5 tiers)
- Provides tech abilities with 10 levels each
- Uses `TechCoreAggregator.js` to merge into `Data.TechCoreData`

### Collision Layers (Bitmask)

```javascript
CollisionLayer.PLAYER = 1;   // 0b00001
CollisionLayer.ENEMY = 2;    // 0b00010
CollisionLayer.TERRAIN = 4;  // 0b00100
CollisionLayer.HITBOX = 8;   // 0b01000
CollisionLayer.PICKUP = 16;  // 0b10000
```

### Registry + Aggregator Pattern

All data types follow a consistent pattern:
1. **Registry file** defines `Data.<Type>Registry = {}` and constants
2. **Individual files** add entries: `Data.<Type>Registry[id] = { ... }`
3. **Aggregator file** merges registry into final data: `Data.<Type>Data`

Examples:
- Weapons: `WeaponRegistry` → `WeaponAggregator.js` → `Data.WeaponData`
- Enemies: `EnemyRegistry` → `EnemyAggregator.js` → `Data.EnemyData`
- Tech Cores: `TechCoreRegistry` → `TechCoreAggregator.js` → `Data.TechCoreData`

### Script Loading Order (index.html)

10 phases in strict dependency order. When adding new files:
1. Create file using IIFE pattern
2. Add `<script>` tag in `index.html` in correct phase
3. Register with namespace: `Namespace.ClassName = ClassName;`

### Adding New Weapons

1. Create weapon file in appropriate folder (`src/data/weapons/basic/<rarity>/`)
2. Register to `Data.WeaponRegistry[weaponId] = { ... }`
3. Add `<script>` tag in index.html **before** WeaponAggregator.js
4. Aggregator auto-merges into WeaponData on load

### Adding New Enemies

1. Create enemy file in `src/data/enemies/`
2. Register to `Data.EnemyRegistry[enemyId] = { ... }`
3. Add `<script>` tag before EnemyAggregator.js

### Adding New Bosses

1. Create boss file in `src/data/bosses/`
2. Register to `Data.BossRegistry[bossId] = { ... }` with phases and attacks
3. Add `<script>` tag before BossAggregator.js

### Adding New Summons

1. Create summon file in `src/data/summons/`
2. Register to `Data.SummonRegistry[summonId] = { ... }`
3. Add `<script>` tag before SummonAggregator.js

### Adding New Buff/Debuffs

1. Create effect file in `src/data/buffdebuff/effects/buffs/` or `effects/debuffs/`
2. Register to `Data.BuffDebuffRegistry[effectId] = { ... }`
3. Add `<script>` tag before BuffDebuffAggregator.js

### Adding New Tech Cores

1. Create core file in `src/data/techcores/`
2. Register to `Data.TechCoreRegistry[coreId] = { ... }` with tree structure
3. Add `<script>` tag before TechCoreAggregator.js

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

**Core:**
- `src/app.js` - Entry point, wires systems and creates player
- `src/core/Game.js` - Game loop, state management
- `src/managers/EntityManager.js` - Entity creation/querying
- `src/entities/Entity.js` - Base entity class with component/tag system

**Data Aggregators:**
- `src/data/weapons/WeaponAggregator.js` - Merges all weapon files into WeaponData
- `src/data/weapons/core/CoreWeaponAggregator.js` - Merges core weapons
- `src/data/weapons/core/EvolvedAggregator.js` - Merges evolved weapons
- `src/data/techcores/TechCoreAggregator.js` - Merges all tech core files
- `src/data/enemies/EnemyAggregator.js` - Merges enemy types
- `src/data/bosses/BossAggregator.js` - Merges boss definitions
- `src/data/summons/SummonAggregator.js` - Merges summon types
- `src/data/buffdebuff/BuffDebuffAggregator.js` - Merges buff/debuff effects

**Game Config:**
- `src/data/WeaponTierData.js` - Tier multipliers and evolution recipes
- `src/data/WaveData.js` - Enemy wave configurations
- `src/data/CharacterData.js` - Playable character definitions
- `src/data/ActiveSkillData.js` - Character active skills

**Combat:**
- `src/systems/WeaponSystem.js` - Weapon firing orchestration
- `src/systems/combat/CombatSystem.js` - Damage dealing and effects
- `src/systems/combat/DamageProcessor.js` - Damage calculation
- `src/systems/levelup/LevelUpSystem.js` - Level-up logic and upgrades

## Project Versions

- `src/` - Current v2 (simplified ECS)
- `v1/` - Archived v1 (more complex, includes weapons/pools/scenes)

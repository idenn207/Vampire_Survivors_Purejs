# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vampire Survivors-inspired roguelike game built in **pure JavaScript** with Canvas 2D rendering. No build tools or bundlers - files are loaded via `<script>` tags in dependency order.

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
- `VampireSurvivors.Components` - Transform, Velocity, Sprite, Collider
- `VampireSurvivors.Entities` - Entity, Player, Enemy
- `VampireSurvivors.Systems` - All game systems
- `VampireSurvivors.Managers` - EntityManager
- `VampireSurvivors.Utils` - Vector2
- `VampireSurvivors.Debug` - Debug tools

### ECS (Entity Component System)

- **Entity**: Container with unique ID, holds components via Map, supports tags
- **Component**: Pure data (Transform, Velocity, Sprite, Collider)
- **System**: Logic processors with priority-based execution order

**System priorities (lower = earlier):**
| Priority | System | Purpose |
|----------|--------|---------|
| 0 | BackgroundSystem | Draw grid |
| 5 | PlayerSystem | Input → Velocity |
| 8 | EnemySystem | Spawn + AI |
| 10 | MovementSystem | Velocity → Position |
| 20 | CollisionSystem | Detect collisions |
| 50 | CameraSystem | Follow player |
| 100 | RenderSystem | Draw entities |

### Collision Layers (Bitmask)

```javascript
CollisionLayer.PLAYER = 1; // 0b00001
CollisionLayer.ENEMY = 2; // 0b00010
CollisionLayer.TERRAIN = 4; // 0b00100
CollisionLayer.HITBOX = 8; // 0b01000
CollisionLayer.PICKUP = 16; // 0b10000
```

### Script Loading Order (index.html)

10 phases in strict dependency order:

1. Namespace initialization
2. Utilities (Vector2)
3. Core (EventBus, Time, Input, Game)
4. Components
5. Entities
6. Managers
7. Systems
8. Camera
9. Debug
10. Entry point (app.js)

## Development

### Running

Open `index.html` in a browser. No build step required.

### Debug Mode

Press **F3** to toggle debug panel (shows FPS, entity counts, collision info).

### Adding New Files

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

- `src/app.js` - Entry point, wires up all systems
- `src/core/Game.js` - Game loop, state management
- `src/managers/EntityManager.js` - Entity creation/querying
- `src/entities/Entity.js` - Base entity class with component/tag system

## Project Versions

- `src/` - Current v2 (simplified ECS)
- `v1/` - Archived v1 (more complex, includes weapons/pools/scenes)

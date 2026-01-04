# Architecture Evolution: V2 → V3

This document describes the architectural differences between V2 (current implementation) and V3 (using reference-framework), and provides a migration path.

## V2 Architecture (Current)

### What Was Developed
IIFE (Immediately Invoked Function Expression) with a global namespace pattern for all game code.

### Purpose
- No build tools required - works directly in browser
- Clear dependency management via script loading order
- Single global namespace prevents pollution
- Encapsulation within IIFE scope

### Module Pattern

```javascript
/**
 * @fileoverview Description
 * @module ModuleName
 */
(function (Namespace) {
  'use strict';

  // ============================================
  // Imports from namespace
  // ============================================
  var Transform = window.VampireSurvivors.Components.Transform;
  var events = window.VampireSurvivors.Core.events;

  // ============================================
  // Class Definition
  // ============================================
  class MySystem extends System {
    constructor() {
      super();
      this._priority = 10;
    }

    update(deltaTime) {
      // System logic
    }
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Namespace.MySystem = MySystem;

})(window.VampireSurvivors.Systems);
```

### Script Loading Order

Scripts must load in dependency order in `index.html`:

```
Phase 1: Namespace initialization (inline script)
Phase 2: Utilities (Vector2, GlobalStatsHelper)
Phase 3: Object Pool base class
Phase 4: Core systems (EventBus, Time, Input, Game)
Phase 5: Components (all pure data)
Phase 6: Data constants and configs
Phase 7: Entity base classes
Phase 8: Specific object pools
Phase 9: Data files (weapons, enemies, bosses) + Aggregators
Phase 10: Behaviors, Systems, Managers, UI
Phase 11: Entry point (app.js)
```

### Issues Encountered
1. **Manual dependency tracking**: Adding new files requires finding correct position in index.html
2. **No tree-shaking**: All code loads even if unused
3. **Global state**: Namespace pollution possible if not careful
4. **Circular dependencies**: Hard to detect, cause undefined imports

### How It Functions Now
- All code under `window.VampireSurvivors.*` namespace
- 10 phases of script loading in index.html
- Works in any browser without build tools

---

## V3 Architecture (Target)

### What Will Be Developed
ES6 modules with `import`/`export` syntax using the reference-framework.

### Purpose
- Modern JavaScript standard
- Automatic dependency resolution
- Better IDE support (autocomplete, go-to-definition)
- Potential for bundling/tree-shaking if needed

### Module Pattern

```javascript
/**
 * @fileoverview Description
 * @module ModuleName
 */
import { System } from './ecs/System.js';
import { Transform } from './components/Transform.js';
import { events } from './core/EventBus.js';

// ============================================
// Class Definition
// ============================================
export class MySystem extends System {
  constructor() {
    super();
    this._priority = 10;
  }

  update(deltaTime) {
    // System logic
  }
}
```

### Module Organization

```
reference-framework/
├── core/           # Game, EventBus, Time, Input, Camera
│   └── index.js    # Barrel export
├── ecs/            # Entity, Component, System, EntityManager, World
│   └── index.js
├── components/     # Transform, Velocity
│   └── index.js
├── utils/          # Vector2
│   └── index.js
└── lib/RF/         # Extended utilities
    ├── core/       # ObjectPool, StateMachine, Timer
    ├── math/       # MathUtils, Random, Collision
    ├── physics/    # CollisionLayers, Targeting
    ├── patterns/   # Registry, Behavior
    ├── components/ # Health, Shield, Collider, Sprite
    ├── behaviors/  # Weapon and Enemy behaviors
    ├── ui/         # UIComponent, Bar, Modal
    └── debug/      # DebugPanel, DebugConsole
```

### Barrel Exports

Each directory has an `index.js` that re-exports all modules:

```javascript
// core/index.js
export { Game } from './Game.js';
export { EventBus, events } from './EventBus.js';
export { Time } from './Time.js';
export { Input } from './Input.js';
export { Camera } from './Camera.js';
```

Usage:
```javascript
import { Game, EventBus, Time } from './core/index.js';
```

---

## Migration Path

### Step 1: Convert IIFE to ES6 Module

**Before (V2):**
```javascript
(function (Systems) {
  'use strict';
  var Transform = window.VampireSurvivors.Components.Transform;

  class MovementSystem extends System { ... }

  Systems.MovementSystem = MovementSystem;
})(window.VampireSurvivors.Systems);
```

**After (V3):**
```javascript
import { System } from '../ecs/System.js';
import { Transform } from '../components/Transform.js';

export class MovementSystem extends System { ... }
```

### Step 2: Replace Namespace Imports

| V2 Import | V3 Import |
|-----------|-----------|
| `window.VampireSurvivors.Core.Game` | `import { Game } from './core/Game.js'` |
| `window.VampireSurvivors.Components.Transform` | `import { Transform } from './components/Transform.js'` |
| `window.VampireSurvivors.Core.events` | `import { events } from './core/EventBus.js'` |

### Step 3: Use Framework Base Classes

**V2:** Custom base classes in `src/core/`, `src/entities/`, etc.
**V3:** Use framework classes:

```javascript
import { Entity, Component, System } from './ecs/index.js';
import { World } from './ecs/World.js';
```

### Step 4: Adopt Registry Pattern from Framework

**V2:** Custom aggregators per data type
**V3:** Use generic Registry class:

```javascript
import { Registry } from './lib/RF/patterns/Registry.js';

const weaponRegistry = new Registry();
weaponRegistry.register('fireball', { damage: 10, cooldown: 0.5 });
const weapon = weaponRegistry.get('fireball');
```

### Step 5: Update HTML Entry Point

**V2:**
```html
<script src="src/core/Game.js"></script>
<script src="src/systems/MovementSystem.js"></script>
<!-- ... 100+ script tags ... -->
<script src="src/app.js"></script>
```

**V3:**
```html
<script type="module" src="main.js"></script>
```

---

## Key Differences Summary

| Aspect | V2 (IIFE+Namespace) | V3 (ES6 Modules) |
|--------|---------------------|------------------|
| Module syntax | `(function(NS) { ... })(window.X)` | `import`/`export` |
| Dependencies | Script order in HTML | Import statements |
| Namespace | `window.VampireSurvivors.*` | None (module scope) |
| Build tools | None required | None (or optional bundler) |
| Browser support | All browsers | Modern browsers |
| IDE support | Limited | Full |
| Circular deps | Runtime errors | Import errors |

## Recommended Approach for V3

1. **Keep framework as submodule** (`reference-framework/`)
2. **Create game code in separate directory** (`game/` or `src/`)
3. **Import from framework** using relative paths
4. **Use Registry pattern** for all game data (weapons, enemies, etc.)
5. **Extend framework behaviors** for game-specific attack types

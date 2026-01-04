# Code Conventions

This document defines coding standards for V3 development, based on patterns established in V2.

## Naming Conventions

### Classes
```javascript
// PascalCase
class PlayerSystem { }
class WeaponBehavior { }
class HealthComponent { }
```

### Methods and Functions
```javascript
// camelCase, verb-first
function calculateDamage() { }
function getPlayerPosition() { }
function setVelocity() { }
function hasComponent() { }
function isAlive() { }
```

### Constants
```javascript
// UPPER_SNAKE_CASE
const MAX_ENEMIES = 100;
const DEFAULT_SPEED = 200;
const COLLISION_LAYER_PLAYER = 1;
```

### Private Members
```javascript
class MyClass {
  // Leading underscore for private
  _privateField = null;
  _internalState = {};

  _privateMethod() { }
}
```

### Booleans
```javascript
// is/has/can/should prefix
let isVisible = true;
let hasWeapon = false;
let canMove = true;
let shouldUpdate = false;
```

### Event Handlers
```javascript
// handle prefix
handleClick() { }
handleKeyDown(event) { }
handleCollision(entityA, entityB) { }
```

### Callbacks
```javascript
// on prefix for callback parameters
constructor({ onComplete, onError, onChange }) { }
```

---

## File Structure Template

```javascript
/**
 * @fileoverview Brief description of the file
 * @module ModuleName
 */

// ============================================
// Imports
// ============================================
import { System } from '../ecs/System.js';
import { Transform, Velocity } from '../components/index.js';
import { events } from '../core/EventBus.js';

// ============================================
// Constants
// ============================================
const DEFAULT_SPEED = 200;
const MAX_VELOCITY = 500;

// ============================================
// Class Definition
// ============================================
/**
 * Brief class description.
 */
export class MovementSystem extends System {
  // ----------------------------------------
  // Static Properties
  // ----------------------------------------
  static instanceCount = 0;

  // ----------------------------------------
  // Instance Properties
  // ----------------------------------------
  _speed = DEFAULT_SPEED;
  _isEnabled = true;

  // ----------------------------------------
  // Constructor
  // ----------------------------------------
  constructor(options = {}) {
    super();
    this._priority = 10;
    this._speed = options.speed || DEFAULT_SPEED;
  }

  // ----------------------------------------
  // Public Methods
  // ----------------------------------------
  update(deltaTime) {
    // Implementation
  }

  setSpeed(speed) {
    this._speed = Math.min(speed, MAX_VELOCITY);
  }

  // ----------------------------------------
  // Private Methods
  // ----------------------------------------
  _applyMovement(entity, deltaTime) {
    // Internal logic
  }

  // ----------------------------------------
  // Event Handlers
  // ----------------------------------------
  _handlePlayerInput(data) {
    // Handle event
  }

  // ----------------------------------------
  // Getters / Setters
  // ----------------------------------------
  get speed() {
    return this._speed;
  }

  set speed(value) {
    this._speed = value;
  }

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  dispose() {
    this._speed = 0;
    super.dispose();
  }
}
```

---

## Component Guidelines

### Pure Data Only
Components should be pure data containers with no game logic.

```javascript
// GOOD: Pure data with computed getters
export class Health extends Component {
  constructor(max) {
    super();
    this._max = max;
    this._current = max;
  }

  // Computed getters are OK
  get percentage() {
    return this._current / this._max;
  }

  get isDead() {
    return this._current <= 0;
  }
}

// BAD: Logic in component
export class Health extends Component {
  takeDamage(amount) {  // NO! This belongs in CombatSystem
    this._current -= amount;
    if (this._current <= 0) {
      this.entity.die();  // NO! Systems should handle this
    }
  }
}
```

### Entity Back-Reference
Components automatically get a reference to their entity.

```javascript
class MyComponent extends Component {
  doSomething() {
    // Access owning entity
    const transform = this.entity.getComponent(Transform);
  }
}
```

### Dispose Pattern
Always implement `dispose()` for cleanup.

```javascript
export class Weapon extends Component {
  dispose() {
    this._projectilePool = null;
    this._targets = [];
    super.dispose();
  }
}
```

### Debug Support
Optionally implement `getDebugEntries()` for debug panel display.

```javascript
export class Health extends Component {
  getDebugEntries() {
    return [
      { label: 'HP', value: `${this._current}/${this._max}` },
      { label: '%', value: (this.percentage * 100).toFixed(1) + '%' }
    ];
  }
}
```

---

## System Guidelines

### Single Responsibility
Each system should have one clear purpose.

```javascript
// GOOD: Focused systems
class MovementSystem { }      // Only handles position updates
class CollisionSystem { }     // Only handles collision detection
class CombatSystem { }        // Only handles damage processing

// BAD: God system
class GameLogicSystem { }     // Does everything
```

### Priority Selection
Choose priority based on execution order needs.

| Priority Range | Purpose |
|---------------|---------|
| 0-4 | Initialization, background |
| 5-9 | Input processing, AI decisions |
| 10-19 | Physics, movement |
| 20-29 | Collision detection |
| 30-49 | Combat, damage, spawning |
| 50-99 | Camera, effects |
| 100+ | Rendering, UI |

### Query by Components
Query entities by components, not by specific entity types.

```javascript
// GOOD: Component-based query
const movables = entityManager.getWithComponents(Transform, Velocity);

// OK: Tag-based query when appropriate
const enemies = entityManager.getByTag('enemy');

// BAD: Type checking
const enemies = entityManager.getAll().filter(e => e instanceof Enemy);
```

### Event Communication
Use events for cross-system communication.

```javascript
// GOOD: Event-based
events.emit('player:damaged', { amount: 10, source: enemy });

// BAD: Direct reference
hudSystem.updateHealthBar(player.health);
```

---

## Event Naming

### Format
```
namespace:action
```

### Examples
```javascript
// Entity events
'entity:created'
'entity:destroyed'
'entity:removed'

// Player events
'player:created'
'player:damaged'
'player:healed'
'player:died'
'player:level_up'

// Weapon events
'weapon:fired'
'weapon:hit'
'weapon:equipped'
'weapon:upgraded'

// Game state
'game:started'
'game:paused'
'game:resumed'
'game:over'

// Screen management
'screen:opened'
'screen:closed'
'screen:suspended'
'screen:requestOpen'
'screen:requestResume'

// Status effects
'status:effect_applied'
'status:effect_removed'
'status:dot_damage'
```

---

## Import Conventions

### Prefer Barrel Imports
```javascript
// GOOD: Barrel import
import { Game, EventBus, Time } from './core/index.js';

// OK: Direct import when specific
import { Vector2 } from './utils/Vector2.js';
```

### Order of Imports
```javascript
// 1. Framework core
import { Game, events } from './core/index.js';
import { Entity, System } from './ecs/index.js';

// 2. Framework components
import { Transform, Velocity } from './components/index.js';

// 3. Framework utilities
import { ObjectPool } from './lib/RF/core/ObjectPool.js';

// 4. Game-specific imports
import { Player } from '../entities/Player.js';
import { WeaponData } from '../data/weapons.js';
```

### Always Include .js Extension
```javascript
// GOOD
import { Game } from './core/Game.js';

// BAD (won't work in browser)
import { Game } from './core/Game';
```

---

## Data Definition Conventions

### Registry Pattern
```javascript
// Use Registry for game data
const weaponRegistry = new Registry();

weaponRegistry.register('fireball', {
  id: 'fireball',           // Always include id matching key
  name: 'Fireball',         // Display name
  // ... other properties
});
```

### Required Fields
Always validate required fields:
```javascript
function validateWeapon(weapon) {
  const required = ['id', 'name', 'damage', 'cooldown', 'attackType'];
  for (const field of required) {
    if (!(field in weapon)) {
      console.warn(`Weapon ${weapon.id} missing required field: ${field}`);
    }
  }
}
```

---

## Error Handling

### Fail Fast with Clear Messages
```javascript
// GOOD
if (!entity) {
  throw new Error('Entity is required for MovementSystem');
}

// GOOD: Warn but continue
if (!target) {
  console.warn('No target found for projectile, using default direction');
  return Vector2.normalize({ x: 1, y: 0 });
}
```

### Use Console Appropriately
```javascript
console.log()    // Development debugging only
console.info()   // Important state changes
console.warn()   // Recoverable issues
console.error()  // Critical failures
```

---

## Documentation

### JSDoc for Public APIs
```javascript
/**
 * Applies damage to an entity's Health component.
 *
 * @param {Entity} entity - The entity to damage
 * @param {number} amount - Damage amount (positive number)
 * @param {Object} [options] - Optional parameters
 * @param {boolean} [options.isCritical=false] - Whether this is critical damage
 * @param {Entity} [options.source] - The entity that caused the damage
 * @returns {number} Actual damage dealt (after resistances)
 * @throws {Error} If entity has no Health component
 */
function applyDamage(entity, amount, options = {}) { }
```

### Inline Comments
```javascript
// Use sparingly for non-obvious code
const mask = CollisionLayers.ENEMY | CollisionLayers.PICKUP;  // Player collides with these

// Explain "why", not "what"
// Clamp to prevent spiral of death when tab is backgrounded
deltaTime = Math.min(deltaTime, MAX_DELTA);
```

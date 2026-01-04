# Framework Usage Guide

This document explains how to use the `reference-framework` for V3 development.

## Framework Overview

The reference-framework is a modular ECS game framework extracted from V2. It provides:

- **Core**: Game loop, EventBus, Time, Input, Camera
- **ECS**: Entity, Component, System, EntityManager, World
- **Components**: Transform, Velocity (base), plus library extensions
- **Utilities**: Vector2, ObjectPool, StateMachine, Timer
- **Patterns**: Registry, Behavior base classes
- **UI**: UIComponent, Bar, Modal, FloatingEffect

### Key Differences from V2

| Aspect | V2 | Framework |
|--------|-----|-----------|
| Module system | IIFE + Namespace | ES6 modules |
| Namespace | `window.VampireSurvivors` | Import statements |
| Game-specific code | Mixed in | Extracted to `/reference` |

---

## Getting Started

### 1. Setup

```bash
# Clone or copy framework
git submodule add <framework-url> reference-framework

# Start local server (required for ES6 modules)
npx http-server -p 8080 -o
```

### 2. Create Entry Point

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
  <style>
    canvas { display: block; margin: auto; }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>
  <script type="module" src="main.js"></script>
</body>
</html>
```

### 3. Initialize Game

```javascript
// main.js
import { Game, Time, Input, Camera, events } from './reference-framework/core/index.js';
import { World } from './reference-framework/ecs/World.js';

// Create world (wires Game, EntityManager, etc.)
const world = new World({
  canvas: document.getElementById('gameCanvas'),
  width: 800,
  height: 600
});

// Add systems
import { PlayerSystem } from './systems/PlayerSystem.js';
import { RenderSystem } from './systems/RenderSystem.js';

world.addSystem(new PlayerSystem());
world.addSystem(new RenderSystem());

// Start game
world.start();
```

---

## Module Import Guide

### Core Modules

```javascript
// All core modules
import { Game, EventBus, events, Time, Input, Camera } from './reference-framework/core/index.js';

// Or individual files
import { Game } from './reference-framework/core/Game.js';
import { events } from './reference-framework/core/EventBus.js';
```

### ECS Modules

```javascript
// All ECS modules
import { Entity, Component, System, EntityManager, QueryManager, World } from './reference-framework/ecs/index.js';

// Query entities
const enemies = entityManager.getByTag('enemy');
const movables = entityManager.getWithComponents(Transform, Velocity);
```

### Base Components

```javascript
import { Transform, Velocity } from './reference-framework/components/index.js';
```

### Library Extensions

```javascript
// Core utilities
import { ObjectPool, StateMachine, Cooldown, Duration, Interval, CooldownManager }
  from './reference-framework/lib/RF/core/index.js';

// Math utilities
import { MathUtils, Random, Collision }
  from './reference-framework/lib/RF/math/index.js';

// Physics
import { CollisionLayers, Targeting }
  from './reference-framework/lib/RF/physics/index.js';

// Patterns
import { Registry, Behavior, WeaponBehavior, EnemyBehavior }
  from './reference-framework/lib/RF/patterns/index.js';

// Extended components
import { Health, Shield, Collider, Sprite, BuffDebuff, Lifetime }
  from './reference-framework/lib/RF/components/index.js';

// Enemy behaviors
import { ChaseEnemyBehavior, CircleEnemyBehavior, FleeEnemyBehavior }
  from './reference-framework/lib/RF/behaviors/index.js';

// Weapon behaviors
import { ProjectileBehavior, LaserBehavior, MeleeBehavior, AreaBehavior }
  from './reference-framework/lib/RF/behaviors/index.js';

// UI components
import { UIComponent, WorldSpaceUI, FloatingEffect, Bar, Modal }
  from './reference-framework/lib/RF/ui/index.js';

// Debug
import { DebugConfig, DebugConsole, DebugPanel }
  from './reference-framework/lib/RF/debug/index.js';
```

---

## Creating Custom Entities

```javascript
import { Entity } from './reference-framework/ecs/Entity.js';
import { Transform, Velocity } from './reference-framework/components/index.js';
import { Health, Collider, Sprite } from './reference-framework/lib/RF/components/index.js';
import { CollisionLayers } from './reference-framework/lib/RF/physics/CollisionLayers.js';

export class Player extends Entity {
  constructor(x, y) {
    super();

    // Add components
    this.addComponent(new Transform(x, y, 32, 32));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Health(100));
    this.addComponent(new Collider(16, CollisionLayers.PLAYER, CollisionLayers.ENEMY | CollisionLayers.PICKUP));
    this.addComponent(new Sprite({ shape: 'circle', color: '#00ff00' }));

    // Add tags
    this.addTag('player');
  }
}
```

---

## Creating Custom Systems

```javascript
import { System } from './reference-framework/ecs/System.js';
import { Transform, Velocity } from './reference-framework/components/index.js';

export class MovementSystem extends System {
  constructor() {
    super();
    this._priority = 10;  // After input (5), before collision (20)
  }

  update(deltaTime) {
    const movables = this._entityManager.getWithComponents(Transform, Velocity);

    movables.forEach(entity => {
      const transform = entity.getComponent(Transform);
      const velocity = entity.getComponent(Velocity);

      transform.x += velocity.x * deltaTime;
      transform.y += velocity.y * deltaTime;
    });
  }
}
```

---

## Using the Registry Pattern

```javascript
import { Registry } from './reference-framework/lib/RF/patterns/Registry.js';

// Create registry for weapons
const weaponRegistry = new Registry();

// Register weapons
weaponRegistry.register('fireball', {
  id: 'fireball',
  name: 'Fireball',
  damage: 25,
  cooldown: 0.8,
  attackType: 'projectile'
});

weaponRegistry.register('ice_shard', {
  id: 'ice_shard',
  name: 'Ice Shard',
  damage: 15,
  cooldown: 0.5,
  attackType: 'projectile'
});

// Query
const weapon = weaponRegistry.get('fireball');
const allIds = weaponRegistry.getAllIds();
const allWeapons = weaponRegistry.getAll();
```

---

## Using Object Pools

```javascript
import { ObjectPool } from './reference-framework/lib/RF/core/ObjectPool.js';
import { Projectile } from './entities/Projectile.js';

// Create pool
const projectilePool = new ObjectPool(
  () => new Projectile(),           // Create function
  (p) => p.reset(),                 // Reset function
  50,                               // Initial size
  500                               // Max size
);

// Usage
function spawnProjectile(x, y, direction) {
  const projectile = projectilePool.get();
  projectile.init(x, y, direction);
  entityManager.add(projectile);
  return projectile;
}

function despawnProjectile(projectile) {
  entityManager.remove(projectile);
  projectilePool.release(projectile);
}
```

---

## Using Weapon Behaviors

```javascript
import { ProjectileBehavior } from './reference-framework/lib/RF/behaviors/ProjectileBehavior.js';
import { events } from './reference-framework/core/EventBus.js';

class WeaponSystem extends System {
  constructor() {
    super();
    this._priority = 40;
    this._projectileBehavior = new ProjectileBehavior();
  }

  initialize(game, entityManager) {
    super.initialize(game, entityManager);

    // Initialize behavior with dependencies
    this._projectileBehavior.initialize(entityManager, game.input, events);
  }

  update(deltaTime) {
    const player = this._entityManager.getByTag('player')[0];
    const weapons = player.getComponent(WeaponSlot).weapons;

    weapons.forEach(weapon => {
      if (this.canFire(weapon)) {
        this._projectileBehavior.execute(weapon, player);
        weapon.lastFired = Time.elapsed;
      }
    });
  }
}
```

---

## Using Enemy Behaviors

```javascript
import { ChaseEnemyBehavior } from './reference-framework/lib/RF/behaviors/ChaseEnemyBehavior.js';

class EnemySystem extends System {
  constructor() {
    super();
    this._priority = 8;
    this._chaseBehavior = new ChaseEnemyBehavior();
  }

  update(deltaTime) {
    const enemies = this._entityManager.getByTag('enemy');
    const player = this._entityManager.getByTag('player')[0];

    enemies.forEach(enemy => {
      if (enemy.hasTag('chaser')) {
        this._chaseBehavior.execute(enemy, player, deltaTime);
      }
    });
  }
}
```

---

## Using Timers

```javascript
import { Cooldown, Duration, Interval } from './reference-framework/lib/RF/core/Timer.js';

// Cooldown: ready after X seconds
const attackCooldown = new Cooldown(0.5);  // 0.5 second cooldown

function tryAttack() {
  if (attackCooldown.isReady) {
    performAttack();
    attackCooldown.reset();
  }
}

// Update every frame
attackCooldown.update(deltaTime);

// Duration: active for X seconds
const invincibility = new Duration(3.0);  // 3 seconds of invincibility
invincibility.start();

if (invincibility.isActive) {
  // Player is invincible
}

// Interval: trigger every X seconds
const spawnInterval = new Interval(2.0);  // Spawn every 2 seconds

if (spawnInterval.check(deltaTime)) {
  spawnEnemy();
}
```

---

## Framework Gaps

The following features are NOT included in the framework and must be implemented:

### Audio (Major Gap)
```javascript
// You need to implement:
class AudioManager {
  playSound(soundId) { ... }
  playMusic(musicId, loop) { ... }
  stopMusic() { ... }
  setVolume(volume) { ... }
}
```

### Particles (Enhancement)
```javascript
// You need to implement:
class ParticleSystem {
  emit(config) { ... }
  update(deltaTime) { ... }
  render(ctx) { ... }
}
```

### Save/Load
The framework provides `Serializer` but you need to implement:
```javascript
class SaveManager {
  save(slot, data) { ... }
  load(slot) { ... }
  delete(slot) { ... }
}
```

### Asset Loading
Basic structure exists but you need:
```javascript
class AssetLoader {
  loadImage(id, path) { ... }
  loadSound(id, path) { ... }
  waitForAll() { ... }  // Promise that resolves when all loaded
}
```

---

## Project Structure Recommendation

```
my-game/
├── index.html
├── main.js                 # Entry point
├── reference-framework/    # Git submodule
├── game/
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   └── Projectile.js
│   ├── systems/
│   │   ├── PlayerSystem.js
│   │   ├── EnemySystem.js
│   │   ├── WeaponSystem.js
│   │   └── RenderSystem.js
│   ├── components/
│   │   ├── Weapon.js
│   │   └── Experience.js
│   ├── behaviors/
│   │   └── CustomBehavior.js
│   └── data/
│       ├── weapons/
│       ├── enemies/
│       └── registries.js
└── assets/
    ├── images/
    └── sounds/
```

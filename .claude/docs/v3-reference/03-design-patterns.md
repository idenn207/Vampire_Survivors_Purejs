# Design Patterns Reference

This document catalogs the design patterns used in V2, why they were chosen, issues encountered, and how they function.

## 1. Registry + Aggregator Pattern

### What Was Developed
A modular data definition pattern where content is split across multiple files and merged at load time.

### Purpose
- **Modularity**: Each weapon/enemy/boss in its own file
- **Scalability**: Easy to add new content without touching core files
- **Organization**: Content grouped by type/rarity
- **Single source of truth**: Aggregator provides final merged data

### Structure

```
1. Constants File (enums and constants)
   ↓
2. Registry Object (empty collection)
   ↓
3. Individual Data Files (add to registry)
   ↓
4. Aggregator (merges registry into final data)
```

### Example: Weapon Data

```javascript
// Step 1: WeaponConstants.js
var AttackType = {
  PROJECTILE: 'projectile',
  LASER: 'laser',
  MELEE_SWING: 'melee_swing'
};
Data.AttackType = AttackType;

// Step 2: WeaponRegistry.js
Data.WeaponRegistry = {};

// Step 3: Individual weapon file (arcane_dart.js)
Data.WeaponRegistry.arcane_dart = {
  id: 'arcane_dart',
  name: 'Arcane Dart',
  attackType: AttackType.PROJECTILE,
  damage: 12,
  cooldown: 0.6
};

// Step 4: WeaponAggregator.js
Data.WeaponData = {};
Object.keys(Data.WeaponRegistry).forEach(function(key) {
  Data.WeaponData[key] = Data.WeaponRegistry[key];
});

// Helper functions
Data.getWeaponData = function(id) {
  return Data.WeaponData[id];
};
```

### Where Used
| Data Type | Files Location | Aggregator |
|-----------|---------------|------------|
| Weapons | `src/data/weapons/basic/`, `core/` | `WeaponAggregator.js` |
| Enemies | `src/data/enemies/` | `EnemyAggregator.js` |
| Bosses | `src/data/bosses/` | `BossAggregator.js` |
| Buffs/Debuffs | `src/data/buffdebuff/effects/` | `BuffDebuffAggregator.js` |
| Tech Cores | `src/data/techcores/` | `TechCoreAggregator.js` |
| Summons | `src/data/summons/` | `SummonAggregator.js` |

### Issues Encountered
- Script loading order critical (individual files must load BEFORE aggregator)
- IDE can't trace references across registry pattern
- Typos in registry keys cause silent failures

### How Addressed
- Clear comments in index.html marking phases
- Aggregator validates required fields
- Console warnings for missing data

---

## 2. Behavior Strategy Pattern

### What Was Developed
Polymorphic weapon execution where each attack type has its own behavior class.

### Purpose
- **Separation of concerns**: Attack logic isolated from WeaponSystem
- **Extensibility**: New attack types = new Behavior subclass
- **Reusability**: Behaviors share common targeting/damage logic
- **Data-driven**: Weapon data configures behavior execution

### Structure

```
WeaponBehavior (base class)
├── execute(weapon, player)      // Abstract, override in subclass
├── findNearestEnemy(player, range)
├── findWeakestEnemy(player, range)
├── getMouseDirection(player)
├── calculateDamage(weapon, crit, multiplier)
└── getSizeMultiplier()

Concrete Behaviors:
├── ProjectileBehavior
├── LaserBehavior
├── MeleeBehavior
├── AreaBehavior
├── ParticleBehavior
├── MineBehavior
├── SummonBehavior
└── ThrustBehavior
```

### Example: ProjectileBehavior

```javascript
class ProjectileBehavior extends WeaponBehavior {
  execute(weapon, player) {
    var target = this.findTarget(weapon, player);
    var direction = this.getDirectionToTarget(player, target);
    var damage = this.calculateDamage(weapon);

    // Spawn projectile from pool
    var projectile = projectilePool.get();
    projectile.reset(player.position, direction, damage, weapon);
    entityManager.add(projectile);

    return [projectile];
  }
}
```

### WeaponSystem Orchestration

```javascript
class WeaponSystem extends System {
  initializeBehaviors() {
    this._behaviors = {
      [AttackType.PROJECTILE]: new ProjectileBehavior(),
      [AttackType.LASER]: new LaserBehavior(),
      [AttackType.MELEE_SWING]: new MeleeBehavior(),
      // ... etc
    };
  }

  update(deltaTime) {
    weapons.forEach(weapon => {
      if (weapon.canFire()) {
        var behavior = this._behaviors[weapon.attackType];
        behavior.execute(weapon, player);
        weapon.fire();
      }
    });
  }
}
```

### Issues Encountered
- Behaviors needed access to EntityManager, pools, events
- Different targeting modes (mouse, nearest, random) per weapon

### How Addressed
- Behaviors initialized with references in `initialize()`
- Targeting mode selection in base class based on weapon data

---

## 3. Object Pool Pattern

### What Was Developed
Pre-allocated object pools for frequently created/destroyed entities.

### Purpose
- **Performance**: Avoid GC pauses from constant allocations
- **Memory**: Predictable memory usage
- **Speed**: No constructor overhead for recycled objects

### Structure

```javascript
class ObjectPool {
  constructor(createFn, resetFn, initialSize, maxSize) {
    this._pool = [];        // Available objects
    this._active = new Set(); // In-use objects
    this._createFn = createFn;
    this._resetFn = resetFn;

    // Pre-allocate
    for (var i = 0; i < initialSize; i++) {
      this._pool.push(createFn());
    }
  }

  get() {
    var obj = this._pool.pop() || this._createFn();
    this._active.add(obj);
    return obj;
  }

  release(obj) {
    if (this._resetFn) this._resetFn(obj);
    this._active.delete(obj);
    if (this._pool.length < this._maxSize) {
      this._pool.push(obj);
    }
  }
}
```

### Pools in V2

| Pool | Initial | Max | Entity Type |
|------|---------|-----|-------------|
| projectilePool | 50 | 500 | Projectile |
| areaEffectPool | 20 | 100 | AreaEffect |
| pickupPool | 30 | 200 | Pickup |
| minePool | 10 | 50 | Mine |
| summonPool | 5 | 20 | Summon |
| enemyProjectilePool | 20 | 100 | EnemyProjectile |

### Usage Pattern

```javascript
// Spawn
var projectile = projectilePool.get();
projectile.reset(position, velocity, damage);
entityManager.add(projectile);

// Despawn
entityManager.remove(projectile);
projectilePool.release(projectile);
```

---

## 4. Event-Driven Decoupling (Unity-style)

### What Was Developed
Pub/sub event system for loose coupling between systems.

### Purpose
- **Decoupling**: Systems don't need direct references
- **Flexibility**: Multiple listeners for same event
- **Debugging**: Central point to log all events
- **Testing**: Easy to mock event handlers

### EventBus API

```javascript
var events = window.VampireSurvivors.Core.events;

// Subscribe
events.on('event:name', function(data) { ... });

// Subscribe once (auto-unsubscribe)
events.once('event:name', function(data) { ... });

// Unsubscribe
events.off('event:name', handler);

// Emit async (returns Promise)
events.emit('event:name', { key: value });

// Emit sync (blocks until handlers complete)
events.emitSync('event:name', { key: value });
```

### Unity-style Screen Management

**Issue**: Multiple UI screens (LevelUp, TabScreen, PauseMenu) conflicting.

**Solution**: Request-based screen state management:

```javascript
// Request to open a screen (doesn't immediately open)
events.emit('screen:requestOpen', { screen: 'levelup' });

// Screen coordinator handles conflicts
events.on('screen:requestOpen', function(data) {
  if (currentScreen) {
    events.emit('screen:suspended', { screen: currentScreen });
  }
  openScreen(data.screen);
  events.emit('screen:opened', { screen: data.screen });
});

// Suspended screen can resume
events.on('screen:requestResume', function(data) {
  openScreen(data.screen);
});
```

### Key Events Reference

```
// Game state
game:initialized
game:started
game:paused
game:resumed
game:over
game:stopped

// Player
player:created
player:damaged
player:healed
player:level_up
player:died

// Combat
collision:detected
weapon:fired
weapon:hit
entity:damaged
entity:died

// Pickups
pickup:spawned
pickup:collected

// Status effects
status:effect_applied
status:effect_removed
status:dot_damage

// Screens
screen:requestOpen
screen:opened
screen:closed
screen:suspended
screen:requestResume
```

---

## 5. Component Composition

### What Was Developed
Entity-Component pattern where entities are component containers.

### Purpose
- **Flexibility**: Compose entities from reusable components
- **Data locality**: Components are pure data
- **Query efficiency**: Find entities by component types

### Entity Structure

```javascript
class Entity {
  constructor() {
    this._id = Entity._nextId++;
    this._components = new Map();  // ComponentClass → instance
    this._tags = new Set();        // String tags
  }

  addComponent(component) {
    this._components.set(component.constructor, component);
    component.entity = this;
  }

  getComponent(ComponentClass) {
    return this._components.get(ComponentClass);
  }

  hasComponent(ComponentClass) {
    return this._components.has(ComponentClass);
  }

  addTag(tag) { this._tags.add(tag); }
  hasTag(tag) { return this._tags.has(tag); }
}
```

### Component Design

Components are **pure data** with no game logic:

```javascript
class Health extends Component {
  constructor(max) {
    super();
    this._max = max;
    this._current = max;
  }

  // Computed getters OK
  get percentage() {
    return this._current / this._max;
  }

  // NO game logic in components
  // takeDamage() is in CombatSystem, not here
}
```

### Tag-based Grouping

```javascript
// Tag entities for efficient querying
entity.addTag('enemy');
entity.addTag('flying');

// Query by tag
var enemies = entityManager.getByTag('enemy');
var flyingEnemies = entityManager.getByTag('enemy')
  .filter(e => e.hasTag('flying'));
```

---

## 6. Collision Layer Bitmask

### What Was Developed
Bitmask-based collision filtering system.

### Purpose
- **Performance**: Single bitwise AND to check collision
- **Flexibility**: Configure which layers collide
- **Clarity**: Clear separation of collision groups

### Layer Definitions

```javascript
var CollisionLayer = {
  PLAYER: 1,    // 0b00001
  ENEMY: 2,     // 0b00010
  TERRAIN: 4,   // 0b00100
  HITBOX: 8,    // 0b01000
  PICKUP: 16    // 0b10000
};
```

### Collider Configuration

```javascript
// Collider(radius, layer, mask)

// Player: is PLAYER, collides with ENEMY and PICKUP
new Collider(20, CollisionLayer.PLAYER,
  CollisionLayer.ENEMY | CollisionLayer.PICKUP);

// Enemy: is ENEMY, collides with PLAYER and HITBOX
new Collider(15, CollisionLayer.ENEMY,
  CollisionLayer.PLAYER | CollisionLayer.HITBOX);

// Projectile: is HITBOX, collides with ENEMY
new Collider(5, CollisionLayer.HITBOX,
  CollisionLayer.ENEMY);
```

### Collision Check

```javascript
function shouldCollide(colliderA, colliderB) {
  // A's mask includes B's layer AND B's mask includes A's layer
  return (colliderA.mask & colliderB.layer) !== 0 &&
         (colliderB.mask & colliderA.layer) !== 0;
}
```

---

## Pattern Selection Guide

| Scenario | Pattern |
|----------|---------|
| Adding game content (weapons, enemies) | Registry + Aggregator |
| Different attack type implementations | Behavior Strategy |
| Frequently spawned/destroyed objects | Object Pool |
| System-to-system communication | Event-Driven |
| Entity feature composition | Component Composition |
| Filtering collision pairs | Collision Bitmask |

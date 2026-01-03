# Design Patterns

Common patterns used in RoguelikeFramework and how to implement them.

## Table of Contents

1. [State Machine](#state-machine)
2. [Object Pooling](#object-pooling)
3. [Timer/Cooldown System](#timercooldown-system)
4. [Behavior Strategy Pattern](#behavior-strategy-pattern)
5. [Registry Pattern](#registry-pattern)
6. [Collision Layers](#collision-layers)
7. [Entity Targeting](#entity-targeting)
8. [Debug Interface](#debug-interface)

---

## State Machine

Use the StateMachine class for entity states, game states, or UI states.

```javascript
var StateMachine = window.RoguelikeFramework.Lib.Core.StateMachine;

// Define states with callbacks and transitions
var fsm = new StateMachine('idle', {
  idle: {
    onEnter: function(ctx) {
      ctx.playAnimation('idle');
    },
    onUpdate: function(ctx, deltaTime) {
      if (ctx.input.isKeyDown('Space')) {
        fsm.transition('attacking');
      }
    },
    onExit: function(ctx) {
      // Cleanup
    },
    transitions: ['walking', 'attacking', 'dead']
  },

  walking: {
    onEnter: function(ctx) {
      ctx.playAnimation('walk');
    },
    onUpdate: function(ctx, deltaTime) {
      var dir = ctx.input.getMovementDirection();
      if (dir.x === 0 && dir.y === 0) {
        fsm.transition('idle');
      }
    },
    transitions: ['idle', 'attacking', 'dead']
  },

  attacking: {
    onEnter: function(ctx) {
      ctx.playAnimation('attack');
      ctx.attackTimer = 0.5;
    },
    onUpdate: function(ctx, deltaTime) {
      ctx.attackTimer -= deltaTime;
      if (ctx.attackTimer <= 0) {
        fsm.transition('idle');
      }
    },
    transitions: ['idle', 'dead']
  },

  dead: {
    onEnter: function(ctx) {
      ctx.playAnimation('death');
    },
    transitions: []  // No transitions from dead
  }
}, playerContext);

// In system update
fsm.update(deltaTime);

// Check current state
if (fsm.isInState('attacking')) {
  // Do something
}
```

---

## Object Pooling

Use pools for frequently created/destroyed objects like projectiles, particles, or enemies.

```javascript
var ObjectPool = window.RoguelikeFramework.Lib.Core.ObjectPool;

// Create pool with factory and reset functions
var projectilePool = new ObjectPool(
  // Create function
  function() {
    var entity = entityManager.create(Entity);
    entity.addComponent(new Transform(0, 0, 8, 8));
    entity.addComponent(new Velocity(0, 0));
    entity.addComponent(new Projectile());
    entity.addTag('projectile');
    return entity;
  },

  // Reset function (optional)
  function(entity) {
    var transform = entity.getComponent(Transform);
    var velocity = entity.getComponent(Velocity);
    transform.x = 0;
    transform.y = 0;
    velocity.vx = 0;
    velocity.vy = 0;
  },

  50,   // Initial pool size
  200   // Maximum pool size
);

// Spawning
function spawnProjectile(x, y, vx, vy) {
  var projectile = projectilePool.get();
  if (!projectile) return null;  // Pool exhausted

  var transform = projectile.getComponent(Transform);
  var velocity = projectile.getComponent(Velocity);

  transform.x = x;
  transform.y = y;
  velocity.vx = vx;
  velocity.vy = vy;

  entityManager.add(projectile);
  return projectile;
}

// Despawning
function despawnProjectile(projectile) {
  entityManager.remove(projectile);  // Don't destroy
  projectilePool.release(projectile);
}
```

---

## Timer/Cooldown System

Use timer utilities for weapon cooldowns, ability durations, and periodic effects.

```javascript
var Timer = window.RoguelikeFramework.Lib.Core.Timer;
var Cooldown = window.RoguelikeFramework.Lib.Core.Cooldown;
var Duration = window.RoguelikeFramework.Lib.Core.Duration;
var Interval = window.RoguelikeFramework.Lib.Core.Interval;

// ========================================
// Weapon Cooldown
// ========================================
class Weapon extends Component {
  constructor(fireRate) {
    super();
    this.cooldown = new Cooldown(1 / fireRate);
    this.cooldown.speedMultiplier = 1;  // Can increase with upgrades
  }

  update(deltaTime) {
    this.cooldown.update(deltaTime);
  }

  fire() {
    if (this.cooldown.trigger()) {  // Returns true if was ready
      // Spawn projectile
      return true;
    }
    return false;
  }

  get cooldownProgress() {
    return this.cooldown.progress;  // 0 = just fired, 1 = ready
  }
}

// ========================================
// Buff Duration
// ========================================
class SpeedBuff extends Component {
  constructor(duration, multiplier) {
    super();
    this.duration = new Duration(duration);
    this.multiplier = multiplier;
  }

  update(deltaTime) {
    this.duration.update(deltaTime);
  }

  get isExpired() {
    return this.duration.isExpired;
  }

  get remainingTime() {
    return this.duration.remaining;
  }
}

// ========================================
// Periodic Damage (DOT)
// ========================================
class BurnEffect extends Component {
  constructor(damagePerTick, tickInterval, totalDuration) {
    super();
    this.damagePerTick = damagePerTick;
    this.totalDuration = new Duration(totalDuration);

    var self = this;
    this.tickInterval = new Interval(tickInterval, function() {
      if (self.entity) {
        var health = self.entity.getComponent(Health);
        if (health) {
          health.takeDamage(self.damagePerTick);
        }
      }
    });
  }

  update(deltaTime) {
    if (!this.totalDuration.isExpired) {
      this.totalDuration.update(deltaTime);
      this.tickInterval.update(deltaTime);
    }
  }
}
```

---

## Behavior Strategy Pattern

Use behaviors for different weapon types, AI behaviors, or movement patterns.

```javascript
var Behavior = window.RoguelikeFramework.Lib.Patterns.Behavior;
var WeaponBehavior = window.RoguelikeFramework.Lib.Patterns.WeaponBehavior;

// ========================================
// Base behavior (override execute)
// ========================================
class ProjectileBehavior extends WeaponBehavior {
  execute(weapon, deltaTime) {
    var player = this.player;
    if (!player) return;

    var transform = player.getComponent(Transform);
    var projectileCount = weapon.getStat('projectileCount', 1);
    var spread = weapon.getStat('spread', 0);

    // Find target
    var target = this.findNearestEnemy(weapon.getStat('range', 300));
    var direction = target
      ? this.getDirectionToTarget(target)
      : this.getRandomDirection();

    // Calculate angles for spread
    var angles = this._calculateSpreadAngles(direction, projectileCount, spread);

    // Spawn projectiles
    for (var i = 0; i < angles.length; i++) {
      this._spawnProjectile(transform, angles[i], weapon);
    }
  }

  _calculateSpreadAngles(direction, count, spread) {
    var baseAngle = Math.atan2(direction.y, direction.x);
    var spreadRad = spread * Math.PI / 180;

    if (count === 1) {
      return [baseAngle];
    }

    var angles = [];
    var startAngle = baseAngle - spreadRad / 2;
    var angleStep = spreadRad / (count - 1);

    for (var i = 0; i < count; i++) {
      angles.push(startAngle + angleStep * i);
    }

    return angles;
  }

  _spawnProjectile(origin, angle, weapon) {
    var projectile = projectilePool.get();
    // ... configure projectile ...
  }
}

// ========================================
// Different weapon behavior
// ========================================
class LaserBehavior extends WeaponBehavior {
  execute(weapon, deltaTime) {
    // Draw laser beam instead of projectiles
    var direction = this.getMouseDirection();
    // ... laser logic ...
  }
}

// ========================================
// Usage in WeaponSystem
// ========================================
class WeaponSystem extends System {
  constructor() {
    super();
    this._behaviors = {
      projectile: new ProjectileBehavior(),
      laser: new LaserBehavior(),
      melee: new MeleeBehavior(),
    };
  }

  initialize(game, entityManager) {
    super.initialize(game, entityManager);

    // Initialize all behaviors
    var context = {
      entityManager: entityManager,
      input: game.input,
      events: game.events,
    };

    for (var key in this._behaviors) {
      this._behaviors[key].initialize(context);
    }
  }

  update(deltaTime) {
    var players = this.entityManager.getByTag('player');
    if (players.length === 0) return;

    var player = players[0];
    var weapons = player.getComponent(WeaponSlot).weapons;

    for (var i = 0; i < weapons.length; i++) {
      var weapon = weapons[i];
      if (weapon.cooldown.isReady) {
        var behavior = this._behaviors[weapon.attackType];
        if (behavior) {
          behavior.setPlayer(player);
          behavior.execute(weapon, deltaTime);
          weapon.cooldown.reset();
        }
      }
    }
  }
}
```

---

## Registry Pattern

Use registries for game data like weapons, enemies, items.

```javascript
var Registry = window.RoguelikeFramework.Lib.Patterns.Registry;

// ========================================
// Create weapon registry
// ========================================
var WeaponRegistry = new Registry('Weapons');

// Register weapons (can be in separate files)
WeaponRegistry.register('pistol', {
  name: 'Pistol',
  attackType: 'projectile',
  damage: 10,
  cooldown: 0.5,
  projectileSpeed: 400,
  range: 300,
  tier: 1,
});

WeaponRegistry.register('shotgun', {
  name: 'Shotgun',
  attackType: 'projectile',
  damage: 8,
  cooldown: 1.2,
  projectileSpeed: 350,
  projectileCount: 5,
  spread: 30,
  range: 200,
  tier: 2,
});

WeaponRegistry.register('laser', {
  name: 'Laser Beam',
  attackType: 'laser',
  damage: 25,
  cooldown: 2.0,
  duration: 0.5,
  range: 400,
  tier: 3,
});

// Freeze to prevent modifications
WeaponRegistry.freeze();

// ========================================
// Query weapons
// ========================================

// Get by ID
var pistol = WeaponRegistry.get('pistol');

// Get all tier 1 weapons
var tier1Weapons = WeaponRegistry.getByProperty('tier', 1);

// Filter with custom predicate
var projectileWeapons = WeaponRegistry.filter(function(data, id) {
  return data.attackType === 'projectile';
});

// Get all IDs
var allWeaponIds = WeaponRegistry.getIds();

// ========================================
// Aggregator pattern
// ========================================
// Create multiple registries and merge
var BasicWeapons = new Registry('Basic');
var RareWeapons = new Registry('Rare');

// ... register to each ...

var AllWeapons = new Registry('AllWeapons');
AllWeapons.merge(BasicWeapons);
AllWeapons.merge(RareWeapons);
AllWeapons.freeze();
```

---

## Collision Layers

Use bitmask layers for efficient collision filtering.

```javascript
var CollisionLayers = window.RoguelikeFramework.Lib.Physics.CollisionLayers;

// ========================================
// Predefined layers
// ========================================
CollisionLayers.PLAYER;      // 1
CollisionLayers.ENEMY;       // 2
CollisionLayers.PROJECTILE;  // 4
CollisionLayers.PICKUP;      // 8
CollisionLayers.TERRAIN;     // 16

// ========================================
// Create custom layers
// ========================================
var BOSS = CollisionLayers.create('BOSS');
var ALLY = CollisionLayers.create('ALLY');

// ========================================
// Set entity layers
// ========================================
class Collider extends Component {
  constructor(radius, layer, mask) {
    super();
    this.radius = radius;
    this.layer = layer;  // What I am
    this.mask = mask;    // What I collide with
  }
}

// Player collides with enemies, pickups, terrain
var playerCollider = new Collider(
  16,
  CollisionLayers.PLAYER,
  CollisionLayers.combine(
    CollisionLayers.ENEMY,
    CollisionLayers.PICKUP,
    CollisionLayers.TERRAIN
  )
);

// Enemy collides with player and player projectiles
var enemyCollider = new Collider(
  12,
  CollisionLayers.ENEMY,
  CollisionLayers.combine(
    CollisionLayers.PLAYER,
    CollisionLayers.PROJECTILE
  )
);

// ========================================
// Check collisions
// ========================================
function checkCollision(colliderA, colliderB) {
  // Layer check first (fast)
  if (!CollisionLayers.canCollide(
    colliderA.layer, colliderA.mask,
    colliderB.layer, colliderB.mask
  )) {
    return false;
  }

  // Distance check (more expensive)
  var dist = getDistance(colliderA, colliderB);
  return dist <= colliderA.radius + colliderB.radius;
}
```

---

## Entity Targeting

Use the Targeting class for finding enemies, allies, or pickups.

```javascript
var Targeting = window.RoguelikeFramework.Lib.Physics.Targeting;
var TargetingMode = window.RoguelikeFramework.Lib.Physics.TargetingMode;

// ========================================
// Setup targeting
// ========================================
var targeting = new Targeting(
  entityManager,
  Transform,  // Transform component class
  Health      // Health component class (optional)
);

// ========================================
// Find targets
// ========================================
var playerTransform = player.getComponent(Transform);
var x = playerTransform.centerX;
var y = playerTransform.centerY;

// Find nearest enemy within 300 units
var nearest = targeting.findNearest(x, y, 'enemy', 300);

// Find weakest enemy (lowest health)
var weakest = targeting.findWeakest(x, y, 'enemy', 300);

// Find random enemy
var random = targeting.findRandom(x, y, 'enemy', 300);

// Find all enemies in range
var allInRange = targeting.findAll(x, y, 'enemy', 300);

// Find 5 nearest enemies
var nearest5 = targeting.findNearestN(x, y, 'enemy', 5, 300);

// Find enemies in a cone (60 degree arc)
var direction = Math.atan2(dirY, dirX);
var halfAngle = 30 * Math.PI / 180;
var inCone = targeting.findInCone(x, y, direction, halfAngle, 300, 'enemy');

// ========================================
// Use targeting modes
// ========================================
var target = targeting.findByMode(
  x, y,
  'enemy',
  TargetingMode.WEAKEST,
  300
);

// ========================================
// Get direction to target
// ========================================
if (target) {
  var dir = targeting.getDirectionTo(x, y, target);
  // dir = { x: normalized, y: normalized, angle: radians, distance: units }
}
```

---

## Debug Interface

Implement the debug interface for your systems and components.

```javascript
// ========================================
// Component debug info
// ========================================
class Health extends Component {
  // ... health logic ...

  getDebugEntries() {
    return [
      { key: 'HP', value: this.current + '/' + this.max },
      { key: 'Shield', value: this.shield },
    ];
  }
}

// ========================================
// System debug info
// ========================================
class EnemySystem extends System {
  // ... system logic ...

  getDebugInfo() {
    var enemies = this.entityManager.getByTag('enemy');
    return {
      label: 'EnemySystem',
      entries: [
        { key: 'Active', value: enemies.length },
        { key: 'Spawned', value: this._totalSpawned },
        { key: 'Wave', value: this._currentWave },
      ],
    };
  }

  // For performance summary
  getSummaryInfo() {
    return [
      { key: 'Enemies', value: this.entityManager.getCountByTag('enemy') },
    ];
  }
}

// ========================================
// Using debug panel
// ========================================
var DebugPanel = window.RoguelikeFramework.Lib.Debug.DebugPanel;

var debugPanel = new DebugPanel();
debugPanel.initialize(game);

// Add systems for debugging
debugPanel.addSection(enemySystem);
debugPanel.addSection(weaponSystem);
debugPanel.addSummary(game.time);
debugPanel.addSummary(entityManager);

// Toggle with F3
document.addEventListener('keydown', function(e) {
  if (e.code === 'F3') {
    e.preventDefault();
    debugPanel.toggle();
  }
});

// Render in your render system
class DebugRenderSystem extends System {
  render(ctx) {
    debugPanel.render(ctx);
  }
}

// Log to debug console
debugPanel.console.info('Game started');
debugPanel.console.warn('Low health!');
debugPanel.console.error('Failed to load asset');
debugPanel.console.event('Player leveled up');
```

---

## Best Practices Summary

1. **State Machine**: Use for any entity with discrete states (player, enemy AI, UI)
2. **Object Pool**: Use for any frequently spawned/despawned objects
3. **Timers**: Use for cooldowns, durations, and periodic effects
4. **Behaviors**: Use strategy pattern for polymorphic actions
5. **Registry**: Use for game data (weapons, enemies, items)
6. **Collision Layers**: Use bitmasks for efficient collision filtering
7. **Targeting**: Use helper class for common targeting patterns
8. **Debug Interface**: Implement `getDebugInfo()` for development visibility

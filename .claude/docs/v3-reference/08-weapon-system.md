# Weapon System Reference

This document provides a complete reference for the weapon system in V2, including attack types, targeting modes, behavior execution, and the tier/evolution system.

## Attack Types

The weapon system supports 8 attack types, each handled by a dedicated behavior class.

### PROJECTILE

**What it does**: Spawns projectile entities that travel in a direction and deal damage on collision.

**Properties**:
- `projectileSpeed` - Travel speed in pixels/second
- `projectileCount` - Number of projectiles per attack
- `pierce` - Number of enemies a projectile can pass through
- `spread` - Angle spread between multiple projectiles
- `ricochet` - Number of bounces off screen edges

**Example**:
```javascript
{
  attackType: 'projectile',
  damage: 15,
  cooldown: 0.5,
  projectileSpeed: 400,
  projectileCount: 3,
  pierce: 1,
  spread: 15  // degrees
}
```

**Behavior**: `ProjectileBehavior.js`

---

### LASER

**What it does**: Creates an instant line-of-sight attack from player to target.

**Properties**:
- `range` - Maximum laser length
- `width` - Visual width of laser
- `duration` - How long laser stays visible
- `pierce` - Enemies the laser passes through

**Example**:
```javascript
{
  attackType: 'laser',
  damage: 30,
  cooldown: 1.0,
  range: 500,
  width: 8,
  duration: 0.2
}
```

**Behavior**: `LaserBehavior.js`

---

### MELEE_SWING

**What it does**: Creates an arc attack around the player.

**Properties**:
- `range` - Arc radius
- `arcAngle` - Angle of the swing arc (degrees)
- `swingSpeed` - Animation speed
- `knockback` - Push force on hit

**Example**:
```javascript
{
  attackType: 'melee_swing',
  damage: 25,
  cooldown: 0.8,
  range: 80,
  arcAngle: 120,
  swingSpeed: 2.0
}
```

**Behavior**: `MeleeBehavior.js`

---

### MELEE_THRUST

**What it does**: Linear thrust attack in a direction.

**Properties**:
- `range` - Thrust distance
- `width` - Attack width
- `thrustSpeed` - How fast the thrust extends
- `holdDuration` - Time at full extension

**Example**:
```javascript
{
  attackType: 'melee_thrust',
  damage: 35,
  cooldown: 0.6,
  range: 100,
  width: 20,
  thrustSpeed: 800
}
```

**Behavior**: `ThrustBehavior.js`

---

### AREA_DAMAGE

**What it does**: Spawns a stationary damage zone.

**Properties**:
- `range` - Zone radius
- `duration` - How long zone persists
- `tickRate` - Damage frequency
- `damagePerTick` - Damage per tick (or uses `damage` divided by ticks)

**Example**:
```javascript
{
  attackType: 'area_damage',
  damage: 50,  // Total damage over duration
  cooldown: 2.0,
  range: 60,
  duration: 3.0,
  tickRate: 0.5
}
```

**Behavior**: `AreaBehavior.js`

---

### PARTICLE

**What it does**: Creates orbiting or following particle effects.

**Properties**:
- `particleCount` - Number of particles
- `orbitRadius` - Distance from player
- `orbitSpeed` - Rotation speed
- `particleSize` - Visual size

**Example**:
```javascript
{
  attackType: 'particle',
  damage: 8,
  particleCount: 4,
  orbitRadius: 50,
  orbitSpeed: 2.0
}
```

**Behavior**: `ParticleBehavior.js`

---

### MINE

**What it does**: Deploys mines that trigger on enemy proximity or timer.

**Properties**:
- `mineCount` - Mines per deployment
- `triggerRadius` - Proximity trigger distance
- `explosionRadius` - Damage radius when triggered
- `armDelay` - Time before mine becomes active
- `triggerMode` - 'proximity' or 'timed'

**Example**:
```javascript
{
  attackType: 'mine',
  damage: 60,
  cooldown: 3.0,
  mineCount: 2,
  triggerRadius: 30,
  explosionRadius: 80,
  triggerMode: 'proximity'
}
```

**Behavior**: `MineBehavior.js`

---

### SUMMON

**What it does**: Spawns minion entities that fight alongside the player.

**Properties**:
- `summonId` - Reference to summon data
- `summonCount` - Number per cast
- `summonDuration` - Lifespan in seconds
- `maxActive` - Maximum simultaneous summons

**Example**:
```javascript
{
  attackType: 'summon',
  cooldown: 10.0,
  summonId: 'wolf',
  summonCount: 1,
  summonDuration: 15.0,
  maxActive: 2
}
```

**Behavior**: `SummonBehavior.js`

---

## Targeting Modes

Targeting modes determine how weapons select targets.

### NEAREST

**What it does**: Targets the closest enemy within range.

**Usage**: Default for most auto-aim weapons.

```javascript
{ targetingMode: 'nearest' }
```

---

### RANDOM

**What it does**: Selects a random enemy within range.

**Usage**: Chaos/luck-based weapons.

```javascript
{ targetingMode: 'random' }
```

---

### MOUSE

**What it does**: Fires toward the mouse cursor position.

**Usage**: Manual-aim weapons.

```javascript
{
  targetingMode: 'mouse',
  isAuto: false  // Usually requires click to fire
}
```

---

### ROTATING

**What it does**: Fires in a rotating pattern regardless of enemy positions.

**Usage**: Barrier/orbital weapons.

```javascript
{
  targetingMode: 'rotating',
  rotationSpeed: 90  // Degrees per second
}
```

---

### CHAIN

**What it does**: First target is nearest, subsequent targets chain to nearby enemies.

**Usage**: Lightning/chain weapons.

```javascript
{
  targetingMode: 'chain',
  chainCount: 3,
  chainRange: 100
}
```

---

## Weapon Properties Reference

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | Tooltip text |
| `attackType` | string | One of 8 attack types |
| `targetingMode` | string | One of 5 targeting modes |
| `isAuto` | boolean | Auto-fire (true) or manual (false) |

### Combat Stats

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `damage` | number | - | Base damage per hit |
| `cooldown` | number | - | Seconds between attacks |
| `range` | number | 200 | Attack range in pixels |
| `critChance` | number | 0 | Critical hit chance (0-1) |
| `critMultiplier` | number | 2 | Critical damage multiplier |

### Projectile Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `projectileSpeed` | number | 300 | Travel speed |
| `projectileCount` | number | 1 | Projectiles per attack |
| `pierce` | number | 0 | Enemies pierced |
| `spread` | number | 0 | Angle between projectiles |
| `ricochet` | number | 0 | Screen bounces |
| `lifetime` | number | 5 | Max seconds before despawn |

### Area Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `duration` | number | 0 | Effect duration |
| `tickRate` | number | 0.5 | Damage tick interval |
| `areaRadius` | number | range | Damage area size |

### Visual Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | string | '#ffffff' | Primary color |
| `size` | number | 10 | Base visual size |
| `shape` | string | 'circle' | circle, rect, triangle |
| `imageId` | string | null | Sprite reference |
| `visualScale` | number | 1.0 | Size multiplier |
| `trail` | boolean | false | Leave trail effect |
| `glow` | boolean | false | Glow effect |

### Effect Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `statusEffects` | array | [] | Effects to apply on hit |
| `knockback` | number | 0 | Push force |
| `lifesteal` | number | 0 | HP gained (% of damage) |
| `healOnHit` | number | 0 | Flat HP per hit |

### Progression Properties

| Property | Type | Description |
|----------|------|-------------|
| `tier` | number | 1-5 rarity tier |
| `maxTier` | number | Highest evolution tier |
| `maxLevel` | number | Levels within tier |
| `rarity` | string | common/uncommon/rare/epic/legendary |
| `upgrades` | object | Per-level stat changes |

---

## Tier System

Weapons have 5 tiers with progressive power:

| Tier | Rarity | Stat Multiplier | Acquisition |
|------|--------|-----------------|-------------|
| 1 | Common | 1.0x | Level-up rewards |
| 2 | Uncommon | 1.3x | Level-up, evolution |
| 3 | Rare | 1.6x | Level-up, evolution |
| 4 | Epic | 2.0x | Level-up, evolution |
| 5 | Legendary | 2.5x | Evolution only |

### Upgrade System

Each weapon has up to `maxLevel` levels within its tier:

```javascript
{
  id: 'fireball',
  damage: 20,
  cooldown: 0.8,
  maxLevel: 5,
  upgrades: {
    2: { damage: 26, projectileCount: 2 },
    3: { damage: 32, cooldown: 0.7 },
    4: { damage: 40, pierce: 1 },
    5: { damage: 50, projectileCount: 3, cooldown: 0.6 }
  }
}
```

### Evolution System

Weapons evolve to higher tiers through:

1. **Level evolution**: Max level weapon + conditions → next tier version
2. **Recipe evolution**: Combine two weapons → evolved weapon

```javascript
// Evolution recipes
{
  weapon1: 'flame_bolt',
  weapon2: 'ice_shard',
  result: 'elemental_storm',
  resultTier: 5
}
```

---

## Behavior Execution Flow

### WeaponSystem Update

```javascript
class WeaponSystem extends System {
  update(deltaTime) {
    var player = this.getPlayer();
    var weapons = player.getComponent(WeaponSlot).weapons;

    weapons.forEach(weapon => {
      // Update cooldown
      weapon.currentCooldown -= deltaTime;

      // Check if can fire
      if (weapon.currentCooldown <= 0 && weapon.isAuto) {
        this.fireWeapon(weapon, player);
      }
    });
  }

  fireWeapon(weapon, player) {
    // Get appropriate behavior
    var behavior = this._behaviors[weapon.attackType];

    // Execute attack
    var entities = behavior.execute(weapon, player);

    // Reset cooldown (with stat modifiers)
    weapon.currentCooldown = this.getEffectiveCooldown(weapon);

    // Emit event
    events.emit('weapon:fired', { weapon, entities });
  }
}
```

### Behavior Base Class

```javascript
class WeaponBehavior {
  initialize(entityManager, input, events, player) {
    this._entityManager = entityManager;
    this._input = input;
    this._events = events;
    this._player = player;
  }

  // Override in subclass
  execute(weapon, player) {
    throw new Error('Must override execute()');
  }

  // Targeting helpers
  findNearestEnemy(player, range) {
    var enemies = this._entityManager.getByTag('enemy');
    var nearest = null;
    var nearestDist = range;

    enemies.forEach(enemy => {
      var dist = Vector2.distance(
        player.getComponent(Transform).position,
        enemy.getComponent(Transform).position
      );
      if (dist < nearestDist) {
        nearest = enemy;
        nearestDist = dist;
      }
    });

    return nearest;
  }

  // Damage calculation
  calculateDamage(weapon) {
    var base = weapon.damage;
    var multiplier = GlobalStatsHelper.getDamageMultiplier();
    var crit = Math.random() < weapon.critChance;
    var damage = base * multiplier;
    if (crit) damage *= weapon.critMultiplier;
    return { damage, isCritical: crit };
  }
}
```

### ProjectileBehavior Example

```javascript
class ProjectileBehavior extends WeaponBehavior {
  execute(weapon, player) {
    var spawned = [];
    var playerPos = player.getComponent(Transform).position;

    // Find target based on targeting mode
    var targets = this.getTargets(weapon, player);

    for (var i = 0; i < weapon.projectileCount; i++) {
      var target = targets[i % targets.length];
      var direction = this.getDirection(weapon, player, target, i);

      // Get from pool
      var projectile = projectilePool.get();

      // Configure
      var { damage, isCritical } = this.calculateDamage(weapon);
      projectile.reset({
        position: playerPos,
        direction: direction,
        speed: weapon.projectileSpeed,
        damage: damage,
        pierce: weapon.pierce,
        weapon: weapon,
        isCritical: isCritical
      });

      // Add to game
      this._entityManager.add(projectile);
      spawned.push(projectile);
    }

    return spawned;
  }

  getDirection(weapon, player, target, index) {
    var baseDir;

    switch (weapon.targetingMode) {
      case 'nearest':
      case 'random':
        baseDir = Vector2.normalize(
          Vector2.subtract(target.position, player.position)
        );
        break;
      case 'mouse':
        baseDir = this.getMouseDirection(player);
        break;
      case 'rotating':
        baseDir = this.getRotatingDirection(index);
        break;
    }

    // Apply spread
    if (weapon.spread > 0 && weapon.projectileCount > 1) {
      var spreadAngle = (index - (weapon.projectileCount - 1) / 2) * weapon.spread;
      baseDir = Vector2.rotate(baseDir, spreadAngle * Math.PI / 180);
    }

    return baseDir;
  }
}
```

---

## Adding New Weapons

### Step 1: Create Weapon Data

```javascript
// src/data/weapons/basic/common/my_new_weapon.js
(function (Data) {
  'use strict';

  Data.WeaponRegistry.my_new_weapon = {
    id: 'my_new_weapon',
    name: 'My New Weapon',
    attackType: Data.AttackType.PROJECTILE,
    targetingMode: Data.TargetingMode.NEAREST,
    isAuto: true,

    damage: 15,
    cooldown: 0.6,
    range: 300,
    projectileSpeed: 400,
    projectileCount: 1,

    color: '#ff6600',
    size: 8,

    tier: 1,
    rarity: 'common',
    maxLevel: 5,
    upgrades: {
      2: { damage: 20 },
      3: { damage: 25, projectileCount: 2 },
      4: { damage: 32, cooldown: 0.5 },
      5: { damage: 40, projectileCount: 3 }
    }
  };

})(window.VampireSurvivors.Data);
```

### Step 2: Add to index.html

```html
<script src="src/data/weapons/basic/common/my_new_weapon.js"></script>
```

### Step 3: Verify

```javascript
console.log(Data.getWeaponData('my_new_weapon'));
```

---

## Adding New Attack Types

### Step 1: Add Constant

```javascript
// WeaponConstants.js
var AttackType = {
  // ... existing types
  MY_NEW_TYPE: 'my_new_type'
};
```

### Step 2: Create Behavior

```javascript
// src/behaviors/MyNewTypeBehavior.js
class MyNewTypeBehavior extends WeaponBehavior {
  execute(weapon, player) {
    // Implementation
    return [];
  }
}
Behaviors.MyNewTypeBehavior = MyNewTypeBehavior;
```

### Step 3: Register in WeaponSystem

```javascript
// WeaponSystem.js
initializeBehaviors() {
  this._behaviors = {
    // ... existing
    [AttackType.MY_NEW_TYPE]: new Behaviors.MyNewTypeBehavior()
  };
}
```

### Step 4: Add Script Tags

```html
<script src="src/behaviors/MyNewTypeBehavior.js"></script>
```

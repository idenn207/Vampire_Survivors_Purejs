# Weapon Behaviors

## Overview

Weapon behaviors implement the Strategy pattern for attack execution. Each attack type (projectile, laser, melee, etc.) has a dedicated behavior class that handles firing logic.

---

## Behavior Base Class

**File:** `v3/game/behaviors/WeaponBehavior.js`

```javascript
import { events } from '../../reference-framework/core/EventBus.js';

export class WeaponBehavior {
  _entityManager = null;
  _input = null;
  _player = null;

  initialize(entityManager, input, player) {
    this._entityManager = entityManager;
    this._input = input;
    this._player = player;
  }

  // Override in subclasses
  execute(weapon, player) {
    throw new Error('WeaponBehavior.execute() must be overridden');
  }

  // Find nearest enemy within range
  findNearestEnemy(position, range) {
    const enemies = this._entityManager.getByTag('enemy');
    let nearest = null;
    let nearestDist = range;

    enemies.forEach(enemy => {
      const enemyPos = enemy.getComponent(Transform).position;
      const dist = this.distance(position, enemyPos);
      if (dist < nearestDist) {
        nearest = enemy;
        nearestDist = dist;
      }
    });

    return nearest;
  }

  // Find random enemy within range
  findRandomEnemy(position, range) {
    const enemies = this._entityManager.getByTag('enemy');
    const inRange = enemies.filter(e => {
      const dist = this.distance(position, e.getComponent(Transform).position);
      return dist <= range;
    });

    if (inRange.length === 0) return null;
    return inRange[Math.floor(Math.random() * inRange.length)];
  }

  // Get target based on targeting mode
  getTarget(weapon, playerPos) {
    switch (weapon.targetingMode) {
      case 'nearest':
        return this.findNearestEnemy(playerPos, weapon.range);
      case 'random':
        return this.findRandomEnemy(playerPos, weapon.range);
      case 'mouse':
        return this._input.mousePosition;
      default:
        return this.findNearestEnemy(playerPos, weapon.range);
    }
  }

  // Calculate damage with modifiers
  calculateDamage(weapon, playerStats) {
    let damage = weapon.damage;

    // Apply player damage bonus
    if (playerStats) {
      damage *= (1 + playerStats.damageBonus);
    }

    // Check for critical hit
    const critChance = weapon.critChance + (playerStats?.critChance || 0);
    const isCritical = Math.random() < critChance;

    if (isCritical) {
      damage *= weapon.critMultiplier || 2;
    }

    return { damage: Math.floor(damage), isCritical };
  }

  // Helper: distance between two points
  distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Helper: direction from a to b (normalized)
  direction(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: 0, y: -1 };
    return { x: dx / len, y: dy / len };
  }

  // Helper: rotate direction by angle (radians)
  rotate(dir, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: dir.x * cos - dir.y * sin,
      y: dir.x * sin + dir.y * cos
    };
  }
}
```

---

## Attack Type Behaviors

### 1. ProjectileBehavior

**Purpose:** Spawn projectile entities that travel toward target

**File:** `v3/game/behaviors/ProjectileBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { Projectile } from '../entities/Projectile.js';

export class ProjectileBehavior extends WeaponBehavior {
  _projectilePool = null;

  initialize(entityManager, input, player, projectilePool) {
    super.initialize(entityManager, input, player);
    this._projectilePool = projectilePool;
  }

  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const target = this.getTarget(weapon, playerPos);

    if (!target && weapon.targetingMode !== 'rotating') {
      return []; // No target, don't fire
    }

    const spawned = [];
    const count = weapon.projectileCount || 1;
    const spread = weapon.spread || 0;
    const baseDir = this.getBaseDirection(weapon, playerPos, target);

    for (let i = 0; i < count; i++) {
      // Calculate spread angle
      let dir = baseDir;
      if (spread > 0 && count > 1) {
        const angleOffset = (i - (count - 1) / 2) * spread;
        dir = this.rotate(baseDir, angleOffset * Math.PI / 180);
      }

      // Get projectile from pool or create new
      const projectile = this._projectilePool
        ? this._projectilePool.get()
        : new Projectile();

      // Configure projectile
      const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

      projectile.init({
        x: playerPos.x,
        y: playerPos.y,
        vx: dir.x * weapon.projectileSpeed,
        vy: dir.y * weapon.projectileSpeed,
        damage,
        isCritical,
        pierce: weapon.pierce || 0,
        lifetime: weapon.lifetime || 5,
        weapon: weapon,
        color: weapon.color,
        size: weapon.size || 8
      });

      this._entityManager.add(projectile);
      spawned.push(projectile);
    }

    return spawned;
  }

  getBaseDirection(weapon, playerPos, target) {
    switch (weapon.targetingMode) {
      case 'mouse':
        return this.direction(playerPos, this._input.mousePosition);

      case 'rotating':
        const angle = (Date.now() / 1000) * (weapon.rotationSpeed || 90) * Math.PI / 180;
        return { x: Math.cos(angle), y: Math.sin(angle) };

      default:
        if (target && target.getComponent) {
          return this.direction(playerPos, target.getComponent(Transform).position);
        }
        return { x: 0, y: -1 }; // Default up
    }
  }
}
```

---

### 2. LaserBehavior

**Purpose:** Instant line damage from player to target

**File:** `v3/game/behaviors/LaserBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { Laser } from '../entities/Laser.js';

export class LaserBehavior extends WeaponBehavior {
  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const target = this.getTarget(weapon, playerPos);

    if (!target) return [];

    const targetPos = target.getComponent
      ? target.getComponent(Transform).position
      : target;

    const dir = this.direction(playerPos, targetPos);
    const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

    // Create laser entity
    const laser = new Laser();
    laser.init({
      startX: playerPos.x,
      startY: playerPos.y,
      dirX: dir.x,
      dirY: dir.y,
      range: weapon.range,
      width: weapon.width || 4,
      duration: weapon.duration || 0.2,
      damage,
      isCritical,
      pierce: weapon.pierce || Infinity,
      weapon: weapon,
      color: weapon.color
    });

    this._entityManager.add(laser);

    // Find all enemies in laser path and damage them
    const enemies = this._entityManager.getByTag('enemy');
    let pierceCount = 0;

    enemies.forEach(enemy => {
      if (pierceCount >= (weapon.pierce || Infinity)) return;

      const enemyPos = enemy.getComponent(Transform).position;
      const distToLine = this.pointToLineDistance(
        enemyPos, playerPos,
        { x: playerPos.x + dir.x * weapon.range, y: playerPos.y + dir.y * weapon.range }
      );

      if (distToLine <= (weapon.width || 4) / 2 + enemy.getComponent(Collider).radius) {
        events.emit('weapon:hit', {
          weapon,
          target: enemy,
          damage,
          isCritical,
          source: player
        });
        pierceCount++;
      }
    });

    return [laser];
  }

  pointToLineDistance(point, lineStart, lineEnd) {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;

    param = Math.max(0, Math.min(1, param));

    const xx = lineStart.x + param * C;
    const yy = lineStart.y + param * D;

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

---

### 3. MeleeBehavior (Swing)

**Purpose:** Arc attack around player

**File:** `v3/game/behaviors/MeleeBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { MeleeSwing } from '../entities/MeleeSwing.js';

export class MeleeBehavior extends WeaponBehavior {
  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const target = this.getTarget(weapon, playerPos);

    // Determine swing direction
    let angle;
    if (target && target.getComponent) {
      const targetPos = target.getComponent(Transform).position;
      angle = Math.atan2(targetPos.y - playerPos.y, targetPos.x - playerPos.x);
    } else {
      angle = player.facingAngle || 0;
    }

    const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

    // Create swing entity
    const swing = new MeleeSwing();
    swing.init({
      x: playerPos.x,
      y: playerPos.y,
      angle,
      arcAngle: weapon.arcAngle || 120,
      range: weapon.range,
      swingSpeed: weapon.swingSpeed || 2.0,
      damage,
      isCritical,
      knockback: weapon.knockback || 0,
      weapon: weapon,
      color: weapon.color
    });

    this._entityManager.add(swing);

    return [swing];
  }
}
```

---

### 4. ThrustBehavior

**Purpose:** Linear thrust attack in direction

**File:** `v3/game/behaviors/ThrustBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { MeleeThrust } from '../entities/MeleeThrust.js';

export class ThrustBehavior extends WeaponBehavior {
  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const target = this.getTarget(weapon, playerPos);

    let dir;
    if (target && target.getComponent) {
      dir = this.direction(playerPos, target.getComponent(Transform).position);
    } else if (weapon.targetingMode === 'mouse') {
      dir = this.direction(playerPos, this._input.mousePosition);
    } else {
      dir = { x: Math.cos(player.facingAngle || 0), y: Math.sin(player.facingAngle || 0) };
    }

    const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

    const thrust = new MeleeThrust();
    thrust.init({
      x: playerPos.x,
      y: playerPos.y,
      dirX: dir.x,
      dirY: dir.y,
      range: weapon.range,
      width: weapon.width || 20,
      thrustSpeed: weapon.thrustSpeed || 800,
      holdDuration: weapon.holdDuration || 0.1,
      damage,
      isCritical,
      weapon: weapon,
      color: weapon.color
    });

    this._entityManager.add(thrust);

    return [thrust];
  }
}
```

---

### 5. AreaBehavior

**Purpose:** Spawn stationary damage zone

**File:** `v3/game/behaviors/AreaBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { AreaEffect } from '../entities/AreaEffect.js';

export class AreaBehavior extends WeaponBehavior {
  _areaPool = null;

  initialize(entityManager, input, player, areaPool) {
    super.initialize(entityManager, input, player);
    this._areaPool = areaPool;
  }

  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const target = this.getTarget(weapon, playerPos);

    // Position: at target, at mouse, or at player
    let x, y;
    if (target && target.getComponent) {
      const pos = target.getComponent(Transform).position;
      x = pos.x;
      y = pos.y;
    } else if (weapon.targetingMode === 'mouse') {
      x = this._input.mousePosition.x;
      y = this._input.mousePosition.y;
    } else {
      x = playerPos.x;
      y = playerPos.y;
    }

    const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

    const area = this._areaPool ? this._areaPool.get() : new AreaEffect();
    area.init({
      x,
      y,
      radius: weapon.range || weapon.areaRadius,
      duration: weapon.duration,
      tickRate: weapon.tickRate || 0.5,
      damagePerTick: damage / Math.ceil(weapon.duration / (weapon.tickRate || 0.5)),
      weapon: weapon,
      color: weapon.color
    });

    this._entityManager.add(area);

    return [area];
  }
}
```

---

### 6. ParticleBehavior

**Purpose:** Create orbiting/following particles

**File:** `v3/game/behaviors/ParticleBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { OrbitParticle } from '../entities/OrbitParticle.js';

export class ParticleBehavior extends WeaponBehavior {
  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const count = weapon.particleCount || 4;
    const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

    const spawned = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;

      const particle = new OrbitParticle();
      particle.init({
        centerEntity: player,
        orbitRadius: weapon.orbitRadius || 50,
        orbitSpeed: weapon.orbitSpeed || 2,
        startAngle: angle,
        damage,
        isCritical,
        weapon: weapon,
        color: weapon.color,
        size: weapon.particleSize || weapon.size || 8
      });

      this._entityManager.add(particle);
      spawned.push(particle);
    }

    return spawned;
  }
}
```

---

### 7. MineBehavior

**Purpose:** Deploy triggered explosives

**File:** `v3/game/behaviors/MineBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { Mine } from '../entities/Mine.js';

export class MineBehavior extends WeaponBehavior {
  _minePool = null;

  initialize(entityManager, input, player, minePool) {
    super.initialize(entityManager, input, player);
    this._minePool = minePool;
  }

  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const count = weapon.mineCount || 1;
    const { damage, isCritical } = this.calculateDamage(weapon, player.stats);

    const spawned = [];

    for (let i = 0; i < count; i++) {
      // Spread mines around player
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 30 + Math.random() * 50;

      const mine = this._minePool ? this._minePool.get() : new Mine();
      mine.init({
        x: playerPos.x + Math.cos(angle) * dist,
        y: playerPos.y + Math.sin(angle) * dist,
        triggerRadius: weapon.triggerRadius || 30,
        explosionRadius: weapon.explosionRadius || 80,
        armDelay: weapon.armDelay || 0.5,
        triggerMode: weapon.triggerMode || 'proximity',
        damage,
        isCritical,
        weapon: weapon,
        color: weapon.color
      });

      this._entityManager.add(mine);
      spawned.push(mine);
    }

    return spawned;
  }
}
```

---

### 8. SummonBehavior

**Purpose:** Spawn minion entities

**File:** `v3/game/behaviors/SummonBehavior.js`

```javascript
import { WeaponBehavior } from './WeaponBehavior.js';
import { Summon } from '../entities/Summon.js';
import { summonRegistry } from '../data/summons/registry.js';

export class SummonBehavior extends WeaponBehavior {
  _activeSummons = new Map(); // weaponId -> count

  execute(weapon, player) {
    const playerPos = player.getComponent(Transform).position;
    const summonData = summonRegistry.get(weapon.summonId);

    if (!summonData) {
      console.warn(`Unknown summon: ${weapon.summonId}`);
      return [];
    }

    // Check max active
    const currentCount = this._activeSummons.get(weapon.id) || 0;
    const maxActive = weapon.maxActive || summonData.maxCount || 2;

    if (currentCount >= maxActive) {
      return []; // Max summons already active
    }

    const count = Math.min(weapon.summonCount || 1, maxActive - currentCount);
    const spawned = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 30;

      const summon = new Summon();
      summon.init({
        x: playerPos.x + Math.cos(angle) * dist,
        y: playerPos.y + Math.sin(angle) * dist,
        summonData,
        duration: weapon.summonDuration || summonData.duration,
        owner: player,
        weapon: weapon,
        onDespawn: () => {
          const count = this._activeSummons.get(weapon.id) || 0;
          this._activeSummons.set(weapon.id, Math.max(0, count - 1));
        }
      });

      this._entityManager.add(summon);
      spawned.push(summon);
    }

    this._activeSummons.set(weapon.id, currentCount + spawned.length);

    return spawned;
  }
}
```

---

## Targeting Mode Implementation

### In WeaponBehavior Base Class

The `getTarget()` method handles targeting modes:

```javascript
getTarget(weapon, playerPos) {
  switch (weapon.targetingMode) {
    case 'nearest':
      return this.findNearestEnemy(playerPos, weapon.range);

    case 'random':
      return this.findRandomEnemy(playerPos, weapon.range);

    case 'mouse':
      return this._input.mousePosition;

    case 'rotating':
      return null; // Direction calculated separately

    case 'chain':
      return this.findNearestEnemy(playerPos, weapon.range);

    default:
      return this.findNearestEnemy(playerPos, weapon.range);
  }
}
```

### Chain Targeting

For chain weapons (like lightning), implement chain logic in the behavior:

```javascript
getChainTargets(startPos, weapon, hitEntities = new Set()) {
  const targets = [];
  let currentPos = startPos;

  for (let i = 0; i < (weapon.chainCount || 3); i++) {
    const enemies = this._entityManager.getByTag('enemy');
    let nearest = null;
    let nearestDist = weapon.chainRange || 100;

    enemies.forEach(enemy => {
      if (hitEntities.has(enemy)) return;

      const pos = enemy.getComponent(Transform).position;
      const dist = this.distance(currentPos, pos);

      if (dist < nearestDist) {
        nearest = enemy;
        nearestDist = dist;
      }
    });

    if (!nearest) break;

    targets.push(nearest);
    hitEntities.add(nearest);
    currentPos = nearest.getComponent(Transform).position;
  }

  return targets;
}
```

---

## WeaponSystem Integration

**File:** `v3/game/systems/WeaponSystem.js`

```javascript
import { System } from '../../reference-framework/ecs/System.js';
import { ProjectileBehavior } from '../behaviors/ProjectileBehavior.js';
import { LaserBehavior } from '../behaviors/LaserBehavior.js';
import { MeleeBehavior } from '../behaviors/MeleeBehavior.js';
import { ThrustBehavior } from '../behaviors/ThrustBehavior.js';
import { AreaBehavior } from '../behaviors/AreaBehavior.js';
import { ParticleBehavior } from '../behaviors/ParticleBehavior.js';
import { MineBehavior } from '../behaviors/MineBehavior.js';
import { SummonBehavior } from '../behaviors/SummonBehavior.js';

export class WeaponSystem extends System {
  _priority = 40;
  _behaviors = {};

  initialize(game, entityManager) {
    super.initialize(game, entityManager);

    const input = game.input;
    const player = entityManager.getByTag('player')[0];

    // Initialize behaviors
    this._behaviors = {
      projectile: new ProjectileBehavior(),
      laser: new LaserBehavior(),
      melee_swing: new MeleeBehavior(),
      melee_thrust: new ThrustBehavior(),
      area_damage: new AreaBehavior(),
      particle: new ParticleBehavior(),
      mine: new MineBehavior(),
      summon: new SummonBehavior()
    };

    // Initialize each behavior
    Object.values(this._behaviors).forEach(b => {
      b.initialize(entityManager, input, player);
    });
  }

  update(deltaTime) {
    const player = this._entityManager.getByTag('player')[0];
    if (!player) return;

    const weaponSlot = player.getComponent(WeaponSlot);
    if (!weaponSlot) return;

    weaponSlot.weapons.forEach(weapon => {
      // Update cooldown
      weapon.currentCooldown -= deltaTime;

      // Check if can fire
      if (weapon.currentCooldown <= 0 && weapon.isAuto) {
        this.fireWeapon(weapon, player);
      }
    });
  }

  fireWeapon(weapon, player) {
    const behavior = this._behaviors[weapon.attackType];

    if (!behavior) {
      console.warn(`Unknown attack type: ${weapon.attackType}`);
      return;
    }

    // Execute behavior
    const entities = behavior.execute(weapon, player);

    // Reset cooldown
    weapon.currentCooldown = this.getEffectiveCooldown(weapon, player);

    // Emit event
    events.emit('weapon:fired', { weapon, entities, player });
  }

  getEffectiveCooldown(weapon, player) {
    const base = weapon.cooldown;
    const stats = player.getComponent(PlayerStats);
    const reduction = stats?.cooldownReduction || 0;

    // Cap at 90% reduction
    return base * (1 - Math.min(reduction, 0.9));
  }
}
```

---

## Adding New Behaviors

### Step 1: Create Behavior Class

```javascript
// v3/game/behaviors/MyNewBehavior.js
import { WeaponBehavior } from './WeaponBehavior.js';

export class MyNewBehavior extends WeaponBehavior {
  execute(weapon, player) {
    // Implementation
    return []; // Return spawned entities
  }
}
```

### Step 2: Register in WeaponSystem

```javascript
// In WeaponSystem.initialize()
import { MyNewBehavior } from '../behaviors/MyNewBehavior.js';

this._behaviors = {
  // ... existing behaviors
  my_new_type: new MyNewBehavior()
};
```

### Step 3: Add Attack Type Constant

```javascript
// In constants.js
export const AttackType = {
  // ... existing types
  MY_NEW_TYPE: 'my_new_type'
};
```

### Step 4: Create Weapon Data

```javascript
// In weapons data
{
  id: 'my_new_weapon',
  attackType: 'my_new_type',
  // ... other properties
}
```

---

## Related Documentation

- [06-future-features.md](./06-future-features.md) - Attack type overview
- [07-data-patterns.md](./07-data-patterns.md) - Data organization
- [05-entity-components.md](./05-entity-components.md) - Weapon component specs

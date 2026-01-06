# Entity and Component Design

## Component Overview

| Component | Source | Purpose |
|-----------|--------|---------|
| Transform | Framework | Position, size, rotation |
| Velocity | Framework | Movement speed (vx, vy) |
| Health | Framework (RF) | Current/max HP, invincibility |
| Collider | Framework (RF) | Collision detection |
| Sprite | Framework (RF) | Visual rendering |
| Lifetime | Framework (RF) | Auto-destroy after duration |
| Weapon | Custom | Weapon stats for player |
| WeaponSlot | Custom | Multiple equipped weapons |
| BuffDebuff | Custom | Active status effects |
| PlayerStats | Custom | Stat modifiers and bonuses |

---

## Player Entity

**File:** `v3/game/entities/Player.js`

**Components:**

| Component | Configuration |
|-----------|---------------|
| Transform | x: center, y: center, width: 32, height: 32 |
| Velocity | vx: 0, vy: 0 |
| Health | current: 100, max: 100 |
| Collider | type: circle, radius: 16, layer: PLAYER |
| Sprite | shape: circle, color: #4cc9f0 |
| Weapon | damage: 10, cooldown: 0.5, range: 400 |

**Tags:** `player`

**Custom Properties:**
- `speed`: 200 (pixels/second)

```javascript
export class Player extends Entity {
  constructor() {
    super();
    this.addComponent(new Transform(0, 0, 32, 32));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Health(100));
    this.addComponent(new Collider(/* ... */));
    this.addComponent(new Sprite({ shape: 'circle', color: '#4cc9f0' }));
    this.addComponent(new Weapon({ damage: 10, cooldown: 0.5, range: 400 }));
    this.addTag('player');
    this.speed = 200;
  }
}
```

---

## Enemy Entity

**File:** `v3/game/entities/Enemy.js`

**Components:**

| Component | Configuration |
|-----------|---------------|
| Transform | x: spawn, y: spawn, width: 24, height: 24 |
| Velocity | vx: 0, vy: 0 |
| Health | current: 30, max: 30 |
| Collider | type: circle, radius: 12, layer: ENEMY |
| Sprite | shape: circle, color: #f72585 |

**Tags:** `enemy`

**Custom Properties:**
- `speed`: 80 (pixels/second)
- `damage`: 10 (contact damage)

```javascript
export class Enemy extends Entity {
  constructor() {
    super();
    this.addComponent(new Transform(0, 0, 24, 24));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Health(30));
    this.addComponent(new Collider(/* ... */));
    this.addComponent(new Sprite({ shape: 'circle', color: '#f72585' }));
    this.addTag('enemy');
    this.speed = 80;
    this.damage = 10;
  }
}
```

---

## Projectile Entity

**File:** `v3/game/entities/Projectile.js`

**Components:**

| Component | Configuration |
|-----------|---------------|
| Transform | x: player, y: player, width: 8, height: 8 |
| Velocity | vx: toward target, vy: toward target |
| Collider | type: circle, radius: 4, layer: PROJECTILE |
| Sprite | shape: circle, color: #ffff00 |
| Lifetime | duration: 3.0 seconds |

**Tags:** `projectile`

**Custom Properties:**
- `damage`: 10 (from weapon)

```javascript
export class Projectile extends Entity {
  constructor() {
    super();
    this.addComponent(new Transform(0, 0, 8, 8));
    this.addComponent(new Velocity(0, 0));
    this.addComponent(new Collider(/* ... */));
    this.addComponent(new Sprite({ shape: 'circle', color: '#ffff00' }));
    this.addComponent(new Lifetime(3.0));
    this.addTag('projectile');
    this.damage = 10;
  }

  init(x, y, vx, vy, damage) {
    // Reset for pooling
  }
}
```

---

## Custom Weapon Component

**File:** `v3/game/components/Weapon.js`

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| damage | number | 10 | Damage per hit |
| cooldown | number | 0.5 | Seconds between shots |
| range | number | 400 | Targeting range (pixels) |
| projectileSpeed | number | 500 | Projectile velocity |
| projectileSize | number | 8 | Projectile diameter |
| lastFired | number | 0 | Timestamp of last shot |

```javascript
export class Weapon extends Component {
  constructor(config = {}) {
    super();
    this.damage = config.damage || 10;
    this.cooldown = config.cooldown || 0.5;
    this.range = config.range || 400;
    this.projectileSpeed = config.projectileSpeed || 500;
    this.projectileSize = config.projectileSize || 8;
    this.lastFired = 0;
  }
}
```

---

## Extended Weapon Properties (Post-MVP)

**File:** `v3/game/components/Weapon.js`

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| id | string | - | Unique weapon identifier |
| name | string | - | Display name |
| attackType | string | 'projectile' | Attack behavior type |
| targetingMode | string | 'nearest' | Target selection mode |
| isAuto | boolean | true | Auto-fire or manual |

### Combat Stats

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| damage | number | 10 | Base damage per hit |
| cooldown | number | 0.5 | Seconds between attacks |
| range | number | 400 | Attack/targeting range |
| critChance | number | 0 | Critical hit probability (0-1) |
| critMultiplier | number | 2 | Critical damage multiplier |

### Projectile Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| projectileSpeed | number | 500 | Travel speed |
| projectileCount | number | 1 | Projectiles per attack |
| pierce | number | 0 | Enemies pierced |
| spread | number | 0 | Angle between projectiles |
| ricochet | number | 0 | Screen bounces |
| lifetime | number | 5 | Seconds before despawn |

### Effect Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| statusEffects | array | [] | Effects to apply on hit |
| knockback | number | 0 | Push force |
| lifesteal | number | 0 | HP gained (% of damage) |
| healOnHit | number | 0 | Flat HP per hit |

### Progression Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| tier | number | 1 | Rarity tier (1-5) |
| level | number | 1 | Current level |
| maxLevel | number | 5 | Maximum level |
| rarity | string | 'common' | Rarity name |

---

## WeaponSlot Component (Post-MVP)

**File:** `v3/game/components/WeaponSlot.js`

**Purpose:** Manage multiple equipped weapons

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| weapons | array | [] | Equipped weapon instances |
| maxSlots | number | 6 | Maximum weapons equipped |

```javascript
export class WeaponSlot extends Component {
  constructor(maxSlots = 6) {
    super();
    this.weapons = [];
    this.maxSlots = maxSlots;
  }

  addWeapon(weaponData) {
    if (this.weapons.length >= this.maxSlots) return false;
    const weapon = new WeaponInstance(weaponData);
    this.weapons.push(weapon);
    return true;
  }

  removeWeapon(weaponId) {
    const index = this.weapons.findIndex(w => w.id === weaponId);
    if (index !== -1) {
      this.weapons.splice(index, 1);
      return true;
    }
    return false;
  }

  getWeapon(weaponId) {
    return this.weapons.find(w => w.id === weaponId);
  }

  hasWeapon(weaponId) {
    return this.weapons.some(w => w.id === weaponId);
  }

  upgradeWeapon(weaponId) {
    const weapon = this.getWeapon(weaponId);
    if (weapon && weapon.level < weapon.maxLevel) {
      weapon.levelUp();
      return true;
    }
    return false;
  }
}
```

---

## BuffDebuff Component (Post-MVP)

**File:** `v3/game/components/BuffDebuff.js`

**Purpose:** Manage active status effects on an entity

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| effects | Map | new Map() | Active effects by ID |

### Effect Types

| Type | Description | Example |
|------|-------------|---------|
| DOT | Damage over time | burning, poison |
| STAT_MOD | Stat modification | slow, haste |
| HOT | Heal over time | regeneration |
| SHIELD | Damage absorption | barrier |

### Effect Structure

| Property | Type | Description |
|----------|------|-------------|
| id | string | Effect identifier |
| type | string | DOT, STAT_MOD, HOT, SHIELD |
| duration | number | Remaining duration (seconds) |
| maxDuration | number | Original duration |
| tickRate | number | Time between ticks |
| tickTimer | number | Current tick countdown |
| value | number | Effect magnitude |
| stacks | number | Current stack count |
| maxStacks | number | Maximum stacks |
| source | string | What applied this effect |

```javascript
export class BuffDebuff extends Component {
  constructor() {
    super();
    this.effects = new Map();
  }

  addEffect(effectData) {
    const existing = this.effects.get(effectData.id);

    if (existing && effectData.stackable) {
      // Stack the effect
      existing.stacks = Math.min(existing.stacks + 1, effectData.maxStacks);
      if (effectData.stackMode === 'duration') {
        existing.duration += effectData.duration;
      }
    } else {
      // Add new effect
      this.effects.set(effectData.id, {
        ...effectData,
        tickTimer: effectData.tickRate || 0,
        stacks: 1
      });
    }
  }

  removeEffect(effectId) {
    return this.effects.delete(effectId);
  }

  hasEffect(effectId) {
    return this.effects.has(effectId);
  }

  getStatModifier(statName) {
    let modifier = 0;
    this.effects.forEach(effect => {
      if (effect.type === 'STAT_MOD' && effect.stat === statName) {
        modifier += effect.value * effect.stacks;
      }
    });
    return modifier;
  }

  update(deltaTime) {
    const expiredEffects = [];

    this.effects.forEach((effect, id) => {
      effect.duration -= deltaTime;

      if (effect.duration <= 0) {
        expiredEffects.push(id);
      }
    });

    expiredEffects.forEach(id => this.effects.delete(id));
    return expiredEffects;
  }
}
```

---

## PlayerStats Component (Post-MVP)

**File:** `v3/game/components/PlayerStats.js`

**Purpose:** Player stat modifiers from upgrades, tech cores, etc.

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| damageBonus | number | 0 | Additive damage % |
| cooldownReduction | number | 0 | Cooldown reduction % |
| areaBonus | number | 0 | Area of effect % |
| speedBonus | number | 0 | Movement speed % |
| healthBonus | number | 0 | Max health bonus |
| pickupRadius | number | 0 | Item pickup radius bonus |
| xpBonus | number | 0 | XP gain % |
| critChance | number | 0 | Global crit chance |
| armor | number | 0 | Damage reduction |
| regen | number | 0 | HP per second |

```javascript
export class PlayerStats extends Component {
  constructor() {
    super();
    this.damageBonus = 0;
    this.cooldownReduction = 0;
    this.areaBonus = 0;
    this.speedBonus = 0;
    this.healthBonus = 0;
    this.pickupRadius = 0;
    this.xpBonus = 0;
    this.critChance = 0;
    this.armor = 0;
    this.regen = 0;
  }

  addBonus(stat, value) {
    if (stat in this) {
      this[stat] += value;
    }
  }

  getEffectiveStat(baseStat, statName) {
    const bonus = this[statName + 'Bonus'] || 0;
    return baseStat * (1 + bonus);
  }
}
```

---

## Collision Layers

| Layer | Bit | Collides With |
|-------|-----|---------------|
| PLAYER | 1 | ENEMY |
| ENEMY | 2 | PLAYER, PROJECTILE |
| PROJECTILE | 4 | ENEMY |

```javascript
// Using framework CollisionLayers
import { CollisionLayers } from '../reference-framework/lib/RF/physics/CollisionLayers.js';

// Player collider
new Collider(16, CollisionLayers.PLAYER, CollisionLayers.ENEMY);

// Enemy collider
new Collider(12, CollisionLayers.ENEMY, CollisionLayers.PLAYER | CollisionLayers.PROJECTILE);

// Projectile collider
new Collider(4, CollisionLayers.PROJECTILE, CollisionLayers.ENEMY);
```

---

## Entity Lifecycle

### Creation

```javascript
// In EnemySystem
const enemy = this.entityManager.create(Enemy);
enemy.getComponent(Transform).x = spawnX;
enemy.getComponent(Transform).y = spawnY;
```

### Destruction

```javascript
// In CombatSystem
if (health.isDead) {
  this.entityManager.remove(enemy);
}
```

### Pooling (Future Enhancement)

```javascript
// Using ObjectPool from framework
const enemyPool = new ObjectPool(() => new Enemy(), e => e.reset());
const enemy = enemyPool.get();
// Later:
enemyPool.release(enemy);
```

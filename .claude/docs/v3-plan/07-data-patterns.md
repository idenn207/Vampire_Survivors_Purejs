# Data Patterns

## Overview

V3 uses extended Registry patterns for game content (weapons, enemies, bosses, etc.). This document describes how to organize and validate data.

---

## GameRegistry Pattern

### Purpose

Extend the framework's `Registry` class to add:

- Validation of required fields
- Helper functions (getByTier, getByRarity, filter)
- Console logging of load counts
- Cross-registry linking

### Implementation

**File:** `v3/game/patterns/GameRegistry.js`

```javascript
import { Registry } from '../../reference-framework/lib/RF/patterns/Registry.js';

export class GameRegistry extends Registry {
  _name = 'Unnamed';
  _validators = [];
  _finalized = false;

  constructor(name) {
    super();
    this._name = name;
  }

  // Add a validation function
  addValidator(fn) {
    this._validators.push(fn);
  }

  // Run validators and log count
  finalize() {
    if (this._finalized) return;

    const entries = this.getAll();
    entries.forEach((data, id) => {
      this._validators.forEach(v => v(data, id));
    });

    console.log(`[${this._name}] Loaded ${this.count} entries`);
    this._finalized = true;
  }

  // Get items by tier
  getByTier(tier) {
    return this.filter(item => item.tier === tier);
  }

  // Get items by rarity
  getByRarity(rarity) {
    return this.filter(item => item.rarity === rarity);
  }

  // Filter with predicate
  filter(predicate) {
    return this.getAll().filter(predicate);
  }

  // Get random item
  getRandom() {
    const all = this.getAll();
    return all[Math.floor(Math.random() * all.length)];
  }

  // Get random item matching predicate
  getRandomWhere(predicate) {
    const matches = this.filter(predicate);
    if (matches.length === 0) return null;
    return matches[Math.floor(Math.random() * matches.length)];
  }
}
```

---

## Validator Functions

### Purpose

Validate data entries at load time to catch configuration errors early.

### Common Validators

```javascript
// Required fields validator
function requiredFields(fields) {
  return (data, id) => {
    fields.forEach(field => {
      if (!(field in data)) {
        console.warn(`[${id}] Missing required field: ${field}`);
      }
    });
  };
}

// Type validator
function typeCheck(field, expectedType) {
  return (data, id) => {
    if (field in data && typeof data[field] !== expectedType) {
      console.warn(`[${id}] Field '${field}' should be ${expectedType}, got ${typeof data[field]}`);
    }
  };
}

// Range validator
function rangeCheck(field, min, max) {
  return (data, id) => {
    if (field in data) {
      const value = data[field];
      if (value < min || value > max) {
        console.warn(`[${id}] Field '${field}' value ${value} outside range [${min}, ${max}]`);
      }
    }
  };
}

// Enum validator
function enumCheck(field, validValues) {
  return (data, id) => {
    if (field in data && !validValues.includes(data[field])) {
      console.warn(`[${id}] Field '${field}' has invalid value: ${data[field]}`);
    }
  };
}
```

### Usage Example

```javascript
const weaponRegistry = new GameRegistry('Weapons');

// Add validators
weaponRegistry.addValidator(requiredFields([
  'id', 'name', 'attackType', 'damage', 'cooldown'
]));

weaponRegistry.addValidator(enumCheck('attackType', [
  'projectile', 'laser', 'melee_swing', 'melee_thrust',
  'area_damage', 'particle', 'mine', 'summon'
]));

weaponRegistry.addValidator(rangeCheck('damage', 1, 1000));
weaponRegistry.addValidator(rangeCheck('cooldown', 0.1, 10));

// Register weapons...
weaponRegistry.register('arcane_dart', { ... });

// Finalize (runs validators, logs count)
weaponRegistry.finalize();
```

---

## Data File Organization

### Directory Structure

```
v3/game/data/
├── weapons/
│   ├── common/           # Tier 1 weapons
│   │   ├── arcane_dart.js
│   │   └── stone_throw.js
│   ├── uncommon/         # Tier 2 weapons
│   ├── rare/             # Tier 3 weapons
│   ├── epic/             # Tier 4 weapons
│   ├── legendary/        # Tier 5 weapons
│   ├── index.js          # Barrel export
│   └── registry.js       # GameRegistry instance
├── enemies/
│   ├── normal.js
│   ├── fast.js
│   ├── tank.js
│   ├── index.js
│   └── registry.js
├── bosses/
│   ├── elite.js
│   ├── miniboss.js
│   ├── boss.js
│   ├── index.js
│   └── registry.js
├── effects/
│   ├── buffs/
│   ├── debuffs/
│   ├── index.js
│   └── registry.js
├── techcores/
│   ├── pyromancy.js
│   ├── cryomancy.js
│   ├── index.js
│   └── registry.js
└── summons/
    ├── wolf.js
    ├── turret.js
    ├── index.js
    └── registry.js
```

### Individual Data File Pattern

```javascript
// v3/game/data/weapons/common/arcane_dart.js
export const arcane_dart = {
  id: 'arcane_dart',
  name: 'Arcane Dart',
  description: 'A swift magical projectile',

  // Attack configuration
  attackType: 'projectile',
  targetingMode: 'nearest',
  isAuto: true,

  // Base stats
  damage: 12,
  cooldown: 0.6,
  range: 350,
  projectileSpeed: 450,
  projectileCount: 1,
  pierce: 0,

  // Visual
  color: '#9966ff',
  size: 6,
  shape: 'circle',

  // Progression
  tier: 1,
  rarity: 'common',
  maxLevel: 5,

  // Per-level upgrades
  upgrades: {
    2: { damage: 16, cooldown: 0.55 },
    3: { damage: 22, projectileCount: 2 },
    4: { damage: 28, pierce: 1 },
    5: { damage: 36, projectileCount: 3 }
  }
};
```

### Barrel Export Pattern

```javascript
// v3/game/data/weapons/common/index.js
export * from './arcane_dart.js';
export * from './stone_throw.js';
export * from './fire_bolt.js';
// ... all common weapons
```

```javascript
// v3/game/data/weapons/index.js
export * from './common/index.js';
export * from './uncommon/index.js';
export * from './rare/index.js';
export * from './epic/index.js';
export * from './legendary/index.js';
```

### Registry File Pattern

```javascript
// v3/game/data/weapons/registry.js
import { GameRegistry } from '../../patterns/GameRegistry.js';
import * as weapons from './index.js';

export const weaponRegistry = new GameRegistry('Weapons');

// Add validators
weaponRegistry.addValidator((weapon, id) => {
  const required = ['id', 'name', 'attackType', 'damage', 'cooldown'];
  required.forEach(field => {
    if (!(field in weapon)) {
      console.warn(`[Weapons] ${id} missing field: ${field}`);
    }
  });
});

// Register all weapons
Object.values(weapons).forEach(w => {
  if (w && typeof w === 'object' && w.id) {
    weaponRegistry.register(w.id, w);
  }
});

// Finalize
weaponRegistry.finalize();

// Helper exports
export function getWeapon(id) {
  return weaponRegistry.get(id);
}

export function getWeaponsByTier(tier) {
  return weaponRegistry.getByTier(tier);
}

export function getWeaponsByRarity(rarity) {
  return weaponRegistry.getByRarity(rarity);
}

export function getRandomWeapon(predicate) {
  return predicate
    ? weaponRegistry.getRandomWhere(predicate)
    : weaponRegistry.getRandom();
}
```

---

## Cross-Registry Linking

### Purpose

Link data across registries (e.g., tech cores to weapons, evolution recipes).

### Evolution Recipe Registry

```javascript
// v3/game/data/evolution/registry.js
import { GameRegistry } from '../../patterns/GameRegistry.js';
import { weaponRegistry } from '../weapons/registry.js';

export const evolutionRegistry = new GameRegistry('Evolutions');

// Validator: check weapon IDs exist
evolutionRegistry.addValidator((recipe, id) => {
  if (!weaponRegistry.has(recipe.weapon1)) {
    console.warn(`[Evolution] ${id} references unknown weapon: ${recipe.weapon1}`);
  }
  if (!weaponRegistry.has(recipe.weapon2)) {
    console.warn(`[Evolution] ${id} references unknown weapon: ${recipe.weapon2}`);
  }
  if (!weaponRegistry.has(recipe.result)) {
    console.warn(`[Evolution] ${id} references unknown result: ${recipe.result}`);
  }
});

// Register recipes
evolutionRegistry.register('fire_ice_storm', {
  weapon1: 'flame_bolt',
  weapon2: 'ice_shard',
  result: 'elemental_storm'
});

evolutionRegistry.finalize();

// Helper: find evolution for weapon pair
export function findEvolution(weaponId1, weaponId2) {
  const key1 = [weaponId1, weaponId2].sort().join('_');

  for (const recipe of evolutionRegistry.getAll()) {
    const key2 = [recipe.weapon1, recipe.weapon2].sort().join('_');
    if (key1 === key2) {
      return recipe;
    }
  }

  return null;
}
```

---

## Constants Pattern

### Purpose

Define enums and constants used across data files.

### Implementation

```javascript
// v3/game/data/constants.js

// Attack types
export const AttackType = {
  PROJECTILE: 'projectile',
  LASER: 'laser',
  MELEE_SWING: 'melee_swing',
  MELEE_THRUST: 'melee_thrust',
  AREA_DAMAGE: 'area_damage',
  PARTICLE: 'particle',
  MINE: 'mine',
  SUMMON: 'summon'
};

// Targeting modes
export const TargetingMode = {
  NEAREST: 'nearest',
  RANDOM: 'random',
  MOUSE: 'mouse',
  ROTATING: 'rotating',
  CHAIN: 'chain'
};

// Rarity tiers
export const Rarity = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

// Effect categories
export const EffectCategory = {
  BUFF: 'buff',
  DEBUFF: 'debuff'
};

// Effect types
export const EffectType = {
  DOT: 'dot',
  HOT: 'hot',
  STAT_MOD: 'stat_mod',
  SHIELD: 'shield'
};

// Enemy behavior types
export const EnemyBehavior = {
  CHASE: 'chase',
  RANGED: 'ranged',
  SUPPORT: 'support',
  KAMIKAZE: 'kamikaze'
};

// Collision layers
export const CollisionLayer = {
  PLAYER: 1,
  ENEMY: 2,
  PROJECTILE: 4,
  PICKUP: 8,
  BOSS: 16
};
```

---

## Related Documentation

- [05-entity-components.md](./05-entity-components.md) - Component specifications
- [08-weapon-behaviors.md](./08-weapon-behaviors.md) - Behavior implementations
- [09-framework-gaps.md](../.claude/docs/v3-reference/09-framework-gaps.md) - Custom implementation needs

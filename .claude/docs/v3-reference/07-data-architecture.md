# Data Architecture

This document provides a deep dive into the data-driven architecture used in V2, specifically the Registry + Aggregator pattern for game content.

## Overview

All game content (weapons, enemies, bosses, buffs, tech cores, summons) follows a consistent data flow:

```
Constants → Registry → Individual Files → Aggregator → Final Data → Helper Functions
```

This enables:
- **Modularity**: One file per content item
- **Organization**: Content grouped by type/rarity
- **Extensibility**: Add content without modifying core code
- **Single source of truth**: Aggregator provides final merged data

---

## Data Flow Diagram

```
┌─────────────────────┐
│  WeaponConstants.js │  ← Enums (AttackType, TargetingMode)
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  WeaponRegistry.js  │  ← Empty registry object
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  arcane_dart.js     │
│  ice_shard.js       │  ← Individual weapon definitions
│  fireball.js        │     (register to WeaponRegistry)
│  ... (100+ files)   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ WeaponAggregator.js │  ← Merge registry into WeaponData
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   Data.WeaponData   │  ← Final data object + helper functions
└─────────────────────┘
```

---

## Weapon Data Structure

### File Organization

```
src/data/weapons/
├── WeaponConstants.js        # Enums: AttackType, TargetingMode, Rarity
├── WeaponRegistry.js         # Creates empty Data.WeaponRegistry
├── basic/
│   ├── common/               # Tier 1 weapons (30 files)
│   │   ├── arcane_dart.js
│   │   ├── stone_throw.js
│   │   └── ...
│   ├── uncommon/             # Tier 2 weapons (30 files)
│   ├── rare/                 # Tier 3 weapons (15 files)
│   └── epic/                 # Tier 4 weapons (10 files)
├── core/
│   ├── common/               # Tech core starting weapons
│   └── evolved/              # Tier 5 evolution weapons
└── WeaponAggregator.js       # Merges all into Data.WeaponData
```

### Constants Definition

```javascript
// WeaponConstants.js
(function (Data) {
  'use strict';

  var AttackType = {
    PROJECTILE: 'projectile',
    LASER: 'laser',
    MELEE_SWING: 'melee_swing',
    MELEE_THRUST: 'melee_thrust',
    AREA_DAMAGE: 'area_damage',
    PARTICLE: 'particle',
    MINE: 'mine',
    SUMMON: 'summon'
  };

  var TargetingMode = {
    NEAREST: 'nearest',
    RANDOM: 'random',
    MOUSE: 'mouse',
    ROTATING: 'rotating',
    CHAIN: 'chain'
  };

  var Rarity = {
    COMMON: 'common',       // Tier 1
    UNCOMMON: 'uncommon',   // Tier 2
    RARE: 'rare',           // Tier 3
    EPIC: 'epic',           // Tier 4
    LEGENDARY: 'legendary'  // Tier 5
  };

  Data.AttackType = AttackType;
  Data.TargetingMode = TargetingMode;
  Data.Rarity = Rarity;

})(window.VampireSurvivors.Data);
```

### Individual Weapon Definition

```javascript
// basic/common/arcane_dart.js
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.WeaponRegistry.arcane_dart = {
    // Identity
    id: 'arcane_dart',
    name: 'Arcane Dart',
    description: 'A swift magical projectile',

    // Attack configuration
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,               // Auto-fire (vs manual mouse click)

    // Base stats
    damage: 12,
    cooldown: 0.6,              // Seconds between attacks
    range: 350,                 // Attack range in pixels
    projectileSpeed: 450,
    projectileCount: 1,
    pierce: 0,                  // Enemies pierced
    duration: 0,                // For area effects

    // Visual
    color: '#9966ff',
    size: 6,
    shape: 'circle',
    imageId: null,              // Optional sprite
    visualScale: 1.0,

    // Effects
    trail: false,
    glow: true,
    knockback: 0,
    statusEffects: [],          // e.g., ['burning', 'slow']

    // Progression
    tier: 1,
    maxTier: 4,
    maxLevel: 5,
    rarity: 'common',

    // Per-level upgrades
    upgrades: {
      2: { damage: 16, cooldown: 0.55 },
      3: { damage: 22, projectileCount: 2, range: 400 },
      4: { damage: 28, cooldown: 0.5, pierce: 1 },
      5: { damage: 36, projectileCount: 3, projectileSpeed: 500 }
    }
  };

})(window.VampireSurvivors.Data);
```

### Aggregator

```javascript
// WeaponAggregator.js
(function (Data) {
  'use strict';

  // Create final data object
  Data.WeaponData = {};

  // Merge all registered weapons
  Object.keys(Data.WeaponRegistry).forEach(function(key) {
    Data.WeaponData[key] = Data.WeaponRegistry[key];
  });

  // Helper functions
  Data.getWeaponData = function(id) {
    return Data.WeaponData[id] || null;
  };

  Data.getAllWeaponIds = function() {
    return Object.keys(Data.WeaponData);
  };

  Data.getWeaponsByTier = function(tier) {
    return Object.values(Data.WeaponData).filter(function(w) {
      return w.tier === tier;
    });
  };

  Data.getWeaponsByRarity = function(rarity) {
    return Object.values(Data.WeaponData).filter(function(w) {
      return w.rarity === rarity;
    });
  };

  // Validate weapons
  Object.values(Data.WeaponData).forEach(function(weapon) {
    var required = ['id', 'name', 'attackType', 'damage', 'cooldown'];
    required.forEach(function(field) {
      if (!(field in weapon)) {
        console.warn('Weapon ' + weapon.id + ' missing field: ' + field);
      }
    });
  });

  console.log('Loaded ' + Object.keys(Data.WeaponData).length + ' weapons');

})(window.VampireSurvivors.Data);
```

---

## Enemy Data Structure

### File Organization

```
src/data/enemies/
├── EnemyConstants.js
├── EnemyRegistry.js
├── normal.js
├── fast.js
├── tank.js
├── flying.js
├── invisible.js
├── healer.js
├── splitter.js
├── self_destruct.js
└── EnemyAggregator.js
```

### Enemy Definition

```javascript
// normal.js
(function (Data) {
  'use strict';

  Data.EnemyRegistry.normal = {
    id: 'normal',
    name: 'Zombie',

    // Stats
    health: 20,
    damage: 10,
    speed: 80,
    xpValue: 5,

    // Visual
    size: 24,
    color: '#884422',
    spriteId: null,

    // Behavior
    behaviorType: 'chase',      // AI behavior to use
    attackRange: 30,
    attackCooldown: 1.0,

    // Spawn configuration
    spawnWeight: 100,           // Higher = more common
    minWave: 1                  // First wave this can appear
  };

})(window.VampireSurvivors.Data);
```

---

## Boss Data Structure

### File Organization

```
src/data/bosses/
├── BossConstants.js
├── BossRegistry.js
├── elite.js          # Tier 1: Elite enemies
├── miniboss.js       # Tier 2: Minibosses
├── boss.js           # Tier 3: Main bosses
└── BossAggregator.js
```

### Boss Definition

```javascript
// boss.js
(function (Data) {
  'use strict';

  Data.BossRegistry.demon_lord = {
    id: 'demon_lord',
    name: 'Demon Lord',
    tier: 3,                    // Main boss

    // Base stats
    health: 5000,
    damage: 50,
    speed: 60,
    size: 80,

    // Phases (triggers at health thresholds)
    phases: [
      {
        healthThreshold: 1.0,   // 100% HP
        attacks: ['fireball_barrage', 'charge'],
        attackInterval: 2.0
      },
      {
        healthThreshold: 0.5,   // 50% HP
        attacks: ['summon_minions', 'flame_wave'],
        attackInterval: 1.5,
        speedMultiplier: 1.3
      },
      {
        healthThreshold: 0.25,  // 25% HP
        attacks: ['enrage_aura', 'meteor_storm'],
        attackInterval: 1.0,
        damageMultiplier: 1.5
      }
    ],

    // Rewards
    xpValue: 500,
    drops: ['legendary_weapon_token']
  };

})(window.VampireSurvivors.Data);
```

---

## Buff/Debuff Data Structure

### File Organization

```
src/data/buffdebuff/
├── BuffDebuffConstants.js
├── BuffDebuffRegistry.js
├── effects/
│   ├── buffs/
│   │   ├── haste.js
│   │   ├── shield.js
│   │   └── ...
│   └── debuffs/
│       ├── burning.js
│       ├── slow.js
│       ├── poison.js
│       └── ...
└── BuffDebuffAggregator.js
```

### Effect Definition

```javascript
// effects/debuffs/burning.js
(function (Data) {
  'use strict';

  var EffectCategory = Data.EffectCategory;
  var EffectType = Data.EffectType;

  Data.BuffDebuffRegistry.burning = {
    id: 'burning',
    name: 'Burning',
    description: 'Taking fire damage over time',

    category: EffectCategory.DEBUFF,
    type: EffectType.DOT,       // Damage over time

    // Effect parameters
    damage: 5,                  // Damage per tick
    duration: 3.0,              // Total duration
    tickRate: 0.5,              // Seconds between ticks

    // Stacking behavior
    stackable: true,
    maxStacks: 5,
    stackMode: 'intensity',     // 'intensity' or 'duration'

    // Visual
    color: '#ff4400',
    particleEffect: 'fire_particles'
  };

})(window.VampireSurvivors.Data);
```

---

## Tech Core Data Structure

### File Organization

```
src/data/techcores/
├── TechCoreConstants.js
├── TechCoreRegistry.js
├── fire_core.js
├── ice_core.js
├── lightning_core.js
├── ... (15 cores total)
└── TechCoreAggregator.js
```

### Tech Core Definition

```javascript
// fire_core.js
(function (Data) {
  'use strict';

  Data.TechCoreRegistry.pyromancy = {
    id: 'pyromancy',
    name: 'Pyromancy',
    element: 'fire',
    description: 'Master of flame and destruction',

    // Starting weapon (tier 1)
    startingWeapon: 'ember_bolt',

    // Evolution chain
    evolutionChain: [
      'ember_bolt',        // Tier 1
      'flame_burst',       // Tier 2
      'inferno_wave',      // Tier 3
      'phoenix_strike',    // Tier 4
      'apocalypse_flame'   // Tier 5
    ],

    // Tech tree structure
    tree: {
      base: {
        id: 'pyro_base',
        name: 'Flame Mastery',
        description: '+10% fire damage',
        maxLevel: 10,
        effect: { fireDamage: 0.1 }
      },
      depth1: [
        {
          id: 'pyro_burn',
          name: 'Lingering Flames',
          description: '+5% burn duration',
          maxLevel: 5,
          effect: { burnDuration: 0.05 }
        },
        {
          id: 'pyro_spread',
          name: 'Fire Spread',
          description: '+10% area of effect',
          maxLevel: 5,
          effect: { areaBonus: 0.1 }
        }
      ],
      depth2: [
        // ... more abilities
      ],
      depth3: [
        // ... ultimate abilities
      ]
    },

    // Passive bonuses
    passives: {
      fireDamage: 1.2,          // 20% fire damage
      burnChance: 0.15          // 15% chance to burn
    }
  };

})(window.VampireSurvivors.Data);
```

---

## Summon Data Structure

### File Organization

```
src/data/summons/
├── SummonConstants.js
├── SummonRegistry.js
├── spirit.js
├── turret.js
├── wolf.js
├── golem.js
├── fairy.js
└── SummonAggregator.js
```

### Summon Definition

```javascript
// wolf.js
(function (Data) {
  'use strict';

  Data.SummonRegistry.wolf = {
    id: 'wolf',
    name: 'Spirit Wolf',

    // Stats
    health: 50,
    damage: 15,
    speed: 150,
    attackCooldown: 0.8,

    // Behavior
    aiType: 'aggressive',       // 'aggressive', 'defensive', 'support'
    targetPriority: 'nearest',
    attackRange: 40,
    leashRange: 300,            // Max distance from player

    // Duration
    duration: 15.0,             // Seconds before despawn
    maxCount: 2,                // Max simultaneous summons

    // Visual
    size: 20,
    color: '#aaddff',
    spriteId: 'summon_wolf'
  };

})(window.VampireSurvivors.Data);
```

---

## Adding New Content

### Step 1: Create Data File

Create file in appropriate folder:
```javascript
// src/data/weapons/basic/common/my_weapon.js
(function (Data) {
  'use strict';

  Data.WeaponRegistry.my_weapon = {
    id: 'my_weapon',
    name: 'My Weapon',
    attackType: Data.AttackType.PROJECTILE,
    // ... other properties
  };

})(window.VampireSurvivors.Data);
```

### Step 2: Add Script Tag

Add to `index.html` BEFORE the aggregator:

```html
<!-- Weapons - Common -->
<script src="src/data/weapons/basic/common/arcane_dart.js"></script>
<script src="src/data/weapons/basic/common/my_weapon.js"></script>  <!-- NEW -->
<!-- ... other weapons ... -->

<!-- Aggregator (must be AFTER all individual files) -->
<script src="src/data/weapons/WeaponAggregator.js"></script>
```

### Step 3: Verify Loading

Check console for:
```
Loaded 111 weapons  // Should increase by 1
```

---

## V3 Migration: Using Framework Registry

In V3 with the reference-framework:

```javascript
// data/weapons.js
import { Registry } from '../reference-framework/lib/RF/patterns/Registry.js';

export const weaponRegistry = new Registry();

// Register weapons
weaponRegistry.register('arcane_dart', {
  id: 'arcane_dart',
  name: 'Arcane Dart',
  attackType: 'projectile',
  damage: 12,
  cooldown: 0.6
});

weaponRegistry.register('fireball', {
  id: 'fireball',
  name: 'Fireball',
  attackType: 'projectile',
  damage: 25,
  cooldown: 0.8
});

// Query
export function getWeapon(id) {
  return weaponRegistry.get(id);
}

export function getAllWeapons() {
  return weaponRegistry.getAll();
}
```

The framework's Registry class provides:
- `register(id, data)` - Add item
- `get(id)` - Get by ID
- `getAll()` - Get all items
- `getAllIds()` - Get all IDs
- `has(id)` - Check existence
- `remove(id)` - Remove item
- `clear()` - Remove all

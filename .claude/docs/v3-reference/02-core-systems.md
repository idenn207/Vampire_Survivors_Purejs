# Core Systems Reference

This document catalogs all 22 game systems in V2, their purposes, interactions, and how they function.

## System Priority Table

Systems execute in priority order each frame. Lower priority = earlier execution.

| Priority | System | Purpose | Updates During Pause |
|----------|--------|---------|---------------------|
| 0 | BackgroundSystem | Draw tile-based grid background | No |
| 1 | CoreSelectionSystem | Tech core selection at game start | Yes |
| 4 | WaveSystem | Wave progression, enemy spawn triggers | No |
| 5 | PlayerSystem | Convert input to player velocity | No |
| 6 | StatusEffectSystem | Apply active buffs/debuffs | No |
| 8 | EnemySystem | Enemy spawning and AI movement | No |
| 8 | TraversalEnemySystem | Screen-crossing enemies | No |
| 8 | BossSystem | Boss spawning, phases, attack patterns | No |
| 10 | MovementSystem | Apply velocity to position | No |
| 15 | ProjectileSystem | Projectile lifecycle (move, expire) | No |
| 15 | AreaEffectSystem | Area damage zone updates | No |
| 15 | MineSystem | Mine deployment and triggers | No |
| 15 | SummonSystem | Summoned minion AI and attacks | No |
| 20 | CollisionSystem | AABB collision detection | No |
| 25 | CombatSystem | Damage processing and effects | No |
| 30 | DropSystem | Loot spawning from killed enemies | No |
| 35 | PickupSystem | Item collection by player | No |
| 40 | WeaponSystem | Weapon firing orchestration | No |
| 50 | CameraSystem | Follow player, viewport management | No |
| 100 | RenderSystem | Draw all entities with sprites | No |
| 110 | HUDSystem | UI overlay (health, XP, timer) | Yes |
| 112 | TechTreeSystem | Tech progression UI | Yes |
| 115 | LevelUpSystem | Level-up screen and upgrades | Yes |
| 116 | TabScreenSystem | Stats/evolution tabs (Tab key) | Yes |
| 117 | PauseMenuSystem | Pause menu | Yes |
| 120 | GameOverSystem | Death screen | Yes |

---

## System Lifecycle

Each system follows this lifecycle:

```javascript
class System {
  _priority = 0;           // Execution order
  _isEnabled = true;       // Toggle on/off
  _updatesDuringPause = false;  // Run when paused

  // Called once when system is added to game
  initialize(game, entityManager) {
    this._game = game;
    this._entityManager = entityManager;
  }

  // Called every frame (if enabled and not paused or _updatesDuringPause)
  update(deltaTime) { }

  // Called every frame after all updates
  render(ctx) { }

  // Called when system is removed
  dispose() { }
}
```

---

## Core Game Systems

### BackgroundSystem (Priority: 0)

**What it does**: Renders the tile-based background grid.

**Purpose**: Provides visual reference for movement and game area.

**Issues encountered**:
- Initially used simple grid lines
- Performance issues with large visible areas

**How addressed**: Implemented tile-based spritesheet rendering with camera culling.

**Key file**: `src/systems/BackgroundSystem.js`

---

### PlayerSystem (Priority: 5)

**What it does**: Converts keyboard input into player velocity.

**Purpose**: Handle player movement via WASD/Arrow keys.

**How it functions**:
```
Input (WASD) → Normalize direction → Apply speed → Set Velocity component
```

**Key file**: `src/systems/PlayerSystem.js`

---

### MovementSystem (Priority: 10)

**What it does**: Applies velocity to transform position.

**Purpose**: Unified movement for all entities (player, enemies, projectiles).

**How it functions**:
```javascript
position.x += velocity.x * deltaTime;
position.y += velocity.y * deltaTime;
```

**Key file**: `src/systems/MovementSystem.js`

---

### CollisionSystem (Priority: 20)

**What it does**: Detects AABB collisions between entities with Collider components.

**Purpose**: Enable combat, pickups, and environmental interactions.

**How it functions**:
1. Get all entities with Transform + Collider
2. O(n²) check all pairs
3. Use collision layer bitmask to filter
4. Invoke registered callbacks for collisions

**Collision Callback Registration**:
```javascript
collisionSystem.registerCollisionCallback('player', 'enemy', (player, enemy, collision) => {
  // Handle player-enemy collision
});
```

**Key file**: `src/systems/CollisionSystem.js`

---

### CombatSystem (Priority: 25)

**What it does**: Processes collision events and applies damage.

**Purpose**: Central damage processing, status effects, lifesteal.

**Issues encountered**:
- Lifesteal only worked for projectiles
- Status effects not applying consistently

**How addressed**:
- Process `weapon:hit` events for all weapon types
- Unified damage processing via DamageProcessor

**Key files**:
- `src/systems/combat/CombatSystem.js`
- `src/systems/combat/DamageProcessor.js`

---

### WeaponSystem (Priority: 40)

**What it does**: Orchestrates weapon firing using the Behavior pattern.

**Purpose**: Fire weapons based on cooldowns and targeting.

**How it functions**:
```
For each weapon in player's WeaponSlot:
  1. Check if canFire() (cooldown expired)
  2. Get behavior by weapon.attackType
  3. Call behavior.execute(weapon, player)
  4. Reset weapon cooldown
  5. Emit 'weapon:fired' event
```

**Available behaviors**:
- ProjectileBehavior, LaserBehavior, MeleeBehavior
- AreaBehavior, ParticleBehavior, MineBehavior
- SummonBehavior, ThrustBehavior

**Key file**: `src/systems/WeaponSystem.js`

---

## UI Systems

### HUDSystem (Priority: 110)

**What it does**: Renders the heads-up display overlay.

**Components managed**:
- StatusPanel (health, XP bar)
- WeaponSlots (equipped weapons)
- Timer display
- Minimap

**Updates during pause**: Yes (always visible)

**Key file**: `src/systems/HUDSystem.js`

---

### LevelUpSystem (Priority: 115)

**What it does**: Shows level-up screen with upgrade options.

**Purpose**: Present 3-4 random upgrades when player levels up.

**How it functions**:
1. Listen for `player:level_up` event
2. Pause game
3. Generate upgrade options (new weapons, stat upgrades, weapon levels)
4. Wait for player selection
5. Apply selected upgrade
6. Resume game

**Issues encountered**: Screen conflicts with TabScreen and PauseMenu.

**How addressed**: Unity-style screen state management with suspend/resume events.

**Key file**: `src/systems/levelup/LevelUpSystem.js`

---

### TechTreeSystem (Priority: 112)

**What it does**: Manages tech core progression UI.

**Purpose**: Allow spending tech points on core abilities.

**Key file**: `src/systems/TechTreeSystem.js`

---

## Event Communication

Systems communicate via EventBus rather than direct references.

### Key Events

| Event | Emitted By | Consumed By |
|-------|-----------|-------------|
| `player:damaged` | CombatSystem | HUDSystem, StatusPanel |
| `player:level_up` | PickupSystem | LevelUpSystem |
| `player:died` | CombatSystem | GameOverSystem |
| `weapon:fired` | WeaponSystem | (logging/effects) |
| `weapon:hit` | CombatSystem | CombatSystem (lifesteal) |
| `entity:died` | CombatSystem | DropSystem |
| `pickup:collected` | PickupSystem | HUDSystem |
| `wave:started` | WaveSystem | HUDSystem |
| `collision:detected` | CollisionSystem | CombatSystem |

### Screen Management Events

| Event | Purpose |
|-------|---------|
| `game:requestPause` | Request game pause |
| `game:requestResume` | Request game resume |
| `screen:opened` | Screen became active |
| `screen:closed` | Screen dismissed |
| `screen:requestOpen` | Request specific screen |
| `screen:suspended` | Screen temporarily hidden |
| `screen:requestResume` | Resume suspended screen |

---

## System Interactions

### Collision → Combat Flow

```
CollisionSystem.update()
  ├── Detect collision between projectile and enemy
  ├── Invoke registered callback
  │
CombatSystem callback
  ├── Get damage from projectile's Weapon component
  ├── Apply damage via DamageProcessor
  ├── Apply status effects
  ├── Check for kill
  ├── Emit 'weapon:hit' event
  │
CombatSystem (lifesteal handler)
  ├── Listen for 'weapon:hit'
  ├── Apply lifesteal healing to player
  │
DropSystem
  ├── Listen for 'entity:died'
  └── Spawn loot drops
```

### Weapon Firing Flow

```
WeaponSystem.update()
  ├── For each weapon in player's WeaponSlot
  │   ├── canFire() check (cooldown)
  │   ├── Get behavior (e.g., ProjectileBehavior)
  │   ├── behavior.execute(weapon, player)
  │   │   ├── Find target (based on targetingMode)
  │   │   ├── Calculate damage (with bonuses)
  │   │   ├── Spawn projectile from pool
  │   │   ├── Set projectile position, velocity, damage
  │   │   └── Add projectile to EntityManager
  │   └── weapon.fire() (reset cooldown)
  │
ProjectileSystem.update()
  ├── Update projectile positions
  ├── Check lifetime expiration
  └── Return expired projectiles to pool
```

---

## Adding New Systems

1. Create system file following the pattern:

```javascript
(function (Systems) {
  'use strict';

  var System = window.VampireSurvivors.Systems.System;

  class MyNewSystem extends System {
    constructor() {
      super();
      this._priority = 25;  // Choose appropriate priority
      this._updatesDuringPause = false;
    }

    initialize(game, entityManager) {
      super.initialize(game, entityManager);
      // Setup code
    }

    update(deltaTime) {
      // Per-frame logic
    }

    dispose() {
      // Cleanup
    }
  }

  Systems.MyNewSystem = MyNewSystem;
})(window.VampireSurvivors.Systems);
```

2. Add script tag in `index.html` in correct phase
3. Register in `app.js`:
```javascript
game.addSystem(new Systems.MyNewSystem());
```

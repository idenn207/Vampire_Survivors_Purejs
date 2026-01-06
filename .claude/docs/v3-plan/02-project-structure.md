# V3 Project Structure

## Directory Layout

```
/workspaces/Vampire_Survivors_Purejs/
├── reference-framework/          # Game framework (cloned)
│   ├── core/                     # Game, EventBus, Time, Input, Camera
│   ├── ecs/                      # Entity, Component, System, World
│   ├── components/               # Transform, Velocity
│   ├── lib/RF/                   # Extended utilities
│   │   ├── core/                 # ObjectPool, StateMachine, Timer
│   │   ├── components/           # Health, Collider, Sprite
│   │   ├── behaviors/            # ChaseEnemyBehavior, etc.
│   │   └── physics/              # CollisionLayers
│   ├── main.js                   # Framework entry (exports all)
│   └── demo.js                   # Working example
│
├── v3/                           # V3 game implementation
│   ├── index.html                # Entry point HTML
│   ├── main.js                   # Game bootstrap
│   └── game/
│       ├── config/
│       │   └── GameConfig.js     # Game constants
│       ├── entities/
│       │   ├── Player.js         # Player entity
│       │   ├── Enemy.js          # Enemy entity
│       │   └── Projectile.js     # Projectile entity
│       ├── systems/
│       │   ├── PlayerSystem.js   # Input handling
│       │   ├── MovementSystem.js # Velocity → Position
│       │   ├── EnemySystem.js    # Spawn + AI
│       │   ├── WeaponSystem.js   # Auto-fire
│       │   ├── CollisionSystem.js# Collision detection
│       │   ├── CombatSystem.js   # Damage processing
│       │   ├── RenderSystem.js   # Entity rendering
│       │   └── HUDSystem.js      # Health bar
│       └── components/
│           └── Weapon.js         # Weapon component
│
├── v2/                           # V2 implementation (reference)
│
└── .claude/
    └── docs/
        ├── v3-reference/         # Reference documentation
        ├── v3-plan/              # Planning documents (this folder)
        └── v3-completion/        # Phase completion docs
```

## File Purposes

### Entry Points

| File | Purpose |
|------|---------|
| `v3/index.html` | HTML with canvas, loads `main.js` as module |
| `v3/main.js` | Creates World, adds systems, starts game |

### Configuration

| File | Purpose |
|------|---------|
| `GameConfig.js` | Player speed, enemy stats, weapon stats, colors |

### Entities

| File | Purpose |
|------|---------|
| `Player.js` | Player with Transform, Velocity, Health, Weapon |
| `Enemy.js` | Enemy with chase AI, contact damage |
| `Projectile.js` | Projectile with lifetime, damage |

### Systems

| File | Priority | Purpose |
|------|----------|---------|
| `PlayerSystem.js` | 5 | Input → Velocity |
| `EnemySystem.js` | 8 | Spawning, AI updates |
| `MovementSystem.js` | 10 | Velocity → Position |
| `CollisionSystem.js` | 20 | Detect overlaps |
| `CombatSystem.js` | 25 | Apply damage |
| `WeaponSystem.js` | 40 | Fire projectiles |
| `RenderSystem.js` | 100 | Draw entities |
| `HUDSystem.js` | 110 | Draw UI |

### Components

| File | Purpose |
|------|---------|
| `Weapon.js` | Weapon stats (damage, cooldown, range) |

## Import Paths

From `v3/game/systems/PlayerSystem.js`:

```javascript
// Framework imports (go up two levels, then into reference-framework)
import { System } from '../../reference-framework/ecs/System.js';
import { Velocity } from '../../reference-framework/components/Velocity.js';

// Game imports (relative within game/)
import { GameConfig } from '../config/GameConfig.js';
```

From `v3/main.js`:

```javascript
// Framework imports (go up one level)
import { World } from '../reference-framework/ecs/World.js';

// Game imports
import { Player } from './game/entities/Player.js';
import { PlayerSystem } from './game/systems/PlayerSystem.js';
```

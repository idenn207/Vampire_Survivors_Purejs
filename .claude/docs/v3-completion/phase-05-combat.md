# Phase 5: Combat System - Complete

## Date Completed

2026-01-06

## Files Created

| File | Purpose |
|------|---------|
| `v3/game/systems/CollisionSystem.js` | Detects collisions between entities |
| `v3/game/systems/CombatSystem.js` | Processes damage from collisions |

## Files Modified

| File | Changes |
|------|---------|
| `v3/game/entities/Player.js` | Added Health and Collider components |
| `v3/game/entities/Enemy.js` | Added Health and Collider components |
| `v3/game/entities/Projectile.js` | Added Collider component |
| `v3/game/systems/RenderSystem.js` | Added invincibility flash effect |
| `v3/main.js` | Added CollisionSystem and CombatSystem |

## Implementation Details

### CollisionSystem.js (Priority 20)

- Queries entities with Transform + Collider
- Checks all pairs for collisions using circle-circle detection
- Uses collision layers/masks for filtering
- Stores collisions array for CombatSystem to read

### CombatSystem.js (Priority 25)

- Reads collisions from CollisionSystem via `game.getSystem()`
- Handles Projectile vs Enemy: damage + destroy projectile
- Handles Player vs Enemy: damage + set invincibility
- Updates player invincibility timer via `health.update(deltaTime)`
- Removes dead enemies
- Emits events: `enemy:died`, `player:damaged`, `player:died`

### Collision Layers Configuration

| Entity | Layer | Mask |
|--------|-------|------|
| Player | PLAYER (1) | ENEMY (2) |
| Enemy | ENEMY (2) | PLAYER \| PROJECTILE (5) |
| Projectile | PROJECTILE (4) | ENEMY (2) |

### Visual Feedback

- RenderSystem updated with flash effect for invincible entities
- Uses sine wave on timer to alternate alpha (0.3 ↔ 1.0)
- Makes damage feedback clearly visible

## System Execution Order

| Priority | System | Purpose |
|----------|--------|---------|
| 0 | BackgroundSystem | Draw background color |
| 5 | PlayerSystem | Read input, set velocity |
| 8 | EnemySystem | Spawn enemies, update chase AI |
| 10 | MovementSystem | Apply velocity to position |
| 15 | LifetimeSystem | Expire old projectiles |
| 20 | CollisionSystem | Detect collisions |
| 25 | CombatSystem | Process damage |
| 40 | WeaponSystem | Auto-fire at enemies |
| 100 | RenderSystem | Draw all entities |

## Testing Performed

- Projectile hits enemy → enemy takes 10 damage
- Enemy dies after 3 hits (30 HP / 10 damage)
- Dead enemies are removed from game
- Enemy touches player → player takes 10 damage
- Player flashes for 1 second (invincibility)
- Player cannot take damage while flashing
- Multiple enemies can be killed in sequence

## Bug Fixes During Implementation

- Fixed `health.updateInvincibility()` → `health.update()` (correct method name)

## Framework Components Used

- `Health` from `/lib/RF/components/Health.js`
- `Collider` from `/lib/RF/components/Collider.js`
- `CollisionLayers` from `/lib/RF/physics/CollisionLayers.js`
- `events` from `/core/EventBus.js`

## Next Phase

Phase 6: HUD + Game Over - Add health bar and game over screen

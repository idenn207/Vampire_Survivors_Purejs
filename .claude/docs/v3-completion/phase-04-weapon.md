# Phase 4: Weapon System - Complete

## Date Completed

2026-01-06

## Files Created

| File | Purpose |
|------|---------|
| `v3/game/components/Weapon.js` | Weapon stats and cooldown tracking |
| `v3/game/entities/Projectile.js` | Projectile entity with Lifetime component |
| `v3/game/systems/WeaponSystem.js` | Auto-fire logic, target finding |
| `v3/game/systems/LifetimeSystem.js` | Entity expiration handling |

## Files Modified

| File | Changes |
|------|---------|
| `v3/game/entities/Player.js` | Added Weapon component import and usage |
| `v3/main.js` | Added WeaponSystem and LifetimeSystem imports and registration |

## Implementation Details

### Weapon.js (Component)

- Properties: damage, cooldown, range, projectileSpeed, projectileSize, projectileColor, projectileLifetime
- Cooldown tracking via `lastFired` timestamp
- Methods: `canFire(currentTime)`, `fire(currentTime)`

### Projectile.js (Entity)

- Components: Transform, Velocity, Sprite (yellow circle), Lifetime
- Tag: `'projectile'`
- zIndex: 10 (draws above enemies)
- `init(x, y, vx, vy, damage)` method for initialization

### WeaponSystem.js (Priority 40)

- Queries player with Weapon component
- Uses `game.elapsedTime` for cooldown tracking
- `_findNearestEnemy()`: finds closest enemy within range using distance squared
- `_fireProjectile()`: creates projectile with direction toward target

### LifetimeSystem.js (Priority 15)

- Queries entities with Lifetime component
- Calls `lifetime.update(deltaTime)` each frame
- Destroys expired entities via `entityManager.destroy()`

## System Execution Order

| Priority | System | Purpose |
|----------|--------|---------|
| 0 | BackgroundSystem | Draw background color |
| 5 | PlayerSystem | Read input, set velocity |
| 8 | EnemySystem | Spawn enemies, update chase AI |
| 10 | MovementSystem | Apply velocity to position |
| 15 | LifetimeSystem | Expire old projectiles |
| 40 | WeaponSystem | Auto-fire at enemies |
| 100 | RenderSystem | Draw all entities |

## Targeting Algorithm

```javascript
// Find nearest enemy within range
for (each enemy) {
  const dx = enemyX - playerX;
  const dy = enemyY - playerY;
  const distSq = dx * dx + dy * dy;

  if (distSq < range * range && distSq < nearestDistSq) {
    nearest = enemy;
    nearestDistSq = distSq;
  }
}
```

## Testing Performed

- Yellow projectiles fire from player toward enemies
- Fires every 0.5 seconds (cooldown works)
- Only fires when enemy within 400px range
- Projectiles travel in straight line toward target position
- Projectiles expire after 3 seconds
- Multiple projectiles can exist simultaneously

## Configuration Used (from GameConfig.js)

- `WEAPON.DAMAGE`: 10
- `WEAPON.COOLDOWN`: 0.5 seconds
- `WEAPON.RANGE`: 400 pixels
- `WEAPON.PROJECTILE_SPEED`: 500 pixels/second
- `WEAPON.PROJECTILE_SIZE`: 8 pixels
- `WEAPON.PROJECTILE_COLOR`: #ffff00 (yellow)
- `WEAPON.PROJECTILE_LIFETIME`: 3.0 seconds

## Next Phase

Phase 5: Combat System - Add collision detection and damage processing

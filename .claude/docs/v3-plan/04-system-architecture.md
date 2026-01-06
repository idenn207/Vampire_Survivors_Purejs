# System Architecture

## System Execution Order

Systems execute each frame in priority order (lower = earlier).

```
Frame Start
    │
    ▼
┌──────────────────────────┐
│ BackgroundSystem(0)      │ ◄── Draw tile-based grid
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ CoreSelectionSystem(1)   │ ◄── Tech core selection (game start)
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ WaveSystem(4)            │ ◄── Wave progression, spawn triggers
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ PlayerSystem(5)          │ ◄── Read input, set velocity
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ StatusEffectSystem(6)    │ ◄── Apply active buffs/debuffs
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ EnemySystem(8)           │ ◄── Spawn enemies, update AI
│ TraversalEnemySystem(8)  │ ◄── Screen-crossing enemies
│ BossSystem(8)            │ ◄── Boss spawning and phases
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ MovementSystem(10)       │ ◄── Apply velocity to position
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ ProjectileSystem(15)     │ ◄── Projectile lifecycle
│ AreaEffectSystem(15)     │ ◄── Area damage zone updates
│ MineSystem(15)           │ ◄── Mine deployment and triggers
│ SummonSystem(15)         │ ◄── Summoned minion AI
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ CollisionSystem(20)      │ ◄── Detect overlapping entities
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ CombatSystem(25)         │ ◄── Process damage from collisions
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ DropSystem(30)           │ ◄── Loot spawning from kills
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ PickupSystem(35)         │ ◄── Item collection by player
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ WeaponSystem(40)         │ ◄── Fire projectiles at targets
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ CameraSystem(50)         │ ◄── Follow player, viewport
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ RenderSystem(100)        │ ◄── Draw all entities
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ HUDSystem(110)           │ ◄── Draw UI overlay
│ TechTreeSystem(112)      │ ◄── Tech progression UI
│ LevelUpSystem(115)       │ ◄── Level-up screen
│ TabScreenSystem(116)     │ ◄── Stats/evolution tabs
│ PauseMenuSystem(117)     │ ◄── Pause menu
│ GameOverSystem(120)      │ ◄── Death screen
└──────────────────────────┘
         │
         ▼
    Frame End
```

---

## System Details

### PlayerSystem (Priority: 5)

**Purpose:** Convert player input to velocity

**Input:** Keyboard state (WASD/Arrows)
**Output:** Player velocity component updated

```javascript
update(deltaTime) {
  const direction = this.game.input.getMovementDirection();
  velocity.vx = direction.x * speed;
  velocity.vy = direction.y * speed;
}
```

---

### EnemySystem (Priority: 8)

**Purpose:** Spawn enemies, update chase AI

**Input:** Timer, player position
**Output:** New enemies spawned, enemy velocities updated

```javascript
update(deltaTime) {
  // Spawn logic
  if (timer >= spawnInterval) {
    spawnEnemy(outsideScreen);
  }

  // AI update
  enemies.forEach(e => chaseBehavior.update(e, dt));
}
```

---

### MovementSystem (Priority: 10)

**Purpose:** Apply velocity to transform

**Input:** Entity velocity
**Output:** Entity position updated

```javascript
update(deltaTime) {
  transform.x += velocity.vx * deltaTime;
  transform.y += velocity.vy * deltaTime;
  // Clamp to bounds
}
```

---

### CollisionSystem (Priority: 20)

**Purpose:** Detect entity overlaps

**Input:** All entities with Collider
**Output:** Collision list, events emitted

```javascript
update(deltaTime) {
  collisions = [];
  for (each pair of entities) {
    if (overlapping) {
      collisions.push({ entityA, entityB });
      events.emit('collision:detected', ...);
    }
  }
}
```

---

### CombatSystem (Priority: 25)

**Purpose:** Apply damage from collisions

**Input:** Collision list from CollisionSystem
**Output:** Health reduced, entities destroyed

```javascript
update(deltaTime) {
  for (each collision) {
    if (projectile vs enemy) {
      enemy.health.takeDamage(projectile.damage);
      destroy(projectile);
    }
    if (player vs enemy) {
      player.health.takeDamage(enemy.damage);
      player.setInvincible(1.0);
    }
  }
}
```

---

### WeaponSystem (Priority: 40)

**Purpose:** Auto-fire projectiles

**Input:** Player weapon, nearby enemies
**Output:** Projectiles spawned

```javascript
update(deltaTime) {
  if (cooldownReady && targetInRange) {
    target = findNearestEnemy();
    spawnProjectile(toward target);
    resetCooldown();
  }
}
```

---

### RenderSystem (Priority: 100)

**Purpose:** Draw all visible entities

**Input:** Entities with Transform + Sprite
**Output:** Canvas updated

```javascript
render(ctx) {
  for (each entity with Sprite) {
    drawShape(entity.transform, entity.sprite);
  }
}
```

---

### HUDSystem (Priority: 110)

**Purpose:** Draw UI elements

**Input:** Player health
**Output:** Health bar on screen

```javascript
render(ctx) {
  drawHealthBar(player.health);
}
```

---

## Additional Systems (Post-MVP)

### BackgroundSystem (Priority: 0)

**Purpose:** Render tile-based background grid

**Input:** Camera position, tile spritesheet
**Output:** Tiled background with camera culling

---

### CoreSelectionSystem (Priority: 1)

**Purpose:** Tech core selection at game start

**Input:** Available tech cores, player input
**Output:** Selected core, starting weapon equipped

**Updates During Pause:** Yes

---

### WaveSystem (Priority: 4)

**Purpose:** Wave progression and enemy spawn triggers

**Input:** Game timer
**Output:** Wave events, spawn rate modifiers

---

### StatusEffectSystem (Priority: 6)

**Purpose:** Apply active buffs and debuffs

**Input:** Entities with BuffDebuff component
**Output:** Stat modifications, DOT damage, effect expiration

```javascript
update(deltaTime) {
  for (each entity with BuffDebuff) {
    effects.forEach(effect => {
      effect.duration -= deltaTime;
      if (effect.type === 'dot') {
        applyDamageOverTime(entity, effect);
      }
      if (effect.duration <= 0) {
        removeEffect(entity, effect);
      }
    });
  }
}
```

---

### TraversalEnemySystem (Priority: 8)

**Purpose:** Handle screen-crossing enemies

**Input:** Traversal enemy spawn timer
**Output:** Enemies that cross entire screen

---

### BossSystem (Priority: 8)

**Purpose:** Boss spawning, phases, and attack patterns

**Input:** Wave thresholds, boss data
**Output:** Boss entities, phase transitions

---

### ProjectileSystem (Priority: 15)

**Purpose:** Projectile lifecycle management

**Input:** Active projectiles
**Output:** Position updates, expiration, pool returns

```javascript
update(deltaTime) {
  projectiles.forEach(p => {
    p.lifetime -= deltaTime;
    if (p.lifetime <= 0) {
      entityManager.remove(p);
      projectilePool.release(p);
    }
  });
}
```

---

### AreaEffectSystem (Priority: 15)

**Purpose:** Area damage zone updates

**Input:** Active area effects
**Output:** Tick damage to entities in range

---

### MineSystem (Priority: 15)

**Purpose:** Mine deployment and triggers

**Input:** Active mines, enemy positions
**Output:** Explosions on proximity/timer

---

### SummonSystem (Priority: 15)

**Purpose:** Summoned minion AI and attacks

**Input:** Active summons, enemy positions
**Output:** Summon movement, attacks, expiration

---

### DropSystem (Priority: 30)

**Purpose:** Loot spawning from killed enemies

**Input:** `entity:died` events
**Output:** Pickup entities (XP, items)

```javascript
initialize() {
  events.on('entity:died', (data) => {
    if (data.entity.hasTag('enemy')) {
      spawnDrop(data.entity.position, data.entity.xpValue);
    }
  });
}
```

---

### PickupSystem (Priority: 35)

**Purpose:** Item collection by player

**Input:** Player-pickup collisions
**Output:** XP gained, items collected

---

### CameraSystem (Priority: 50)

**Purpose:** Follow player, manage viewport

**Input:** Player position
**Output:** Camera position for rendering

---

### TechTreeSystem (Priority: 112)

**Purpose:** Tech core progression UI

**Input:** Player input, tech points
**Output:** Ability unlocks, stat bonuses

**Updates During Pause:** Yes

---

### LevelUpSystem (Priority: 115)

**Purpose:** Show level-up screen with upgrade options

**Input:** `player:level_up` event
**Output:** Selected upgrade applied

**Updates During Pause:** Yes

---

### TabScreenSystem (Priority: 116)

**Purpose:** Stats and evolution tabs (Tab key)

**Input:** Tab key press
**Output:** Stats display, evolution options

**Updates During Pause:** Yes

---

### PauseMenuSystem (Priority: 117)

**Purpose:** Pause menu

**Input:** Escape key press
**Output:** Game pause, settings access

**Updates During Pause:** Yes

---

### GameOverSystem (Priority: 120)

**Purpose:** Death screen

**Input:** `player:died` event
**Output:** Game over overlay, restart option

**Updates During Pause:** Yes

---

## Event Flow

```
PlayerSystem
    │
    ▼ (sets velocity)
MovementSystem
    │
    ▼ (updates position)
CollisionSystem
    │
    ├──► 'collision:detected' event
    │
    ▼
CombatSystem
    │
    ├──► 'enemy:died' event
    ├──► 'player:damaged' event
    └──► 'player:died' event
             │
             ▼
        Game Over Handler
```

---

## System Dependencies

### MVP Systems

| System | Depends On | Provides To |
|--------|------------|-------------|
| PlayerSystem | Input | MovementSystem |
| EnemySystem | Player position | CollisionSystem |
| MovementSystem | Velocity | CollisionSystem |
| CollisionSystem | Transform, Collider | CombatSystem |
| CombatSystem | CollisionSystem | Events, DropSystem |
| WeaponSystem | Player, Enemies | Projectiles |
| RenderSystem | Transform, Sprite | - |
| HUDSystem | Player Health | - |

### Full System Dependencies

| System | Depends On | Provides To |
|--------|------------|-------------|
| BackgroundSystem | Camera | - |
| CoreSelectionSystem | Input | Player setup |
| WaveSystem | Timer | EnemySystem, BossSystem |
| PlayerSystem | Input | MovementSystem |
| StatusEffectSystem | BuffDebuff | Stat modifiers |
| EnemySystem | WaveSystem | CollisionSystem |
| TraversalEnemySystem | Timer | CollisionSystem |
| BossSystem | WaveSystem | CollisionSystem |
| MovementSystem | Velocity | CollisionSystem |
| ProjectileSystem | WeaponSystem | CollisionSystem |
| AreaEffectSystem | WeaponSystem | CombatSystem |
| MineSystem | WeaponSystem | CombatSystem |
| SummonSystem | WeaponSystem | CollisionSystem |
| CollisionSystem | Transform, Collider | CombatSystem |
| CombatSystem | CollisionSystem | DropSystem, Events |
| DropSystem | CombatSystem | PickupSystem |
| PickupSystem | CollisionSystem | LevelUpSystem |
| WeaponSystem | Player, Enemies | Projectiles |
| CameraSystem | Player | RenderSystem |
| RenderSystem | Camera, Sprites | - |
| HUDSystem | Player | - |
| TechTreeSystem | Input | Player stats |
| LevelUpSystem | Events | Player weapons |
| TabScreenSystem | Input | - |
| PauseMenuSystem | Input | - |
| GameOverSystem | Events | - |

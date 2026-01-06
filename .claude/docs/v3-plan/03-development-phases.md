# Development Phases

## Overview

V3 MVP development is divided into 6 phases, each building on the previous.

| Phase | Goal | Files Created |
|-------|------|---------------|
| 1 | Project Setup | 3 files |
| 2 | Player Movement | 4 files |
| 3 | Enemy System | 2 files |
| 4 | Weapon System | 3 files |
| 5 | Combat System | 2 files |
| 6 | HUD + Game Over | 1 file + updates |

---

## Phase 1: Project Setup

**Goal:** Create v3 directory structure, get canvas rendering

**Deliverables:**
- `v3/index.html` - HTML with canvas element
- `v3/main.js` - World initialization, empty game loop
- `v3/game/config/GameConfig.js` - Game constants

**Verification:**
- Open in browser
- Canvas displays with background color
- No console errors

**Completion Doc:** `.claude/docs/v3-completion/phase-01-setup.md`

---

## Phase 2: Player Movement

**Goal:** Player entity moves with WASD/Arrow keys

**Deliverables:**
- `v3/game/entities/Player.js` - Player entity with components
- `v3/game/systems/PlayerSystem.js` - Input handling
- `v3/game/systems/MovementSystem.js` - Position updates
- `v3/game/systems/RenderSystem.js` - Entity drawing

**Dependencies:**
- Phase 1 complete
- Framework: Entity, System, Transform, Velocity

**Verification:**
- Blue circle visible at screen center
- WASD/Arrows move player
- Player stays within screen bounds

**Completion Doc:** `.claude/docs/v3-completion/phase-02-player.md`

---

## Phase 3: Enemy System

**Goal:** Enemies spawn and chase player

**Deliverables:**
- `v3/game/entities/Enemy.js` - Enemy entity
- `v3/game/systems/EnemySystem.js` - Spawning + AI

**Dependencies:**
- Phase 2 complete
- Framework: ChaseEnemyBehavior

**Verification:**
- Red circles spawn outside screen
- Enemies chase player
- Max 20 enemies at once
- New enemy every 2 seconds

**Completion Doc:** `.claude/docs/v3-completion/phase-03-enemies.md`

---

## Phase 4: Weapon System

**Goal:** Player auto-fires at nearest enemy

**Deliverables:**
- `v3/game/components/Weapon.js` - Weapon data component
- `v3/game/entities/Projectile.js` - Projectile entity
- `v3/game/systems/WeaponSystem.js` - Firing logic

**Dependencies:**
- Phase 3 complete
- Framework: Time, Lifetime

**Verification:**
- Yellow projectiles fire at enemies
- Fires every 0.5 seconds
- Only fires when enemy in range
- Projectiles move toward target

**Completion Doc:** `.claude/docs/v3-completion/phase-04-weapon.md`

---

## Phase 5: Combat System

**Goal:** Projectiles damage enemies, enemies damage player

**Deliverables:**
- `v3/game/systems/CollisionSystem.js` - Collision detection
- `v3/game/systems/CombatSystem.js` - Damage processing

**Dependencies:**
- Phase 4 complete
- Framework: Collider, Health, events

**Verification:**
- Projectile hits enemy → enemy takes damage
- Enemy at 0 HP → removed
- Enemy touches player → player takes damage
- Player has 1s invincibility after damage

**Completion Doc:** `.claude/docs/v3-completion/phase-05-combat.md`

---

## Phase 6: HUD + Game Over

**Goal:** Health bar display, game over on death

**Deliverables:**
- `v3/game/systems/HUDSystem.js` - Health bar rendering
- Update `v3/main.js` - Game over handler

**Dependencies:**
- Phase 5 complete

**Verification:**
- Health bar visible top-left
- Bar updates when taking damage
- Bar turns red at low health
- Game over overlay on death
- "Play Again" restarts game

**Completion Doc:** `.claude/docs/v3-completion/phase-06-complete.md`

---

## Phase Completion Template

Each phase completion document should include:

```markdown
# Phase X: [Name] - Complete

## Date Completed
[Date]

## Files Created
- `path/to/file.js` - Description

## Changes Made
- Bullet points of what was implemented

## Testing Performed
- How the phase was verified

## Issues Encountered
- Any problems and solutions

## Next Phase
Brief note about what's next
```

# MVP Feature Specifications

## Core Features

### 1. Player Entity

**Description:** Player-controlled character that moves around the game world.

**Specifications:**
| Property | Value |
|----------|-------|
| Size | 32x32 pixels |
| Speed | 200 pixels/second |
| Health | 100 HP |
| Shape | Circle (cyan `#4cc9f0`) |
| Controls | WASD or Arrow keys |

**Components:**
- `Transform` - Position, size, rotation
- `Velocity` - Movement speed
- `Health` - Current/max HP, invincibility
- `Collider` - Circle collider, player layer
- `Sprite` - Visual appearance
- `Weapon` - Equipped weapon data

**Behavior:**
- Responds to keyboard input
- Cannot move outside world bounds
- 1 second invincibility after taking damage
- Camera follows player

---

### 2. Basic Weapon

**Description:** Auto-firing projectile weapon that targets nearest enemy.

**Specifications:**
| Property | Value |
|----------|-------|
| Damage | 10 per hit |
| Cooldown | 0.5 seconds |
| Range | 400 pixels (targeting) |
| Projectile Speed | 500 pixels/second |
| Projectile Size | 8x8 pixels |
| Projectile Lifetime | 3 seconds |

**Behavior:**
- Automatically fires when enemy in range
- Targets nearest enemy within range
- Projectiles destroyed on hit or timeout
- No manual aiming required

---

### 3. Basic Enemy

**Description:** Simple enemy that chases the player.

**Specifications:**
| Property | Value |
|----------|-------|
| Size | 24x24 pixels |
| Speed | 80 pixels/second |
| Health | 30 HP |
| Damage | 10 (contact) |
| Shape | Circle (magenta `#f72585`) |

**Spawn Rules:**
- Spawn outside visible screen area
- Spawn interval: 2 seconds
- Maximum enemies: 20

**Behavior:**
- Chase player using ChaseEnemyBehavior
- Deal damage on contact
- Destroyed when HP reaches 0

---

### 4. Collision System

**Description:** Detects overlapping entities and triggers combat.

**Collision Pairs:**
| Entity A | Entity B | Result |
|----------|----------|--------|
| Projectile | Enemy | Enemy takes damage, projectile destroyed |
| Player | Enemy | Player takes damage, 1s invincibility |

**Collision Layers:**
- `PLAYER` - Player entity
- `ENEMY` - Enemy entities
- `PROJECTILE` - Player projectiles

---

### 5. Combat System

**Description:** Processes collision events and applies damage.

**Damage Flow:**
1. CollisionSystem detects overlap
2. CombatSystem processes collision
3. Health.takeDamage() called
4. Events emitted (`enemy:died`, `player:damaged`)

**Death Handling:**
- Enemies: Removed from EntityManager
- Player: Trigger game over

---

### 6. HUD System

**Description:** Displays player health on screen.

**Health Bar:**
| Property | Value |
|----------|-------|
| Position | Top-left (20, 20) |
| Size | 200x20 pixels |
| Background | Dark gray `#333` |
| Fill (healthy) | Green `#4ade80` |
| Fill (low) | Red `#ef4444` |
| Border | White 2px |

**Low Health Threshold:** 30%

---

### 7. Game Over Screen

**Description:** Overlay shown when player dies.

**Elements:**
- Dark overlay (70% opacity)
- "GAME OVER" title
- "Play Again" button

**Behavior:**
- Game pauses when player dies
- Click "Play Again" reloads page

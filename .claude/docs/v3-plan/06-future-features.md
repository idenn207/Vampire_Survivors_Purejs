# Future Features (Post-MVP)

## Priority Tiers

| Tier | Features | Complexity |
|------|----------|------------|
| 1 | Core gameplay enhancements | Low-Medium |
| 2 | Content expansion | Medium |
| 3 | Polish and systems | Medium-High |
| 4 | Advanced features | High |

---

## Tier 1: Core Gameplay Enhancements

### 1.1 Object Pooling

**Purpose:** Improve performance by reusing entities

**Implementation:**
- Pool for Projectiles
- Pool for Enemies
- Pool for Pickups

**Framework Support:** `ObjectPool` in `lib/RF/core/`

---

### 1.2 Experience and Leveling

**Purpose:** Player progression within a run

**Components:**
- Experience pickup entities
- Experience bar in HUD
- Level-up trigger

**Events:**
- `experience:gained`
- `player:levelup`

---

### 1.3 Wave System

**Purpose:** Progressive difficulty

**Features:**
- Wave counter
- Increasing spawn rate
- Stronger enemies per wave

---

### 1.4 Attack Type Behaviors

**Purpose:** Variety in combat through different attack patterns

**Attack Types (8 total):**

| Type | Behavior | Key Properties |
|------|----------|----------------|
| PROJECTILE | Spawns entities traveling toward target | speed, count, pierce, spread, ricochet |
| LASER | Instant line damage from player to target | range, width, duration, pierce |
| MELEE_SWING | Arc attack around player | range, arcAngle, swingSpeed, knockback |
| MELEE_THRUST | Linear thrust in direction | range, width, thrustSpeed, holdDuration |
| AREA_DAMAGE | Stationary damage zone | range, duration, tickRate |
| PARTICLE | Orbiting/following particles | count, orbitRadius, orbitSpeed |
| MINE | Deployed triggered explosives | count, triggerRadius, explosionRadius, armDelay |
| SUMMON | Spawned minion entities | summonId, count, duration, maxActive |

**Implementation:** Each type has a dedicated Behavior class in `v3/game/behaviors/`

---

### 1.5 Targeting Modes

**Purpose:** Different target selection strategies

**Targeting Modes (5 total):**

| Mode | Behavior | Use Case |
|------|----------|----------|
| NEAREST | Target closest enemy in range | Default for most weapons |
| RANDOM | Random enemy in range | Chaos/luck weapons |
| MOUSE | Fire toward cursor position | Manual-aim weapons |
| ROTATING | Fire in rotating pattern | Barrier/orbital weapons |
| CHAIN | Chain to nearby enemies | Lightning/chain weapons |

**Properties for CHAIN:**
- `chainCount`: Number of chain jumps
- `chainRange`: Maximum distance between chain targets

---

### 1.6 Status Effect System

**Purpose:** Damage over time, buffs, and debuffs

**Effect Types:**

| Type | Description | Examples |
|------|-------------|----------|
| DOT | Damage over time | burning, poison, bleed |
| STAT_MOD | Stat modification | slow, haste, weaken |
| HOT | Heal over time | regeneration |
| SHIELD | Damage absorption | barrier, immunity |

**Effect Properties:**

| Property | Description |
|----------|-------------|
| duration | Total effect duration |
| tickRate | Time between damage/heal ticks |
| value | Effect magnitude |
| stackable | Whether effect can stack |
| maxStacks | Maximum stack count |
| stackMode | 'intensity' (damage) or 'duration' |

**System:** StatusEffectSystem (Priority 6) processes BuffDebuff components

---

## Tier 2: Content Expansion

### 2.1 Enemy Variety

**Purpose:** Diverse threats with unique behaviors

**Enemy Types (8 total):**

| Type | Behavior | Stats | Special |
|------|----------|-------|---------|
| normal | Chase player | Balanced | Basic enemy |
| fast | Chase player | High speed, low HP | Quick but fragile |
| tank | Chase player | Low speed, high HP | Slow but durable |
| ranged | Maintain distance | Medium | Shoots projectiles at player |
| flying | Ignore terrain | Medium | Can pass through obstacles |
| invisible | Partial visibility | Medium | Only visible when close/attacking |
| healer | Follow other enemies | Low HP | Heals nearby enemies |
| self_destruct | Chase player | Low HP | Explodes on death (area damage) |
| splitter | Chase player | High HP | Divides into smaller enemies on death |

**AI Behaviors:**
- `chase`: Move directly toward player
- `ranged`: Maintain distance, shoot when in range
- `support`: Follow other enemies, use abilities
- `kamikaze`: Rush player, explode on contact/death

**Spawn Configuration:**

| Property | Description |
|----------|-------------|
| spawnWeight | Higher = more common |
| minWave | First wave type appears |
| maxActive | Cap on simultaneous count |

---

### 2.2 Drop and Pickup System

**Purpose:** Loot from defeated enemies

**Pickup Types:**

| Type | Effect |
|------|--------|
| experience | Grants XP toward level up |
| health | Restores player HP |
| magnet | Pulls all pickups to player |
| bomb | Damages all enemies on screen |
| clock | Freezes enemies temporarily |

**Systems:**
- DropSystem (Priority 30): Spawns pickups on enemy death
- PickupSystem (Priority 35): Handles player collection

---

### 2.3 Weapon Evolution

**Purpose:** Weapon upgrades through play

**Tier System:**

| Tier | Rarity | Stat Multiplier | Acquisition |
|------|--------|-----------------|-------------|
| 1 | Common | 1.0x | Level-up rewards |
| 2 | Uncommon | 1.3x | Level-up, evolution |
| 3 | Rare | 1.6x | Level-up, evolution |
| 4 | Epic | 2.0x | Level-up, evolution |
| 5 | Legendary | 2.5x | Evolution only |

**Evolution Methods:**
- **Level Evolution**: Max level weapon + conditions → next tier
- **Recipe Evolution**: Combine two specific weapons → evolved weapon

**Blacklist System:** Prevents offering weapons player already owns

**Reference:** V2 evolution system in `.claude/docs/v3-reference/08-weapon-system.md`

---

### 2.4 Boss Encounters

**Purpose:** Milestone challenges

**Boss Tiers:**

| Tier | Name | HP Range | Spawn Trigger |
|------|------|----------|---------------|
| 1 | Elite | 200-500 | Every 5 waves |
| 2 | Miniboss | 1000-2000 | Every 10 waves |
| 3 | Main Boss | 3000-5000 | Wave 30, 60, etc. |

**Phase System:**
- Phases trigger at health thresholds (100%, 50%, 25%)
- Each phase has different attack patterns
- Speed/damage multipliers per phase

**Boss Properties:**

| Property | Description |
|----------|-------------|
| phases | Array of phase configurations |
| healthThreshold | When phase activates |
| attacks | Available attacks in phase |
| attackInterval | Time between attacks |
| speedMultiplier | Movement speed modifier |
| damageMultiplier | Damage modifier |

**Reference:** V2 boss system in `.claude/docs/v3-reference/09-framework-gaps.md`

---

## Tier 3: Polish and Systems

### 3.1 Audio System

**Purpose:** Sound effects and music

**Implementation:**
- AudioManager singleton
- Sound effects for actions
- Background music

**Gap:** Framework has no audio - custom implementation needed

---

### 3.2 Particle System

**Purpose:** Visual effects

**Effects:**
- Death explosions
- Hit impacts
- Projectile trails

**Gap:** Framework has no particles - custom implementation needed

---

### 3.3 Camera Effects

**Purpose:** Game feel

**Features:**
- Screen shake on damage
- Zoom on level up
- Smooth following

**Framework Support:** Camera class in `core/`

---

### 3.4 Pause Menu

**Purpose:** Game control

**Features:**
- Pause/Resume
- Settings (volume, etc.)
- Return to title

---

## Tier 4: Advanced Features

### 4.1 Tech Core System

**Purpose:** Deep character customization

**Features:**
- 15 element-based cores
- 4-depth ability trees
- Tech points economy

**Reference:** V2 tech cores in `.claude/docs/v3-reference/`

---

### 4.2 Save/Load System

**Purpose:** Persistence

**Features:**
- Save game state
- Multiple save slots
- Auto-save

**Implementation:** Custom SaveManager using localStorage

---

### 4.3 Asset Loading

**Purpose:** Pre-load images and sounds

**Features:**
- Loading screen with progress
- Asset caching
- Error handling

---

### 4.4 UI Framework

**Purpose:** Consistent UI components

**Components:**
- Modals
- Buttons
- Progress bars
- Floating text

**Framework Support:** Basic UI in `lib/RF/ui/`

---

## Feature Implementation Order

After MVP, implement features in this order:

1. **Object Pooling** - Performance foundation
2. **Experience + Leveling** - Core progression
3. **Multiple Weapons** - Combat variety
4. **Wave System** - Difficulty curve
5. **Enemy Variety** - Content
6. **Audio System** - Polish
7. **Particle Effects** - Polish
8. **Weapon Evolution** - Depth
9. **Boss Encounters** - Milestone content
10. **Tech Cores** - Deep customization
11. **Save/Load** - Persistence
12. **Full UI** - Complete experience

---

## Related Documentation

- [09-framework-gaps.md](../.claude/docs/v3-reference/09-framework-gaps.md) - What needs custom implementation
- [02-core-systems.md](../.claude/docs/v3-reference/02-core-systems.md) - V2 system reference
- [08-weapon-system.md](../.claude/docs/v3-reference/08-weapon-system.md) - Weapon complexity

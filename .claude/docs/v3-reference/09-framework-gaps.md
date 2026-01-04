# Framework Gap Analysis

This document analyzes V2 features against the reference-framework to identify implementation challenges for V3 development.

---

## Gap Categories

| Category | Count | Examples |
|----------|-------|----------|
| Missing from Framework | 4 | Audio, Particles, SaveManager, AssetLoader |
| Requires Pattern Deviation | 3 | Module system, Aggregator pattern, System scale |
| Custom Implementation Needed | 8 | Tech Cores, Evolution, Bosses, Screen States |

**Key Finding**: Nothing is truly impossible. The framework is extensible - all V2 features can be implemented, but some require significant custom code or pattern adaptations.

---

## 1. Missing from Framework (Must Implement)

Features that have no framework equivalent and must be built from scratch.

### 1.1 Audio System

**What it is**: Sound effects and music playback management.

**Why it's a gap**: Framework has no AudioManager, AudioSource, or sound loading.

**Impact**: Critical for game feel but entirely absent.

**Recommended approach**:

```javascript
// game/audio/AudioManager.js
export class AudioManager {
  _sounds = new Map();      // id -> HTMLAudioElement
  _music = null;            // Currently playing music
  _sfxVolume = 1.0;
  _musicVolume = 0.7;

  loadSound(id, path) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this._sounds.set(id, audio);
    return new Promise(resolve => {
      audio.addEventListener('canplaythrough', resolve, { once: true });
    });
  }

  playSound(id, volume = 1.0) {
    const sound = this._sounds.get(id);
    if (sound) {
      const clone = sound.cloneNode();
      clone.volume = volume * this._sfxVolume;
      clone.play();
    }
  }

  playMusic(id, loop = true) {
    this.stopMusic();
    this._music = this._sounds.get(id);
    if (this._music) {
      this._music.loop = loop;
      this._music.volume = this._musicVolume;
      this._music.play();
    }
  }

  stopMusic() {
    if (this._music) {
      this._music.pause();
      this._music.currentTime = 0;
    }
  }

  setVolume(sfx, music) {
    this._sfxVolume = sfx;
    this._musicVolume = music;
    if (this._music) this._music.volume = music;
  }
}

export const audio = new AudioManager();
```

**Integration**: Create as singleton, initialize before Game.start().

---

### 1.2 Particle System

**What it is**: Visual particle effects (explosions, trails, impacts).

**Why it's a gap**: Framework has no ParticleEmitter or particle pooling.

**Impact**: Visual polish requires custom implementation.

**Recommended approach**:

```javascript
// game/effects/ParticleSystem.js
import { System } from '../reference-framework/ecs/System.js';
import { ObjectPool } from '../reference-framework/lib/RF/core/ObjectPool.js';

class Particle {
  x = 0; y = 0;
  vx = 0; vy = 0;
  life = 0; maxLife = 1;
  size = 4; color = '#ffffff';
  alpha = 1;

  reset(config) {
    Object.assign(this, config);
    this.life = this.maxLife;
    this.alpha = 1;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    this.alpha = this.life / this.maxLife;
    return this.life > 0;
  }
}

export class ParticleSystem extends System {
  _priority = 95;  // Before RenderSystem
  _particles = [];
  _pool = new ObjectPool(() => new Particle(), p => p, 200, 1000);

  emit(config) {
    // config: { x, y, count, speed, lifetime, color, spread }
    const { x, y, count = 10, speed = 100, lifetime = 1, color = '#fff', spread = 360 } = config;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * spread - spread / 2) * Math.PI / 180;
      const vel = speed * (0.5 + Math.random() * 0.5);
      const particle = this._pool.get();
      particle.reset({
        x, y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        maxLife: lifetime * (0.5 + Math.random() * 0.5),
        color,
        size: 2 + Math.random() * 4
      });
      this._particles.push(particle);
    }
  }

  update(deltaTime) {
    this._particles = this._particles.filter(p => {
      const alive = p.update(deltaTime);
      if (!alive) this._pool.release(p);
      return alive;
    });
  }

  render(ctx) {
    this._particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}
```

**Integration**: Add as system with render method, use object pool for particles.

---

### 1.3 Save/Load Manager

**What it is**: Full game state persistence with save slots.

**Why it's a gap**: Framework has `Serializer` but no SaveManager for:
- Multiple save slots
- Auto-save triggers
- Save file validation
- Progress tracking

**Recommended approach**:

```javascript
// game/data/SaveManager.js
import { Serializer } from '../reference-framework/lib/RF/data/Serializer.js';

export class SaveManager {
  _serializer = new Serializer({ version: 1 });
  _storageKey = 'vampire_survivors_v3';
  _maxSlots = 3;

  saveGame(slot, gameState) {
    if (slot < 0 || slot >= this._maxSlots) return false;

    const saveData = {
      version: 1,
      timestamp: Date.now(),
      slot,
      state: this._serializer.serialize(gameState)
    };

    try {
      const saves = this._getAllSaves();
      saves[slot] = saveData;
      localStorage.setItem(this._storageKey, JSON.stringify(saves));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  loadGame(slot) {
    const saves = this._getAllSaves();
    const saveData = saves[slot];
    if (!saveData) return null;
    return this._serializer.deserialize(saveData.state);
  }

  deleteSave(slot) {
    const saves = this._getAllSaves();
    saves[slot] = null;
    localStorage.setItem(this._storageKey, JSON.stringify(saves));
  }

  getSaveInfo(slot) {
    const saves = this._getAllSaves();
    const save = saves[slot];
    if (!save) return null;
    return {
      slot,
      timestamp: save.timestamp,
      formattedDate: new Date(save.timestamp).toLocaleString()
    };
  }

  _getAllSaves() {
    try {
      return JSON.parse(localStorage.getItem(this._storageKey)) || [];
    } catch {
      return [];
    }
  }
}

export const saveManager = new SaveManager();
```

**Integration**: Use framework's Serializer internally, add slot management layer.

---

### 1.4 Asset Loader

**What it is**: Preloading and caching of images/sounds with progress tracking.

**Why it's a gap**: Framework has no asset management.

**Recommended approach**:

```javascript
// game/core/AssetLoader.js
export class AssetLoader {
  _images = new Map();
  _sounds = new Map();
  _loaded = 0;
  _total = 0;
  _onProgress = null;

  queueImage(id, path) {
    this._total++;
    const img = new Image();
    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        this._loaded++;
        if (this._onProgress) this._onProgress(this.progress);
        resolve(img);
      };
      img.onerror = reject;
    });
    img.src = path;
    this._images.set(id, { img, promise });
    return promise;
  }

  queueSound(id, path) {
    this._total++;
    const audio = new Audio();
    const promise = new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', () => {
        this._loaded++;
        if (this._onProgress) this._onProgress(this.progress);
        resolve(audio);
      }, { once: true });
      audio.onerror = reject;
    });
    audio.src = path;
    this._sounds.set(id, { audio, promise });
    return promise;
  }

  async loadAll() {
    const imagePromises = [...this._images.values()].map(i => i.promise);
    const soundPromises = [...this._sounds.values()].map(s => s.promise);
    await Promise.all([...imagePromises, ...soundPromises]);
  }

  getImage(id) {
    return this._images.get(id)?.img || null;
  }

  getSound(id) {
    return this._sounds.get(id)?.audio || null;
  }

  get progress() {
    return this._total === 0 ? 1 : this._loaded / this._total;
  }

  onProgress(callback) {
    this._onProgress = callback;
  }
}

export const assets = new AssetLoader();
```

**Integration**: Initialize before game start, pass to AudioManager and RenderSystem.

---

## 2. Requires Pattern Deviation

Features that conflict with framework patterns and require architectural decisions.

### 2.1 Module System: IIFE vs ES6

**V2 Pattern**: IIFE with global namespace

```javascript
// V2: IIFE + namespace
(function (Data) {
  Data.WeaponRegistry.fireball = { id: 'fireball', ... };
})(window.VampireSurvivors.Data);
```

**Framework Pattern**: ES6 modules with import/export

```javascript
// Framework: ES6 modules
import { Registry } from './reference-framework/lib/RF/patterns/Registry.js';
export const weaponRegistry = new Registry();
weaponRegistry.register('fireball', { id: 'fireball', ... });
```

**Why it's a deviation**: V2 has 100+ individual data files relying on script load order.

**Recommended approach**: Convert to ES6 modules with barrel exports

```javascript
// game/data/weapons/arcane_dart.js
export const arcane_dart = {
  id: 'arcane_dart',
  name: 'Arcane Dart',
  attackType: 'projectile',
  damage: 12,
  cooldown: 0.6
};

// game/data/weapons/index.js (barrel export)
export * from './arcane_dart.js';
export * from './fireball.js';
export * from './ice_shard.js';
// ... all weapons

// game/data/weapons/registry.js
import * as weapons from './index.js';
import { GameRegistry } from '../GameRegistry.js';

export const weaponRegistry = new GameRegistry('Weapons');
Object.values(weapons).forEach(w => weaponRegistry.register(w.id, w));
weaponRegistry.finalize();
```

**Migration effort**: HIGH - All 100+ weapon, enemy, boss, tech core files need conversion.

---

### 2.2 Data Aggregation Pattern

**V2 Pattern**: Registry → Individual files → Aggregator with post-processing

```javascript
// V2: WeaponAggregator.js runs after all weapon files loaded
Data.WeaponData = {};
Object.keys(Data.WeaponRegistry).forEach(key => {
  Data.WeaponData[key] = Data.WeaponRegistry[key];
});
// Validation, helper functions, console logging
```

**Framework Pattern**: Single Registry with register() calls, no aggregation

**Why it's a deviation**: V2 aggregators provide:
- Validation of required fields
- Helper function generation (getWeaponsByTier, etc.)
- Console logging of load counts
- Cross-registry linking (evolutions, tech cores)

**Recommended approach**: Create extended GameRegistry subclass

```javascript
// game/patterns/GameRegistry.js
import { Registry } from '../reference-framework/lib/RF/patterns/Registry.js';

export class GameRegistry extends Registry {
  _name = 'Unnamed';
  _validators = [];

  constructor(name) {
    super();
    this._name = name;
  }

  addValidator(fn) {
    this._validators.push(fn);
  }

  finalize() {
    // Run validators
    const entries = this.getAll();
    entries.forEach((data, id) => {
      this._validators.forEach(v => v(data, id));
    });
    console.log(`[${this._name}] Loaded ${this.count} entries`);
  }

  // V2-compatible helpers
  getByTier(tier) {
    return this.filter(item => item.tier === tier);
  }

  getByRarity(rarity) {
    return this.filter(item => item.rarity === rarity);
  }

  filter(predicate) {
    return this.getAll().filter(predicate);
  }
}
```

**Usage**:

```javascript
const weaponRegistry = new GameRegistry('Weapons');
weaponRegistry.addValidator((weapon, id) => {
  const required = ['id', 'name', 'attackType', 'damage', 'cooldown'];
  required.forEach(field => {
    if (!(field in weapon)) {
      console.warn(`[Weapons] ${id} missing field: ${field}`);
    }
  });
});
// Register all weapons...
weaponRegistry.finalize();  // Loaded 110 entries
```

---

### 2.3 System Scale (28 Systems)

**V2 Pattern**: 28 specialized systems with fine-grained responsibilities

- Separate systems for ProjectileSystem, AreaEffectSystem, MineSystem, SummonSystem
- Complex priority ordering (0-120)
- System interdependencies

**Framework Pattern**: Simpler examples with ~5-10 systems

**Why it's a deviation**: Framework examples don't demonstrate:
- System interdependencies at this scale
- Shared behavior patterns across systems
- Complex priority ordering requirements

**Recommended approach**: Keep V2's system granularity, document dependencies

```javascript
// game/systems/README.md
// System Dependency Graph:
//
// Input Phase (0-9):
//   PlayerSystem(5) → sets Velocity
//
// Movement Phase (10-19):
//   MovementSystem(10) → updates Transform from Velocity
//
// Spawn Phase (15):
//   ProjectileSystem(15) → spawns projectiles
//   AreaEffectSystem(15) → spawns area zones
//   MineSystem(15) → spawns mines
//
// Collision Phase (20-29):
//   CollisionSystem(20) → detects collisions, emits events
//   BuffDebuffSystem(22) → processes status effects
//   CombatSystem(25) → handles damage from collision events
//
// ... continue for all 28 systems
```

**Integration**: No code changes needed, just maintain V2's structure.

---

## 3. Custom Implementation Needed

Features the framework can support but require game-specific implementation.

### 3.1 Tech Core + Tech Tree System

**What it is**: 15 element-based cores with 4-depth ability trees, 10 levels each.

**Complexity**:
- Nested prerequisites (depth1 requires base, depth2 requires depth1)
- 4 effect types (stat boost, weapon modifier, trigger, passive)
- Evolution chain per core (5 tiers)
- Tech point economy

**Framework support**: Registry for data, StateMachine for tree traversal.

**Implementation approach**:

```javascript
// game/systems/TechCoreSystem.js
import { System } from '../reference-framework/ecs/System.js';
import { techCoreRegistry } from '../data/techcores/registry.js';

export class TechCoreSystem extends System {
  _priority = 1;
  _selectedCore = null;
  _unlockedAbilities = new Map();  // abilityId -> level
  _techPoints = 0;

  selectCore(coreId) {
    this._selectedCore = techCoreRegistry.get(coreId);
    // Emit 'techcore:selected'
  }

  canUnlock(abilityId) {
    const ability = this._findAbility(abilityId);
    if (!ability) return false;
    if (this._techPoints < ability.cost) return false;
    return this._meetsPrerequisites(ability);
  }

  unlock(abilityId) {
    if (!this.canUnlock(abilityId)) return false;

    const ability = this._findAbility(abilityId);
    const currentLevel = this._unlockedAbilities.get(abilityId) || 0;

    if (currentLevel >= ability.maxLevel) return false;

    this._techPoints -= ability.cost;
    this._unlockedAbilities.set(abilityId, currentLevel + 1);
    this._applyEffect(ability, currentLevel + 1);

    events.emit('techcore:ability_unlocked', { abilityId, level: currentLevel + 1 });
    return true;
  }

  _meetsPrerequisites(ability) {
    if (!ability.requires) return true;
    return ability.requires.every(reqId => {
      const reqLevel = this._unlockedAbilities.get(reqId) || 0;
      return reqLevel > 0;
    });
  }

  _applyEffect(ability, level) {
    const effect = ability.effect;
    // Apply based on effect type: stat, weapon, trigger, passive
  }
}
```

---

### 3.2 Weapon Evolution System

**What it is**: 5-tier progression with recipe-based evolution.

**Complexity**:
- Evolution recipes (weapon A + weapon B = weapon C)
- Cross-tier evolution allowed
- Blacklist manager (prevents offering already-owned weapons)
- Tier stat multipliers

**Framework support**: Registry for recipes.

**Implementation approach**:

```javascript
// game/systems/evolution/EvolutionHandler.js
import { GameRegistry } from '../patterns/GameRegistry.js';

class BlacklistManager {
  _blacklist = new Set();

  add(weaponId) { this._blacklist.add(weaponId); }
  has(weaponId) { return this._blacklist.has(weaponId); }
  clear() { this._blacklist.clear(); }
}

export class EvolutionHandler {
  _recipes = new GameRegistry('EvolutionRecipes');
  _blacklist = new BlacklistManager();

  registerRecipe(weapon1, weapon2, result) {
    const key = this._makeKey(weapon1, weapon2);
    this._recipes.register(key, { weapon1, weapon2, result });
  }

  checkEvolution(weaponA, weaponB) {
    const key = this._makeKey(weaponA.id, weaponB.id);
    return this._recipes.get(key);
  }

  evolve(player, weaponA, weaponB) {
    const recipe = this.checkEvolution(weaponA, weaponB);
    if (!recipe) return null;

    // Remove ingredient weapons from player
    player.removeWeapon(weaponA.id);
    player.removeWeapon(weaponB.id);

    // Add evolved weapon
    const evolved = weaponRegistry.get(recipe.result);
    player.addWeapon(evolved);

    // Update blacklist
    this._blacklist.add(weaponA.id);
    this._blacklist.add(weaponB.id);

    events.emit('weapon:evolved', { from: [weaponA.id, weaponB.id], to: recipe.result });
    return evolved;
  }

  _makeKey(id1, id2) {
    return [id1, id2].sort().join('_');
  }
}
```

---

### 3.3 Multi-Phase Boss System

**What it is**: Bosses with health-threshold phases, each with different attacks.

**Complexity**:
- 3-4 phases at 100%, 50%, 25% health
- Phase-specific attack patterns
- Speed/damage multipliers per phase
- Attack pattern cooldowns

**Framework support**: StateMachine for phases.

**Implementation approach**:

```javascript
// game/entities/Boss.js
import { Entity } from '../reference-framework/ecs/Entity.js';
import { StateMachine } from '../reference-framework/lib/RF/core/StateMachine.js';

export class Boss extends Entity {
  _phaseMachine = null;
  _attackCooldown = 0;

  constructor(bossData) {
    super();
    this._bossData = bossData;

    this._phaseMachine = new StateMachine('phase1', {
      phase1: {
        onEnter: () => this._setPhase(0),
        onUpdate: (ctx, dt) => this._executePattern(dt),
        transitions: { toPhase2: 'phase2' }
      },
      phase2: {
        onEnter: () => this._setPhase(1),
        onUpdate: (ctx, dt) => this._executePattern(dt),
        transitions: { toPhase3: 'phase3' }
      },
      phase3: {
        onEnter: () => this._setPhase(2),
        onUpdate: (ctx, dt) => this._executePattern(dt)
      }
    }, this);
  }

  update(dt) {
    this._checkPhaseTransition();
    this._phaseMachine.update(dt);
  }

  _checkPhaseTransition() {
    const health = this.getComponent(Health);
    const percent = health.percentage;

    if (percent <= 0.5 && this._phaseMachine.currentState === 'phase1') {
      this._phaseMachine.transition('toPhase2');
    } else if (percent <= 0.25 && this._phaseMachine.currentState === 'phase2') {
      this._phaseMachine.transition('toPhase3');
    }
  }

  _setPhase(phaseIndex) {
    const phase = this._bossData.phases[phaseIndex];
    this._currentAttacks = phase.attacks;
    this._speedMultiplier = phase.speedMultiplier || 1;
    this._cooldownMultiplier = phase.cooldownMultiplier || 1;
  }
}
```

---

### 3.4 Screen State Management

**What it is**: Unity-style suspend/resume for overlapping UI screens.

**Complexity**:
- LevelUp suspends when Tab pressed
- Tab closes, LevelUp resumes
- Pause menu priority over all
- Stack-based screen history

**Framework support**: StateMachine, EventBus.

**Implementation approach**:

```javascript
// game/ui/ScreenManager.js
import { events } from '../reference-framework/core/EventBus.js';

export class ScreenManager {
  _screenStack = [];
  _screens = new Map();

  register(screenId, screen) {
    this._screens.set(screenId, screen);
  }

  requestOpen(screenId) {
    const current = this._screenStack[this._screenStack.length - 1];
    if (current) {
      current.suspend();
      events.emit('screen:suspended', { screen: current.id });
    }

    const screen = this._screens.get(screenId);
    if (screen) {
      screen.open();
      this._screenStack.push(screen);
      events.emit('screen:opened', { screen: screenId });
    }
  }

  close(screenId) {
    const index = this._screenStack.findIndex(s => s.id === screenId);
    if (index === -1) return;

    const screen = this._screenStack[index];
    screen.close();
    this._screenStack.splice(index, 1);
    events.emit('screen:closed', { screen: screenId });

    // Resume previous screen
    const previous = this._screenStack[this._screenStack.length - 1];
    if (previous) {
      previous.resume();
      events.emit('screen:resumed', { screen: previous.id });
    }
  }

  get activeScreen() {
    return this._screenStack[this._screenStack.length - 1] || null;
  }
}

export const screenManager = new ScreenManager();
```

---

### 3.5 Global Stats Helper

**What it is**: Centralized stat calculation with all modifiers applied.

**Complexity**:
- Player base stats + upgrades + tech bonuses + buffs
- Weapon damage/cooldown/area modifiers
- Multiplicative vs additive stacking

**Framework support**: None specific.

**Implementation approach**:

```javascript
// game/utils/GlobalStatsHelper.js
export class GlobalStatsHelper {
  static getDamageMultiplier(player, weapon) {
    let mult = 1.0;

    // Player stat bonus
    const stats = player.getComponent(PlayerStats);
    mult *= 1 + (stats.damageBonus || 0);

    // Weapon tier multiplier
    const tierMults = [1.0, 1.3, 1.6, 2.0, 2.5];
    mult *= tierMults[weapon.tier - 1] || 1.0;

    // Buff multiplier
    const buffs = player.getComponent(BuffDebuff);
    if (buffs) {
      mult *= 1 + (buffs.getStatModifier('damage') || 0);
    }

    // Tech core bonus
    const tech = player.getComponent(TechTree);
    if (tech) {
      mult *= 1 + (tech.getDamageBonus() || 0);
    }

    return mult;
  }

  static getEffectiveCooldown(player, weapon) {
    const base = weapon.cooldown;
    const stats = player.getComponent(PlayerStats);
    const reduction = stats.cooldownReduction || 0;

    // Cap at 90% reduction
    return base * (1 - Math.min(reduction, 0.9));
  }

  static getEffectiveArea(player, weapon) {
    const base = weapon.area || weapon.range;
    const stats = player.getComponent(PlayerStats);
    return base * (1 + (stats.areaBonus || 0));
  }
}
```

---

### 3.6 Specialized Object Pools with EntityManager

**What it is**: Pools that auto-register/unregister with EntityManager.

**V2 Pattern**:

```javascript
var projectile = projectilePool.get();
entityManager.add(projectile);
// Later:
entityManager.remove(projectile);
projectilePool.release(projectile);
```

**Framework ObjectPool**: Standalone, no EntityManager integration.

**Implementation approach**:

```javascript
// game/core/ManagedPool.js
import { ObjectPool } from '../reference-framework/lib/RF/core/ObjectPool.js';

export class ManagedPool extends ObjectPool {
  _entityManager = null;

  setEntityManager(em) {
    this._entityManager = em;
  }

  spawn(initFn) {
    const obj = this.get();
    if (initFn) initFn(obj);
    if (this._entityManager) {
      this._entityManager.add(obj);
    }
    return obj;
  }

  despawn(obj) {
    if (this._entityManager) {
      this._entityManager.remove(obj);
    }
    this.release(obj);
  }

  despawnAll() {
    // Get all active objects from pool and despawn
    const active = this.getActive();
    active.forEach(obj => this.despawn(obj));
  }
}
```

---

### 3.7 Complex Collision Callbacks

**What it is**: Per-enemy damage cooldowns to prevent damage spam.

**V2 Pattern**: Track last damage time per enemy-weapon pair.

**Framework support**: Collider has callbacks but simpler implementation.

**Implementation approach**:

```javascript
// game/systems/combat/DamageCooldownManager.js
import { Time } from '../reference-framework/core/Time.js';

export class DamageCooldownManager {
  _cooldowns = new Map();  // `${enemyId}_${weaponId}` -> lastDamageTime

  canDamage(enemy, weapon) {
    const key = `${enemy.id}_${weapon.id}`;
    const lastTime = this._cooldowns.get(key) || 0;
    const cooldown = weapon.damageCooldown || 0.1;
    return Time.elapsed - lastTime >= cooldown;
  }

  recordDamage(enemy, weapon) {
    const key = `${enemy.id}_${weapon.id}`;
    this._cooldowns.set(key, Time.elapsed);
  }

  cleanup(entityId) {
    // Remove entries for destroyed entity
    const keysToDelete = [];
    this._cooldowns.forEach((_, key) => {
      if (key.startsWith(`${entityId}_`) || key.includes(`_${entityId}`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(k => this._cooldowns.delete(k));
  }

  clear() {
    this._cooldowns.clear();
  }
}

export const damageCooldowns = new DamageCooldownManager();
```

---

### 3.8 Data Validation

**What it is**: Validate all registry data at load time.

**Framework Registry**: Has no validation hooks.

**Implementation approach**: Use GameRegistry (from 2.2) with validators:

```javascript
// game/data/weapons/registry.js
import { GameRegistry } from '../GameRegistry.js';
import * as weapons from './index.js';

export const weaponRegistry = new GameRegistry('Weapons');

// Add validators
weaponRegistry.addValidator((weapon, id) => {
  const required = ['id', 'name', 'attackType', 'damage', 'cooldown'];
  required.forEach(field => {
    if (!(field in weapon)) {
      console.warn(`[Weapons] ${id} missing required field: ${field}`);
    }
  });
});

weaponRegistry.addValidator((weapon, id) => {
  const validTypes = ['projectile', 'laser', 'melee_swing', 'melee_thrust', 'area_damage', 'particle', 'mine', 'summon'];
  if (!validTypes.includes(weapon.attackType)) {
    console.warn(`[Weapons] ${id} has invalid attackType: ${weapon.attackType}`);
  }
});

// Register all weapons
Object.values(weapons).forEach(w => weaponRegistry.register(w.id, w));

// Finalize (runs validators)
weaponRegistry.finalize();
```

---

## Implementation Priority

| Priority | Feature | Effort | Dependency |
|----------|---------|--------|------------|
| 1 | Module System Conversion | High | Blocks all other work |
| 2 | GameRegistry + Aggregator | Medium | Blocks data loading |
| 3 | AssetLoader | Medium | Blocks rendering |
| 4 | ManagedPool | Low | Blocks entity spawning |
| 5 | Tech Core System | High | Core gameplay |
| 6 | Evolution System | Medium | Core gameplay |
| 7 | Screen Manager | Medium | UI flow |
| 8 | Boss System | Medium | Content |
| 9 | Audio System | Medium | Polish |
| 10 | Particle System | Low | Polish |
| 11 | Save Manager | Low | Persistence |

---

## Related Documents

- [05-framework-usage.md](./05-framework-usage.md) - How to use reference-framework
- [03-design-patterns.md](./03-design-patterns.md) - V2 patterns to preserve
- [07-data-architecture.md](./07-data-architecture.md) - Registry+Aggregator details
- [08-weapon-system.md](./08-weapon-system.md) - Weapon system complexity

# Issues and Solutions

This document catalogs significant issues encountered during V2 development and how they were resolved. Use this to avoid repeating mistakes in V3.

---

## 1. Buff/Debuff System Migration

### Issue
The original `StatusEffect` system was inconsistent and hard to extend. Different systems handled buffs differently, making it difficult to add new effects.

### What Happened
- Status effects scattered across multiple systems
- No unified data structure for effect definitions
- Hard to stack, refresh, or combine effects
- Difficult to display active effects in UI

### Solution
Implemented a unified `BuffDebuff` system with data-driven effect definitions.

### Implementation
```javascript
// Data-driven effect definition
Data.BuffDebuffRegistry.burning = {
  id: 'burning',
  name: 'Burning',
  category: EffectCategory.DEBUFF,
  type: EffectType.DOT,
  damage: 5,
  duration: 3.0,
  tickRate: 0.5,
  stackable: true,
  maxStacks: 5
};

// Unified component
class BuffDebuff extends Component {
  constructor() {
    this._activeEffects = new Map();  // effectId → effect data
  }

  apply(effectId, stacks) {
    var effect = Data.getBuffDebuffData(effectId);
    // Handle stacking, refreshing, etc.
  }
}
```

### Files Changed
- Created: `src/components/BuffDebuff.js`
- Created: `src/data/buffdebuff/BuffDebuffConstants.js`
- Created: `src/data/buffdebuff/BuffDebuffAggregator.js`
- Modified: `src/systems/StatusEffectSystem.js`

### Commits
- `3c396a3` - Added unified buff/debuff system with data-driven effects
- `c9a68a3` - Complete migration from StatusEffect to unified BuffDebuff system
- `69650ae` - Stack-based buff/debuff system with visual icons

### Lesson for V3
Design effect systems data-driven from the start. The framework's `BuffDebuff` component provides this foundation.

---

## 2. Mouse Targeting Accuracy

### Issue
Mouse-aimed weapons fired in wrong directions because mouse world position wasn't updated every frame.

### What Happened
- Mouse position was calculated once on click
- Camera movement caused position drift
- Player movement caused targeting errors

### Solution
Update mouse world position calculation every frame in Input system.

### Implementation
```javascript
// In Input.update()
updateMouseWorldPosition() {
  this._mouseWorldPosition = Camera.screenToWorld(
    this._mouseScreenPosition
  );
}

// In WeaponBehavior
getMouseDirection(player) {
  var mouseWorld = Input.getMouseWorldPosition();
  return Vector2.normalize(
    Vector2.subtract(mouseWorld, player.position)
  );
}
```

### Commit
- `34212ed` - Fixed mouse targeting accuracy

### Lesson for V3
Always recalculate derived positions (world coordinates from screen) every frame, not just on input events.

---

## 3. Lifesteal for Non-Projectile Weapons

### Issue
Lifesteal and HealOnHit only worked for projectile weapons, not melee or area attacks.

### What Happened
- Lifesteal was processed in projectile collision handler
- Melee and area weapons never triggered the handler
- Players expected lifesteal to work on all weapons

### Solution
Process `weapon:hit` events for all weapon types in CombatSystem, not just projectile collisions.

### Implementation
```javascript
// In CombatSystem
initialize() {
  events.on('weapon:hit', this._handleWeaponHit.bind(this));
}

_handleWeaponHit(data) {
  var weapon = data.weapon;
  var damage = data.damage;

  // Apply lifesteal
  if (weapon.lifesteal > 0) {
    var healAmount = damage * weapon.lifesteal;
    player.getComponent(Health).heal(healAmount);
  }

  // Apply healOnHit
  if (weapon.healOnHit > 0) {
    player.getComponent(Health).heal(weapon.healOnHit);
  }
}

// In MeleeBehavior, AreaBehavior, etc.
execute(weapon, player) {
  // ... deal damage ...
  events.emit('weapon:hit', {
    weapon: weapon,
    damage: damageDealt,
    target: enemy
  });
}
```

### Commit
- `6830cea` - Fixed lifesteal/HealOnHit for non-projectile weapons

### Lesson for V3
Use events for cross-cutting concerns like lifesteal. All weapon behaviors should emit `weapon:hit` regardless of attack type.

---

## 4. Cooldown Reduction Not Applied to Active Skills

### Issue
Player stat upgrades for cooldown reduction didn't affect character active skills.

### What Happened
- Cooldown reduction multiplier calculated in GlobalStatsHelper
- Active skills used raw cooldown values
- Players felt skills were too slow after upgrading cooldown stats

### Solution
Apply cooldown reduction via GlobalStatsHelper to ActiveSkillSystem.

### Implementation
```javascript
// In ActiveSkillSystem
getEffectiveCooldown(skill) {
  var baseCooldown = skill.cooldown;
  var reduction = GlobalStatsHelper.getCooldownReduction();
  return baseCooldown * (1 - reduction);
}

update(deltaTime) {
  if (this._cooldownTimer >= this.getEffectiveCooldown(skill)) {
    // Skill ready
  }
}
```

### Commit
- `427852b` - Applied cooldown reduction to active skills

### Lesson for V3
All timed abilities should use a centralized stat calculation helper. Create a `StatsCalculator` utility that all systems use.

---

## 5. Screen State Management Conflicts

### Issue
Multiple UI screens (LevelUpScreen, TabScreen, PauseMenu) conflicted when opened simultaneously.

### What Happened
- LevelUp opens, player presses Tab → both screens visible
- Input handlers confused about which screen is active
- Closing one screen affected the other

### Solution
Unity-style screen state management with suspend/resume events.

### Implementation
```javascript
// Screen states
var ScreenState = {
  CLOSED: 'closed',
  OPEN: 'open',
  SUSPENDED: 'suspended'  // Hidden but remembers state
};

// In LevelUpSystem
_handleTabPressed() {
  if (this._state === ScreenState.OPEN) {
    this._state = ScreenState.SUSPENDED;
    events.emit('screen:suspended', { screen: 'levelup' });
    events.emit('screen:requestOpen', { screen: 'tab' });
  }
}

// TabScreen closes
_handleClose() {
  events.emit('screen:closed', { screen: 'tab' });
  events.emit('screen:requestResume', { screen: 'levelup' });
}

// LevelUpSystem listens for resume
events.on('screen:requestResume', function(data) {
  if (data.screen === 'levelup' && this._state === ScreenState.SUSPENDED) {
    this._state = ScreenState.OPEN;
    // Restore UI
  }
});
```

### Commit
- `4667596` - Applied Unity-style event decoupling to screen and collision systems

### Lesson for V3
Implement a ScreenManager that coordinates all UI screens with proper state transitions. Never have multiple active screens without a stack-based system.

---

## 6. Cross-Tier Weapon Evolution

### Issue
Evolution recipes only matched weapons of the same tier, preventing cross-tier evolutions.

### What Happened
- Fire Sword (tier 2) + Ice Shield (tier 3) should make Elemental Blade
- Evolution handler only checked same-tier combinations
- Players couldn't access certain evolutions

### Solution
Allow cross-tier weapon evolution in EvolutionHandler.

### Implementation
```javascript
// Before: Only same tier
function findEvolution(weaponA, weaponB) {
  if (weaponA.tier !== weaponB.tier) return null;
  // ...
}

// After: Any tier combination
function findEvolution(weaponA, weaponB) {
  var recipe = EvolutionRecipes.find(r =>
    (r.weapon1 === weaponA.id && r.weapon2 === weaponB.id) ||
    (r.weapon1 === weaponB.id && r.weapon2 === weaponA.id)
  );
  return recipe ? recipe.result : null;
}
```

### Commit
- `6a1a5e8` - Improved cross-tier evolution

### Lesson for V3
Evolution recipes should be explicit mappings, not inferred from weapon properties. Store recipes as data, not logic.

---

## 7. Sprite/Image Support for Weapons

### Issue
Weapons only rendered as colored rectangles/circles, lacking visual variety.

### What Happened
- RenderSystem only handled shape-based rendering
- No way to specify images for projectiles
- Game looked less polished

### Solution
Add imageId/spriteSheet support to all weapon attack types.

### Implementation
```javascript
// Weapon data
Data.WeaponRegistry.fireball = {
  id: 'fireball',
  imageId: 'projectile_fireball',  // Reference to loaded image
  visualScale: 1.5,
  // ...
};

// In RenderSystem
renderProjectile(projectile, ctx) {
  var weapon = projectile.getComponent(Weapon);
  if (weapon.imageId) {
    var image = AssetLoader.getImage(weapon.imageId);
    ctx.drawImage(image, x, y, width, height);
  } else {
    // Fallback to shape rendering
    this.renderShape(projectile, ctx);
  }
}
```

### Files Changed
- Modified: `src/systems/RenderSystem.js`
- Modified: All weapon data files (added `imageId`)
- Created: `src/core/AssetLoader.js`
- Created: `src/data/ImageConfig.js`

### Commits
- `392365a` - Added sprite/image support for all weapon attack types
- `4dbaac3` - Weapon icon support in UI

### Lesson for V3
Plan for image-based rendering from the start. The framework's `Sprite` component supports this, but ensure AssetLoader is robust.

---

## 8. Self-Destruct Enemy Explosion Radius

### Issue
Explosion radius indicator displayed at wrong position/size.

### What Happened
- Visual indicator used screen coordinates
- Actual explosion used world coordinates
- Mismatch confused players about danger zone

### Solution
Fix coordinate transformation for explosion visualization.

### Implementation
```javascript
// Render explosion warning in world space
renderExplosionWarning(enemy, ctx) {
  var worldPos = enemy.getComponent(Transform).position;
  var screenPos = Camera.worldToScreen(worldPos);
  var screenRadius = enemy.explosionRadius * Camera.zoom;

  ctx.beginPath();
  ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
  ctx.stroke();
}
```

### Commit
- `50b5482` - Fixed explosion radius indicator

### Lesson for V3
Always be explicit about coordinate spaces. Name variables `worldPos`, `screenPos` to prevent confusion. Create utility functions for coordinate transforms.

---

## General Lessons for V3

1. **Data-driven from start**: Design systems to be configured via data, not code
2. **Events for cross-cutting concerns**: Lifesteal, achievements, analytics should use events
3. **Centralized stat calculation**: One place to compute effective stats with all bonuses
4. **Screen state machine**: Proper state management for UI screens
5. **Explicit coordinate spaces**: Always name and transform coordinates correctly
6. **Frame-based updates**: Recalculate derived values every frame
7. **Recipe-based systems**: Evolutions, crafting should use explicit data mappings

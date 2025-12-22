/**
 * @fileoverview Tech effect type definitions and application logic
 * @module Data/TechEffectData
 */
(function (Data) {
  'use strict';

  // ============================================
  // Effect Type Constants
  // ============================================
  var EffectType = {
    STAT_BONUS: 'stat_bonus',
    UNIQUE_MECHANIC: 'unique_mechanic',
    WEAPON_MODIFIER: 'weapon_modifier',
    PASSIVE_PROC: 'passive_proc',
  };

  // ============================================
  // Stat IDs for stat_bonus effects
  // ============================================
  var StatId = {
    // Offensive stats
    DAMAGE: 'damage',
    CRIT_CHANCE: 'critChance',
    CRIT_DAMAGE: 'critDamage',
    ATTACK_SPEED: 'attackSpeed',
    PROJECTILE_SPEED: 'projectileSpeed',

    // Defensive stats
    MAX_HEALTH: 'maxHealth',
    ARMOR: 'armor',
    DAMAGE_REDUCTION: 'damageReduction',

    // Utility stats
    MOVE_SPEED: 'moveSpeed',
    PICKUP_RANGE: 'pickupRange',
    XP_GAIN: 'xpGain',
    GOLD_GAIN: 'goldGain',
    COOLDOWN_REDUCTION: 'cooldownReduction',

    // Weapon stats
    RANGE: 'range',
    AREA: 'area',
    DURATION: 'duration',
    PIERCE: 'pierce',
    PROJECTILE_COUNT: 'projectileCount',
  };

  // ============================================
  // Mechanic IDs for unique_mechanic effects
  // ============================================
  var MechanicId = {
    // Sustain mechanics
    LIFESTEAL: 'lifesteal',
    HEALTH_REGEN: 'healthRegen',
    SHIELD_ON_KILL: 'shieldOnKill',

    // Damage scaling mechanics
    DAMAGE_SCALES_WITH_SPEED: 'damageScalesWithSpeed',
    DAMAGE_SCALES_WITH_MISSING_HP: 'damageScalesWithMissingHp',
    EXECUTE_THRESHOLD: 'executeThreshold',

    // Defensive mechanics
    DAMAGE_REFLECT: 'damageReflect',
    EVASION: 'evasion',
    PHOENIX_REVIVE: 'phoenixRevive',

    // Status mechanics
    BURN_DAMAGE: 'burnDamage',
    SLOW_ON_HIT: 'slowOnHit',
    FREEZE_CHANCE: 'freezeChance',
    WEAKNESS_DEBUFF: 'weaknessDebuff',

    // Special mechanics
    CHAIN_ATTACK: 'chainAttack',
    SUMMON_MINION: 'summonMinion',
    TIME_SLOW_AURA: 'timeSlowAura',
  };

  // ============================================
  // Proc IDs for passive_proc effects
  // ============================================
  var ProcId = {
    EXPLOSION_ON_KILL: 'explosionOnKill',
    EXPLOSION_ON_CRIT: 'explosionOnCrit',
    LIGHTNING_STRIKE: 'lightningStrike',
    FIRE_SPREAD: 'fireSpread',
    ICE_SHATTER: 'iceShatter',
    VOID_RIFT: 'voidRift',
    HOLY_SMITE: 'holySmite',
    RICOCHET: 'ricochet',
    BLEED_ON_HIT: 'bleedOnHit',
  };

  // ============================================
  // Effect Application Functions
  // ============================================

  /**
   * Calculate effect value at a given level
   * @param {Object} effect - Effect definition
   * @param {number} level - Current tech level
   * @returns {number} Calculated value
   */
  function calculateEffectValue(effect, level) {
    if (level <= 0) return 0;

    var baseValue = effect.baseValue || 0;
    var valuePerLevel = effect.valuePerLevel || 0;

    return baseValue + valuePerLevel * level;
  }

  /**
   * Apply a single effect to the player
   * @param {Entity} player - Player entity
   * @param {Object} effect - Effect definition
   * @param {number} level - Current tech level
   * @param {Object} techEffects - Tech effects tracker on player
   */
  function applyEffect(player, effect, level, techEffects) {
    if (!player || !effect || level <= 0) return;

    var value = calculateEffectValue(effect, level);

    switch (effect.type) {
      case EffectType.STAT_BONUS:
        _applyStatBonus(player, effect.stat, value, techEffects);
        break;

      case EffectType.UNIQUE_MECHANIC:
        _applyMechanic(player, effect.mechanic, value, techEffects);
        break;

      case EffectType.WEAPON_MODIFIER:
        _applyWeaponModifier(player, effect.stat, value, techEffects);
        break;

      case EffectType.PASSIVE_PROC:
        _applyPassiveProc(player, effect.procType, value, techEffects);
        break;
    }
  }

  /**
   * Remove an effect from the player
   * @param {Entity} player - Player entity
   * @param {Object} effect - Effect definition
   * @param {Object} techEffects - Tech effects tracker on player
   */
  function removeEffect(player, effect, techEffects) {
    if (!player || !effect) return;

    switch (effect.type) {
      case EffectType.STAT_BONUS:
        _removeStatBonus(player, effect.stat, techEffects);
        break;

      case EffectType.UNIQUE_MECHANIC:
        _removeMechanic(player, effect.mechanic, techEffects);
        break;

      case EffectType.WEAPON_MODIFIER:
        _removeWeaponModifier(player, effect.stat, techEffects);
        break;

      case EffectType.PASSIVE_PROC:
        _removePassiveProc(player, effect.procType, techEffects);
        break;
    }
  }

  /**
   * Update effect when tech level changes
   * @param {Entity} player - Player entity
   * @param {Object} effect - Effect definition
   * @param {number} oldLevel - Previous level
   * @param {number} newLevel - New level
   * @param {Object} techEffects - Tech effects tracker
   */
  function updateEffect(player, effect, oldLevel, newLevel, techEffects) {
    // Remove old effect and apply new one
    if (oldLevel > 0) {
      removeEffect(player, effect, techEffects);
    }
    if (newLevel > 0) {
      applyEffect(player, effect, newLevel, techEffects);
    }
  }

  // ============================================
  // Private Application Helpers
  // ============================================

  /**
   * Apply stat bonus effect
   */
  function _applyStatBonus(player, statId, value, techEffects) {
    if (!techEffects.statBonuses) {
      techEffects.statBonuses = {};
    }

    // Store the bonus value
    techEffects.statBonuses[statId] = (techEffects.statBonuses[statId] || 0) + value;

    // Apply to appropriate component
    _applyStatToPlayer(player, statId, techEffects.statBonuses[statId]);
  }

  function _removeStatBonus(player, statId, techEffects) {
    if (techEffects.statBonuses && techEffects.statBonuses[statId]) {
      techEffects.statBonuses[statId] = 0;
      _applyStatToPlayer(player, statId, 0);
    }
  }

  function _applyStatToPlayer(player, statId, totalBonus) {
    var PlayerStats = window.VampireSurvivors.Components.PlayerStats;
    var PlayerData = window.VampireSurvivors.Components.PlayerData;
    var Health = window.VampireSurvivors.Components.Health;

    var playerStats = player.getComponent(PlayerStats);
    var playerData = player.getComponent(PlayerData);
    var health = player.getComponent(Health);

    switch (statId) {
      case StatId.MAX_HEALTH:
        if (health) {
          var baseMax = playerData ? playerData.baseMaxHealth : 100;
          var statsBonus = playerStats ? playerStats.getMultiplier('maxHealth') : 1;
          var techBonus = 1 + totalBonus;
          var newMax = Math.floor(baseMax * statsBonus * techBonus);
          var oldMax = health.maxHealth;
          health.setMaxHealth(newMax, false);
          if (newMax > oldMax) {
            health.heal(newMax - oldMax);
          }
        }
        break;

      case StatId.MOVE_SPEED:
        var baseSpeed = playerData ? playerData.baseSpeed : 100;
        var statsSpeedBonus = playerStats ? playerStats.getMultiplier('moveSpeed') : 1;
        var techSpeedBonus = 1 + totalBonus;
        player.speed = Math.floor(baseSpeed * statsSpeedBonus * techSpeedBonus);
        break;

      case StatId.DAMAGE:
      case StatId.CRIT_CHANCE:
      case StatId.CRIT_DAMAGE:
      case StatId.ATTACK_SPEED:
      case StatId.COOLDOWN_REDUCTION:
      case StatId.RANGE:
      case StatId.AREA:
      case StatId.PIERCE:
      case StatId.PROJECTILE_COUNT:
      case StatId.PROJECTILE_SPEED:
        // These are applied per-weapon in WeaponSystem
        // Store in techEffects for weapon calculations
        break;

      case StatId.PICKUP_RANGE:
      case StatId.XP_GAIN:
      case StatId.GOLD_GAIN:
        // Applied in PickupSystem / DropSystem
        break;

      case StatId.ARMOR:
      case StatId.DAMAGE_REDUCTION:
        // Applied in CombatSystem when taking damage
        break;
    }
  }

  /**
   * Apply unique mechanic effect
   */
  function _applyMechanic(player, mechanicId, value, techEffects) {
    if (!techEffects.mechanics) {
      techEffects.mechanics = {};
    }

    techEffects.mechanics[mechanicId] = value;
  }

  function _removeMechanic(player, mechanicId, techEffects) {
    if (techEffects.mechanics) {
      delete techEffects.mechanics[mechanicId];
    }
  }

  /**
   * Apply weapon modifier effect
   */
  function _applyWeaponModifier(player, statId, value, techEffects) {
    if (!techEffects.weaponModifiers) {
      techEffects.weaponModifiers = {};
    }

    techEffects.weaponModifiers[statId] =
      (techEffects.weaponModifiers[statId] || 0) + value;
  }

  function _removeWeaponModifier(player, statId, techEffects) {
    if (techEffects.weaponModifiers) {
      techEffects.weaponModifiers[statId] = 0;
    }
  }

  /**
   * Apply passive proc effect
   */
  function _applyPassiveProc(player, procId, chance, techEffects) {
    if (!techEffects.passiveProcs) {
      techEffects.passiveProcs = {};
    }

    techEffects.passiveProcs[procId] = chance;
  }

  function _removePassiveProc(player, procId, techEffects) {
    if (techEffects.passiveProcs) {
      delete techEffects.passiveProcs[procId];
    }
  }

  // ============================================
  // Getter Functions for Combat/System Use
  // ============================================

  /**
   * Get total stat bonus from tech effects
   * @param {Object} techEffects - Tech effects tracker
   * @param {string} statId - Stat to check
   * @returns {number} Total bonus value
   */
  function getStatBonus(techEffects, statId) {
    if (!techEffects || !techEffects.statBonuses) return 0;
    return techEffects.statBonuses[statId] || 0;
  }

  /**
   * Get mechanic value from tech effects
   * @param {Object} techEffects - Tech effects tracker
   * @param {string} mechanicId - Mechanic to check
   * @returns {number} Mechanic value (0 if not active)
   */
  function getMechanicValue(techEffects, mechanicId) {
    if (!techEffects || !techEffects.mechanics) return 0;
    return techEffects.mechanics[mechanicId] || 0;
  }

  /**
   * Get weapon modifier value from tech effects
   * @param {Object} techEffects - Tech effects tracker
   * @param {string} statId - Stat to check
   * @returns {number} Modifier value
   */
  function getWeaponModifier(techEffects, statId) {
    if (!techEffects || !techEffects.weaponModifiers) return 0;
    return techEffects.weaponModifiers[statId] || 0;
  }

  /**
   * Get passive proc chance from tech effects
   * @param {Object} techEffects - Tech effects tracker
   * @param {string} procId - Proc to check
   * @returns {number} Proc chance (0-1)
   */
  function getProcChance(techEffects, procId) {
    if (!techEffects || !techEffects.passiveProcs) return 0;
    return techEffects.passiveProcs[procId] || 0;
  }

  /**
   * Check if a mechanic is active
   * @param {Object} techEffects - Tech effects tracker
   * @param {string} mechanicId - Mechanic to check
   * @returns {boolean}
   */
  function hasMechanic(techEffects, mechanicId) {
    return getMechanicValue(techEffects, mechanicId) > 0;
  }

  /**
   * Roll for a passive proc
   * @param {Object} techEffects - Tech effects tracker
   * @param {string} procId - Proc to roll
   * @returns {boolean} True if proc triggered
   */
  function rollProc(techEffects, procId) {
    var chance = getProcChance(techEffects, procId);
    return Math.random() < chance;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.EffectType = EffectType;
  Data.StatId = StatId;
  Data.MechanicId = MechanicId;
  Data.ProcId = ProcId;

  Data.TechEffectData = {
    EffectType: EffectType,
    StatId: StatId,
    MechanicId: MechanicId,
    ProcId: ProcId,

    // Application functions
    calculateEffectValue: calculateEffectValue,
    applyEffect: applyEffect,
    removeEffect: removeEffect,
    updateEffect: updateEffect,

    // Getter functions
    getStatBonus: getStatBonus,
    getMechanicValue: getMechanicValue,
    getWeaponModifier: getWeaponModifier,
    getProcChance: getProcChance,
    hasMechanic: hasMechanic,
    rollProc: rollProc,
  };
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});

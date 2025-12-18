/**
 * @fileoverview Status effect type definitions and configurations
 * @module Data/StatusEffectConfig
 */
(function (Data) {
  'use strict';

  // ============================================
  // Status Effect Type Constants
  // ============================================
  var StatusEffectType = {
    // DoT Effects
    BURN: 'burn',           // Fire damage over time
    POISON: 'poison',       // Stacking damage over time
    BLEED: 'bleed',         // Damage when moving

    // Movement Effects
    FREEZE: 'freeze',       // Complete movement stop
    SLOW: 'slow',           // Movement reduction
    STUN: 'stun',           // Brief complete stop

    // Damage Modifier Effects
    WEAKNESS: 'weakness',   // Increased damage taken
    MARK: 'mark',           // Stacking damage bonus

    // Special Effects
    PULL: 'pull',           // Gravitational attraction toward source
  };

  // ============================================
  // Default Effect Configurations
  // ============================================
  var StatusEffectDefaults = {
    [StatusEffectType.BURN]: {
      duration: 3,
      tickRate: 0.5,        // Ticks per second
      damagePerTick: 5,
      stackable: false,
      maxStacks: 1,
    },
    [StatusEffectType.POISON]: {
      duration: 5,
      tickRate: 1,
      damagePerTick: 2,
      stackable: true,
      maxStacks: 10,
    },
    [StatusEffectType.BLEED]: {
      duration: 4,
      tickRate: 0.5,
      damagePerTick: 3,
      stackable: true,
      maxStacks: 5,
      requiresMovement: true,
    },
    [StatusEffectType.FREEZE]: {
      duration: 1.5,
      speedModifier: 0,     // 0 = complete stop
      stackable: false,
      maxStacks: 1,
    },
    [StatusEffectType.SLOW]: {
      duration: 2,
      speedModifier: 0.7,   // 30% slower
      stackable: false,
      maxStacks: 1,
    },
    [StatusEffectType.STUN]: {
      duration: 0.8,
      speedModifier: 0,     // Complete stop
      stackable: false,
      maxStacks: 1,
    },
    [StatusEffectType.WEAKNESS]: {
      duration: 4,
      damageMultiplier: 1.25, // +25% damage taken
      stackable: false,
      maxStacks: 1,
    },
    [StatusEffectType.MARK]: {
      duration: 6,
      damageMultiplier: 1.1,  // +10% damage taken per stack
      stackable: true,
      maxStacks: 5,
    },
    [StatusEffectType.PULL]: {
      duration: 3,
      pullForce: 50,
      stackable: false,
      maxStacks: 1,
    },
  };

  // ============================================
  // Effect Priority (for conflicting effects)
  // ============================================
  var EffectPriority = {
    [StatusEffectType.FREEZE]: 3,   // Highest - overrides slow
    [StatusEffectType.STUN]: 2,
    [StatusEffectType.SLOW]: 1,
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Get default config for a status effect type
   * @param {string} effectType - StatusEffectType value
   * @returns {Object} Default configuration
   */
  function getDefaultConfig(effectType) {
    return StatusEffectDefaults[effectType] || {};
  }

  /**
   * Check if effect type is a DoT effect
   * @param {string} effectType - StatusEffectType value
   * @returns {boolean}
   */
  function isDoTEffect(effectType) {
    return (
      effectType === StatusEffectType.BURN ||
      effectType === StatusEffectType.POISON ||
      effectType === StatusEffectType.BLEED
    );
  }

  /**
   * Check if effect type modifies movement speed
   * @param {string} effectType - StatusEffectType value
   * @returns {boolean}
   */
  function isMovementEffect(effectType) {
    return (
      effectType === StatusEffectType.FREEZE ||
      effectType === StatusEffectType.SLOW ||
      effectType === StatusEffectType.STUN
    );
  }

  /**
   * Check if effect type modifies damage taken
   * @param {string} effectType - StatusEffectType value
   * @returns {boolean}
   */
  function isDamageModifierEffect(effectType) {
    return (
      effectType === StatusEffectType.WEAKNESS ||
      effectType === StatusEffectType.MARK
    );
  }

  /**
   * Get effect priority for conflict resolution
   * @param {string} effectType - StatusEffectType value
   * @returns {number} Priority value (higher = takes precedence)
   */
  function getEffectPriority(effectType) {
    return EffectPriority[effectType] || 0;
  }

  // ============================================
  // Export to Namespace
  // ============================================
  Data.StatusEffectType = StatusEffectType;
  Data.StatusEffectDefaults = StatusEffectDefaults;

  Data.StatusEffectConfig = {
    Type: StatusEffectType,
    Defaults: StatusEffectDefaults,
    Priority: EffectPriority,
    getDefaultConfig: getDefaultConfig,
    isDoTEffect: isDoTEffect,
    isMovementEffect: isMovementEffect,
    isDamageModifierEffect: isDamageModifierEffect,
    getEffectPriority: getEffectPriority,
  };
})(window.VampireSurvivors.Data = window.VampireSurvivors.Data || {});

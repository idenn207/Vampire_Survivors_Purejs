/**
 * @fileoverview Dimension Rend - Void Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Void/DimensionRend
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.dimension_rend = {
    id: 'dimension_rend',
    name: 'Dimension Rend',

    // Evolution metadata
    coreId: 'void_core',
    baseWeaponId: 'void_rift',
    evolutionChain: 'void',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 32,
    cooldown: 1.45,
    areaRadius: 80,
    range: 400,
    duration: 3,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.VOID_MARK,
        chance: 0.45,
        duration: 5,
        bonusDamage: 0.25,
      },
    ],

    // T3 Special Ability: Dimensional Instability
    specialAbility: {
      name: 'Dimensional Instability',
      description: 'Enemies in rift take increasing damage over time',
      dimensionalInstability: {
        enabled: true,
        damageIncreasePerSecond: 0.15,
        maxDamageIncrease: 0.6,
      },
      // Keeps gravity pull from T2
      gravityPull: {
        enabled: true,
        pullStrength: 80,
        pullRadius: 120,
      },
    },

    // Visual properties
    color: '#4B0082',
    size: 80,
    shape: 'circle',
    lifetime: 3.0,
    icon: 'dimension_rend',
    imageId: 'weapon_dimension_rend',
    areaImageId: 'dimension_rend_area',

    // Level upgrades
    upgrades: {
      2: { damage: 40, statusEffects: [{ type: StatusEffectType.VOID_MARK, chance: 0.5, duration: 5.5, bonusDamage: 0.28 }] },
      3: { damage: 50, areaRadius: 95, specialAbility: { dimensionalInstability: { damageIncreasePerSecond: 0.2, maxDamageIncrease: 0.8 } } },
      4: { damage: 63, cooldown: 1.3, duration: 3.5 },
      5: { damage: 78, specialAbility: { gravityPull: { pullStrength: 110, pullRadius: 150 }, dimensionalInstability: { damageIncreasePerSecond: 0.25, maxDamageIncrease: 1.0 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

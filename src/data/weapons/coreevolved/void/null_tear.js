/**
 * @fileoverview Null Tear - Void Core T2 Evolution (Uncommon)
 * @module Data/Weapons/CoreEvolved/Void/NullTear
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.null_tear = {
    id: 'null_tear',
    name: 'Null Tear',

    // Evolution metadata
    coreId: 'void_core',
    baseWeaponId: 'void_rift',
    evolutionChain: 'void',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (1.3x base multiplier)
    damage: 26,
    cooldown: 1.55,
    areaRadius: 65,
    range: 370,
    duration: 2.5,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.VOID_MARK,
        chance: 0.35,
        duration: 4,
        bonusDamage: 0.2,
      },
    ],

    // T2 Special Ability: Gravity Pull
    specialAbility: {
      name: 'Gravity Pull',
      description: 'Rifts pull enemies toward center',
      gravityPull: {
        enabled: true,
        pullStrength: 60,
        pullRadius: 100,
      },
    },

    // Visual properties
    color: '#2F0D4D',
    size: 65,
    shape: 'circle',
    lifetime: 2.5,
    icon: 'null_tear',
    imageId: 'weapon_null_tear',

    // Level upgrades
    upgrades: {
      2: { damage: 33, statusEffects: [{ type: StatusEffectType.VOID_MARK, chance: 0.4, duration: 4.5, bonusDamage: 0.23 }] },
      3: { damage: 41, areaRadius: 75, specialAbility: { gravityPull: { pullStrength: 80, pullRadius: 120 } } },
      4: { damage: 51, cooldown: 1.4, duration: 3 },
      5: { damage: 64, statusEffects: [{ type: StatusEffectType.VOID_MARK, chance: 0.5, duration: 5, bonusDamage: 0.3 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

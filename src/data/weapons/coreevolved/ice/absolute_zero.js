/**
 * @fileoverview Absolute Zero - Ice Core T4 Evolution (Epic)
 * @module Data/Weapons/CoreEvolved/Ice/AbsoluteZero
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.absolute_zero = {
    id: 'absolute_zero',
    name: 'Absolute Zero',

    // Evolution metadata
    coreId: 'ice_core',
    baseWeaponId: 'frost_shard',
    evolutionChain: 'ice',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.0x base multiplier)
    damage: 31,
    cooldown: 0.65,
    projectileCount: 5,
    projectileSpeed: 480,
    range: 460,
    pierce: 3,
    spread: 40,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 1.0,
        duration: 3.5,
        slowAmount: 0.5,
      },
      {
        type: StatusEffectType.FREEZE,
        chance: 0.35,
        duration: 2.5,
      },
    ],

    // T4 Special Ability: Blizzard
    specialAbility: {
      name: 'Blizzard',
      description: 'Summons a blizzard every 20 seconds',
      blizzard: {
        enabled: true,
        interval: 20,
        radius: 250,
        damage: 50,
        duration: 4,
        slowAmount: 0.6,
        freezeChance: 0.2,
      },
      // Keeps ice prison from T3
      icePrison: {
        enabled: true,
        shatterRadius: 100,
        shatterDamage: 45,
        shatterChance: 1.0,
      },
    },

    // Visual properties
    color: '#00E5EE',
    size: 14,
    shape: 'diamond',
    lifetime: 3.5,
    icon: 'absolute_zero',
    imageId: 'weapon_absolute_zero',

    // Level upgrades
    upgrades: {
      2: { damage: 39, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 4, slowAmount: 0.55 }, { type: StatusEffectType.FREEZE, chance: 0.4, duration: 2.5 }] },
      3: { damage: 49, pierce: 4, specialAbility: { blizzard: { interval: 18, damage: 65 } } },
      4: { damage: 61, projectileCount: 6, cooldown: 0.55 },
      5: { damage: 76, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 4.5, slowAmount: 0.6 }, { type: StatusEffectType.FREEZE, chance: 0.5, duration: 3 }], specialAbility: { blizzard: { interval: 15, radius: 300, damage: 85, freezeChance: 0.35 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

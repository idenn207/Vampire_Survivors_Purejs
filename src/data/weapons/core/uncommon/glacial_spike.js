/**
 * @fileoverview Glacial Spike - Ice Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Ice/GlacialSpike
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.glacial_spike = {
    id: 'glacial_spike',
    name: 'Glacial Spike',

    // Evolution metadata
    coreId: 'ice_core',
    baseWeaponId: 'frost_shard',
    evolutionChain: 'ice',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.3x base multiplier)
    damage: 20,
    cooldown: 0.75,
    projectileCount: 3,
    projectileSpeed: 420,
    range: 400,
    pierce: 1,
    spread: 20,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 1.0,
        duration: 2.5,
        slowAmount: 0.35,
      },
      {
        type: StatusEffectType.FREEZE,
        chance: 0.15,
        duration: 1.5,
      },
    ],

    // T2 Special Ability: Frost Slow Field
    specialAbility: {
      name: 'Frost Field',
      description: 'Projectile impacts create slow fields',
      frostField: {
        enabled: true,
        radius: 50,
        duration: 2.0,
        slowAmount: 0.25,
      },
    },

    // Visual properties
    color: '#00BFFF',
    size: 10,
    shape: 'diamond',
    lifetime: 3.0,
    icon: 'glacial_spike',
    imageId: 'weapon_glacial_spike',

    // Level upgrades
    upgrades: {
      2: { damage: 25, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 3, slowAmount: 0.4 }, { type: StatusEffectType.FREEZE, chance: 0.2, duration: 1.5 }] },
      3: { damage: 31, pierce: 2, specialAbility: { frostField: { radius: 60, slowAmount: 0.3 } } },
      4: { damage: 39, projectileCount: 4, cooldown: 0.65 },
      5: { damage: 49, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 3.5, slowAmount: 0.45 }, { type: StatusEffectType.FREEZE, chance: 0.3, duration: 2 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

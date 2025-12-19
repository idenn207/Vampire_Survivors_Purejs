/**
 * @fileoverview Temporal Ray - Time Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Time/TemporalRay
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.temporal_ray = {
    id: 'temporal_ray',
    name: 'Temporal Ray',

    // Evolution metadata
    coreId: 'time_core',
    baseWeaponId: 'chrono_beam',
    evolutionChain: 'time',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 19,
    cooldown: 0.78,
    range: 420,
    laserWidth: 12,
    laserDuration: 0.4,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.45,
        duration: 2.5,
        slowAmount: 0.4,
      },
    ],

    // T2 Special Ability: Time Decay
    specialAbility: {
      name: 'Time Decay',
      description: 'Enemies hit take increasing damage over time',
      timeDecay: {
        enabled: true,
        damageIncreasePerHit: 0.1,
        maxDamageIncrease: 0.5,
        decayDuration: 5,
      },
    },

    // Visual properties
    color: '#4169E1',
    size: 12,
    shape: 'beam',
    lifetime: 0.4,
    icon: 'temporal_ray',
    imageId: 'weapon_temporal_ray',

    // Level upgrades
    upgrades: {
      2: { damage: 24, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.5, duration: 3, slowAmount: 0.45 }] },
      3: { damage: 30, laserWidth: 16, specialAbility: { timeDecay: { damageIncreasePerHit: 0.12, maxDamageIncrease: 0.6 } } },
      4: { damage: 38, cooldown: 0.68, range: 460 },
      5: { damage: 47, laserDuration: 0.5, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.6, duration: 3.5, slowAmount: 0.55 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

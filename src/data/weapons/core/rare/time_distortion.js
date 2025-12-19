/**
 * @fileoverview Time Distortion - Time Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Time/TimeDistortion
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.time_distortion = {
    id: 'time_distortion',
    name: 'Time Distortion',

    // Evolution metadata
    coreId: 'time_core',
    baseWeaponId: 'chrono_beam',
    evolutionChain: 'time',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 24,
    cooldown: 0.72,
    range: 460,
    laserWidth: 16,
    laserDuration: 0.5,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.55,
        duration: 3,
        slowAmount: 0.5,
      },
      {
        type: StatusEffectType.TIME_FREEZE,
        chance: 0.1,
        duration: 1.5,
      },
    ],

    // T3 Special Ability: Temporal Prison
    specialAbility: {
      name: 'Temporal Prison',
      description: 'Enemies hit may be frozen in time',
      temporalPrison: {
        enabled: true,
        freezeChance: 0.15,
        freezeDuration: 2,
        damageAmplification: 0.25,
      },
      // Keeps time decay from T2
      timeDecay: {
        enabled: true,
        damageIncreasePerHit: 0.12,
        maxDamageIncrease: 0.65,
        decayDuration: 6,
      },
    },

    // Visual properties
    color: '#6495ED',
    size: 16,
    shape: 'beam',
    lifetime: 0.5,
    icon: 'time_distortion',
    imageId: 'weapon_time_distortion',

    // Level upgrades
    upgrades: {
      2: { damage: 30, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.6, duration: 3.5, slowAmount: 0.55 }, { type: StatusEffectType.TIME_FREEZE, chance: 0.12, duration: 1.8 }] },
      3: { damage: 38, laserWidth: 20, specialAbility: { temporalPrison: { freezeChance: 0.2, damageAmplification: 0.35 } } },
      4: { damage: 47, cooldown: 0.65, range: 500 },
      5: { damage: 59, specialAbility: { temporalPrison: { freezeChance: 0.28, freezeDuration: 2.5, damageAmplification: 0.45 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

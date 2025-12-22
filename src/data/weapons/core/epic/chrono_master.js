/**
 * @fileoverview Chrono Master - Time Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Time/ChronoMaster
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.chrono_master = {
    id: 'chrono_master',
    name: 'Chrono Master',

    // Evolution metadata
    coreId: 'time_core',
    baseWeaponId: 'chrono_beam',
    evolutionChain: 'time',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 30,
    cooldown: 0.65,
    range: 500,
    laserWidth: 20,
    laserDuration: 0.55,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.65,
        duration: 3.5,
        slowAmount: 0.6,
      },
      {
        type: StatusEffectType.TIME_FREEZE,
        chance: 0.18,
        duration: 2,
      },
    ],

    // T4 Special Ability: Time Loop
    specialAbility: {
      name: 'Time Loop',
      description: 'Periodically rewinds cooldowns for all weapons',
      timeLoop: {
        enabled: true,
        interval: 20,
        cooldownReduction: 0.5,
        duration: 3,
      },
      // Keeps temporal prison from T3
      temporalPrison: {
        enabled: true,
        freezeChance: 0.22,
        freezeDuration: 2.5,
        damageAmplification: 0.4,
      },
      // Keeps time decay from T2
      timeDecay: {
        enabled: true,
        damageIncreasePerHit: 0.15,
        maxDamageIncrease: 0.8,
        decayDuration: 7,
      },
    },

    // Visual properties
    color: '#87CEEB',
    size: 20,
    shape: 'beam',
    lifetime: 0.55,
    icon: 'chrono_master',
    imageId: 'weapon_chrono_master',
    laserImageId: 'chrono_master_laser',

    // Level upgrades
    upgrades: {
      2: { damage: 38, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.7, duration: 4, slowAmount: 0.65 }, { type: StatusEffectType.TIME_FREEZE, chance: 0.22, duration: 2.2 }] },
      3: { damage: 47, laserWidth: 24, specialAbility: { timeLoop: { interval: 18, cooldownReduction: 0.6 } } },
      4: { damage: 59, cooldown: 0.58, range: 550 },
      5: { damage: 74, specialAbility: { timeLoop: { interval: 15, cooldownReduction: 0.75, duration: 4 }, temporalPrison: { freezeChance: 0.3, freezeDuration: 3 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

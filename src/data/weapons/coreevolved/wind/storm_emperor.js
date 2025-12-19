/**
 * @fileoverview Storm Emperor - Wind Core T4 Evolution (Epic)
 * @module Data/Weapons/CoreEvolved/Wind/StormEmperor
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.storm_emperor = {
    id: 'storm_emperor',
    name: 'Storm Emperor',

    // Evolution metadata
    coreId: 'wind_core',
    baseWeaponId: 'wind_cutter_core',
    evolutionChain: 'wind',
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
    damage: 28,
    cooldown: 0.44,
    projectileCount: 5,
    projectileSpeed: 600,
    range: 450,
    pierce: 5,
    spread: 40,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.5,
        duration: 2.5,
        slowAmount: 0.35,
      },
    ],

    // T4 Special Ability: Tornado
    specialAbility: {
      name: 'Tornado',
      description: 'Periodically summons a tornado at target location',
      tornado: {
        enabled: true,
        interval: 8,
        tornadoRadius: 100,
        tornadoDamage: 40,
        tornadoDuration: 4,
        pullStrength: 80,
      },
      // Keeps cyclone from T3
      cyclone: {
        enabled: true,
        cycloneChance: 0.3,
        cycloneRadius: 75,
        cycloneDamage: 25,
        pullStrength: 55,
        cycloneDuration: 2.5,
      },
      // Keeps wind slash from T2
      windSlash: {
        enabled: true,
        trailDamage: 8,
        trailWidth: 25,
        trailDuration: 1.5,
      },
    },

    // Visual properties
    color: '#40E0D0',
    size: 16,
    shape: 'crescent',
    lifetime: 2.5,
    icon: 'storm_emperor',
    imageId: 'weapon_storm_emperor',

    // Level upgrades
    upgrades: {
      2: { damage: 35, projectileCount: 6, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.55, duration: 2.8, slowAmount: 0.4 }] },
      3: { damage: 44, pierce: 6, specialAbility: { tornado: { tornadoDamage: 55, tornadoRadius: 120 } } },
      4: { damage: 55, cooldown: 0.38, projectileSpeed: 650 },
      5: { damage: 69, specialAbility: { tornado: { interval: 6, tornadoDamage: 75, tornadoRadius: 140, pullStrength: 120 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

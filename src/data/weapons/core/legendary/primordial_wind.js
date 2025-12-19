/**
 * @fileoverview Primordial Wind - Wind Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Wind/PrimordialWind
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.primordial_wind = {
    id: 'primordial_wind',
    name: 'Primordial Wind',

    // Evolution metadata
    coreId: 'wind_core',
    baseWeaponId: 'wind_cutter_core',
    evolutionChain: 'wind',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 35,
    cooldown: 0.4,
    projectileCount: 6,
    projectileSpeed: 650,
    range: 500,
    pierce: 7,
    spread: 50,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.6,
        duration: 3,
        slowAmount: 0.45,
      },
    ],

    // T5 Special Ability: Wind Domain
    specialAbility: {
      name: 'Wind Domain',
      description: 'Permanent wind aura that increases speed and damages enemies',
      windDomain: {
        enabled: true,
        radius: 180,
        speedBoost: 0.2,
        damagePerSecond: 12,
        pushStrength: 30,
      },
      // Enhanced tornado from T4
      tornado: {
        enabled: true,
        interval: 6,
        tornadoRadius: 130,
        tornadoDamage: 70,
        tornadoDuration: 5,
        pullStrength: 110,
      },
      // Enhanced cyclone from T3
      cyclone: {
        enabled: true,
        cycloneChance: 0.4,
        cycloneRadius: 90,
        cycloneDamage: 35,
        pullStrength: 70,
        cycloneDuration: 3,
      },
      // Enhanced wind slash from T2
      windSlash: {
        enabled: true,
        trailDamage: 12,
        trailWidth: 30,
        trailDuration: 2.0,
      },
    },

    // Visual properties
    color: '#00FFFF',
    size: 18,
    shape: 'crescent',
    lifetime: 3.0,
    icon: 'primordial_wind',
    imageId: 'weapon_primordial_wind',

    // Level upgrades
    upgrades: {
      2: { damage: 44, projectileCount: 7, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.65, duration: 3.3, slowAmount: 0.5 }] },
      3: { damage: 55, pierce: 8, specialAbility: { windDomain: { radius: 220, speedBoost: 0.25, damagePerSecond: 18 } } },
      4: { damage: 69, cooldown: 0.35, projectileSpeed: 720 },
      5: { damage: 86, specialAbility: { windDomain: { radius: 280, speedBoost: 0.35, damagePerSecond: 28, pushStrength: 50 }, tornado: { interval: 4, tornadoDamage: 110, tornadoRadius: 180 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

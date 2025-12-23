/**
 * @fileoverview Hurricane Slash - Wind Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Wind/HurricaneSlash
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.hurricane_slash = {
    id: 'hurricane_slash',
    name: 'Hurricane Slash',

    // Evolution metadata
    coreId: 'wind_core',
    baseWeaponId: 'wind_cutter_core',
    evolutionChain: 'wind',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 22,
    cooldown: 0.48,
    projectileCount: 4,
    projectileSpeed: 560,
    range: 420,
    pierce: 4,
    spread: 30,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.4,
        duration: 2,
        slowAmount: 0.25,
      },
    ],

    // T3 Special Ability: Cyclone
    specialAbility: {
      name: 'Cyclone',
      description: 'Creates mini cyclones that pull enemies',
      cyclone: {
        enabled: true,
        cycloneChance: 0.2,
        cycloneRadius: 60,
        cycloneDamage: 15,
        pullStrength: 40,
        cycloneDuration: 2,
      },
      // Keeps wind slash from T2
      windSlash: {
        enabled: true,
        trailDamage: 6,
        trailWidth: 20,
        trailDuration: 1.2,
      },
    },

    // Visual properties
    color: '#00CED1',
    visualScale: 1.2,
    size: 14,
    shape: 'crescent',
    lifetime: 2.0,
    icon: 'hurricane_slash',
    imageId: 'weapon_hurricane_slash',
    projectileImageId: 'hurricane_slash_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 28, projectileCount: 5, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.45, duration: 2.2, slowAmount: 0.3 }] },
      3: { damage: 35, pierce: 5, specialAbility: { cyclone: { cycloneChance: 0.25, cycloneDamage: 22 } } },
      4: { damage: 44, cooldown: 0.42, projectileSpeed: 600 },
      5: { damage: 55, specialAbility: { cyclone: { cycloneChance: 0.35, cycloneRadius: 80, cycloneDamage: 30, pullStrength: 60 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

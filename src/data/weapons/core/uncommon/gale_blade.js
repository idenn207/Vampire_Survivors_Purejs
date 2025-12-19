/**
 * @fileoverview Gale Blade - Wind Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Wind/GaleBlade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.gale_blade = {
    id: 'gale_blade',
    name: 'Gale Blade',

    // Evolution metadata
    coreId: 'wind_core',
    baseWeaponId: 'wind_cutter_core',
    evolutionChain: 'wind',
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

    // Stats (1.6x base multiplier)
    damage: 18,
    cooldown: 0.52,
    projectileCount: 3,
    projectileSpeed: 520,
    range: 390,
    pierce: 3,
    spread: 25,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.3,
        duration: 1.5,
        slowAmount: 0.2,
      },
    ],

    // T2 Special Ability: Wind Slash
    specialAbility: {
      name: 'Wind Slash',
      description: 'Projectiles leave cutting wind trails',
      windSlash: {
        enabled: true,
        trailDamage: 4,
        trailWidth: 15,
        trailDuration: 1.0,
      },
    },

    // Visual properties
    color: '#87CEEB',
    size: 12,
    shape: 'crescent',
    lifetime: 2.0,
    icon: 'gale_blade',
    imageId: 'weapon_gale_blade',

    // Level upgrades
    upgrades: {
      2: { damage: 23, projectileCount: 4, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.35, duration: 1.8, slowAmount: 0.25 }] },
      3: { damage: 28, pierce: 4, specialAbility: { windSlash: { trailDamage: 6, trailWidth: 20 } } },
      4: { damage: 36, cooldown: 0.45, projectileSpeed: 560 },
      5: { damage: 44, projectileCount: 5, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.45, duration: 2, slowAmount: 0.3 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

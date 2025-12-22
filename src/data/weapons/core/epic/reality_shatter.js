/**
 * @fileoverview Reality Shatter - Arcane Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Arcane/RealityShatter
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.reality_shatter = {
    id: 'reality_shatter',
    name: 'Reality Shatter',

    // Evolution metadata
    coreId: 'arcane_core',
    baseWeaponId: 'arcane_barrage',
    evolutionChain: 'arcane',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 24,
    cooldown: 0.25,
    projectileCount: 6,
    projectileSpeed: 620,
    range: 480,
    pierce: 3,
    spread: 360,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.ARCANE_MARK,
        chance: 0.45,
        duration: 6,
        bonusDamage: 0.25,
      },
    ],

    // T4 Special Ability: Reality Rift
    specialAbility: {
      name: 'Reality Rift',
      description: 'Periodically opens rifts that deal massive damage',
      realityRift: {
        enabled: true,
        interval: 8,
        riftCount: 2,
        riftRadius: 80,
        riftDamage: 70,
        pullStrength: 50,
      },
      // Keeps arcane detonation from T3
      arcaneDetonation: {
        enabled: true,
        explosionRadius: 80,
        explosionDamage: 40,
        spreadMarkChance: 0.4,
      },
      // Keeps magic missile from T2
      magicMissile: {
        enabled: true,
        homingStrength: 0.5,
        homingRange: 150,
      },
    },

    // Visual properties
    color: '#B06FFF',
    size: 10,
    shape: 'diamond',
    lifetime: 3.0,
    icon: 'reality_shatter',
    imageId: 'weapon_reality_shatter',
    projectileImageId: 'reality_shatter_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 30, projectileCount: 7, statusEffects: [{ type: StatusEffectType.ARCANE_MARK, chance: 0.5, duration: 6.5, bonusDamage: 0.28 }] },
      3: { damage: 38, pierce: 4, specialAbility: { realityRift: { riftCount: 3, riftDamage: 90 } } },
      4: { damage: 47, projectileCount: 8, cooldown: 0.22 },
      5: { damage: 59, specialAbility: { realityRift: { interval: 6, riftCount: 4, riftRadius: 100, riftDamage: 120 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

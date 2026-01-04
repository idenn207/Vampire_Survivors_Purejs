/**
 * @fileoverview Cosmic Weave - Arcane Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Arcane/CosmicWeave
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.cosmic_weave = {
    id: 'cosmic_weave',
    name: 'Cosmic Weave',

    // Evolution metadata
    coreId: 'arcane_core',
    baseWeaponId: 'arcane_barrage',
    evolutionChain: 'arcane',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 30,
    cooldown: 0.22,
    projectileCount: 8,
    projectileSpeed: 650,
    range: 520,
    pierce: 4,
    spread: 360,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.ARCANE_MARK,
        chance: 0.6,
        duration: 7,
        bonusDamage: 0.35,
      },
    ],

    // T5 Special Ability: Cosmic Field
    specialAbility: {
      name: 'Cosmic Field',
      description: 'Permanent arcane field that amplifies all damage',
      cosmicField: {
        enabled: true,
        radius: 180,
        damageAmplification: 0.2,
        arcaneMarkChance: 0.08,
        damagePerSecond: 8,
      },
      // Enhanced reality rift from T4
      realityRift: {
        enabled: true,
        interval: 6,
        riftCount: 4,
        riftRadius: 100,
        riftDamage: 110,
        pullStrength: 70,
      },
      // Enhanced arcane detonation from T3
      arcaneDetonation: {
        enabled: true,
        explosionRadius: 100,
        explosionDamage: 60,
        spreadMarkChance: 0.5,
      },
      // Enhanced magic missile from T2
      magicMissile: {
        enabled: true,
        homingStrength: 0.6,
        homingRange: 180,
      },
    },

    // Visual properties
    color: '#C084FC',
    visualScale: 1.2,
    size: 11,
    shape: 'diamond',
    lifetime: 3.0,
    icon: 'cosmic_weave',
    imageId: 'weapon_cosmic_weave',
    projectileImageId: 'cosmic_weave_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 38, projectileCount: 9, statusEffects: [{ type: StatusEffectType.ARCANE_MARK, chance: 0.65, duration: 7.5, bonusDamage: 0.4 }] },
      3: { damage: 47, pierce: 5, specialAbility: { cosmicField: { radius: 220, damageAmplification: 0.25 } } },
      4: { damage: 59, projectileCount: 10, cooldown: 0.18 },
      5: { damage: 74, specialAbility: { cosmicField: { radius: 280, damageAmplification: 0.35, damagePerSecond: 15, arcaneMarkChance: 0.15 }, realityRift: { interval: 4, riftCount: 6, riftDamage: 160 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

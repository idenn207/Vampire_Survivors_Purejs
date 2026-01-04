/**
 * @fileoverview Blizzard Lance - Ice Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Ice/BlizzardLance
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.blizzard_lance = {
    id: 'blizzard_lance',
    name: 'Blizzard Lance',

    // Evolution metadata
    coreId: 'ice_core',
    baseWeaponId: 'frost_shard',
    evolutionChain: 'ice',
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
    damage: 25,
    cooldown: 0.7,
    projectileCount: 4,
    projectileSpeed: 450,
    range: 430,
    pierce: 2,
    spread: 30,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 1.0,
        duration: 3,
        slowAmount: 0.4,
      },
      {
        type: StatusEffectType.FREEZE,
        chance: 0.25,
        duration: 2,
      },
    ],

    // T3 Special Ability: Ice Prison
    specialAbility: {
      name: 'Ice Prison',
      description: 'Frozen enemies shatter on kill, damaging nearby',
      icePrison: {
        enabled: true,
        shatterRadius: 80,
        shatterDamage: 30,
        shatterChance: 1.0,
      },
    },

    // Visual properties
    color: '#00CED1',
    visualScale: 1.2,
    size: 12,
    shape: 'diamond',
    lifetime: 3.0,
    icon: 'blizzard_lance',
    imageId: 'weapon_blizzard_lance',
    projectileImageId: 'blizzard_lance_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 31, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 3.5, slowAmount: 0.45 }, { type: StatusEffectType.FREEZE, chance: 0.3, duration: 2 }] },
      3: { damage: 39, pierce: 3, specialAbility: { icePrison: { shatterRadius: 100, shatterDamage: 40 } } },
      4: { damage: 49, projectileCount: 5, cooldown: 0.6 },
      5: { damage: 61, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 4, slowAmount: 0.5 }, { type: StatusEffectType.FREEZE, chance: 0.4, duration: 2.5 }], specialAbility: { icePrison: { shatterRadius: 120, shatterDamage: 55 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

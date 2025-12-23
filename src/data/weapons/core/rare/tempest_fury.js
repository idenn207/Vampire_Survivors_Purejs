/**
 * @fileoverview Tempest Fury - Lightning Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Lightning/TempestFury
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.tempest_fury = {
    id: 'tempest_fury',
    name: 'Tempest Fury',

    // Evolution metadata
    coreId: 'lightning_core',
    baseWeaponId: 'thunder_strike',
    evolutionChain: 'lightning',
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
    damage: 32,
    cooldown: 0.5,
    projectileCount: 2,
    projectileSpeed: 700,
    range: 550,
    pierce: 3,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SHOCK,
        chance: 0.35,
        duration: 2,
        stunDuration: 0.5,
      },
    ],

    // T3 Special Ability: Overcharge
    specialAbility: {
      name: 'Overcharge',
      description: 'Shocked enemies take bonus damage from all sources',
      overcharge: {
        enabled: true,
        bonusDamageMultiplier: 1.25,
      },
      // Keeps chain lightning from T2
      chainLightning: {
        enabled: true,
        maxChains: 3,
        chainRange: 110,
        chainDamageMultiplier: 0.7,
      },
    },

    // Visual properties
    color: '#FFEC00',
    visualScale: 1.2,
    size: 10,
    shape: 'bolt',
    lifetime: 2.0,
    icon: 'tempest_fury',
    imageId: 'weapon_tempest_fury',
    projectileImageId: 'tempest_fury_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 40, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.4, duration: 2.2, stunDuration: 0.6 }] },
      3: { damage: 50, pierce: 4, specialAbility: { overcharge: { bonusDamageMultiplier: 1.35 } } },
      4: { damage: 63, projectileCount: 3, cooldown: 0.45 },
      5: { damage: 78, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.5, duration: 2.5, stunDuration: 0.7 }], specialAbility: { chainLightning: { maxChains: 5, chainDamageMultiplier: 0.8 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

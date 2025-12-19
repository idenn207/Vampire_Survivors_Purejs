/**
 * @fileoverview Storm Bolt - Lightning Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Lightning/StormBolt
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.storm_bolt = {
    id: 'storm_bolt',
    name: 'Storm Bolt',

    // Evolution metadata
    coreId: 'lightning_core',
    baseWeaponId: 'thunder_strike',
    evolutionChain: 'lightning',
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

    // Stats (1.3x base multiplier)
    damage: 26,
    cooldown: 0.55,
    projectileCount: 1,
    projectileSpeed: 650,
    range: 520,
    pierce: 2,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SHOCK,
        chance: 0.25,
        duration: 1.5,
        stunDuration: 0.3,
      },
    ],

    // T2 Special Ability: Chain Lightning
    specialAbility: {
      name: 'Chain Lightning',
      description: 'Lightning chains to nearby enemies',
      chainLightning: {
        enabled: true,
        maxChains: 2,
        chainRange: 100,
        chainDamageMultiplier: 0.6,
      },
    },

    // Visual properties
    color: '#FFD700',
    size: 8,
    shape: 'bolt',
    lifetime: 2.0,
    icon: 'storm_bolt',
    imageId: 'weapon_storm_bolt',

    // Level upgrades
    upgrades: {
      2: { damage: 33, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.3, duration: 1.8, stunDuration: 0.4 }] },
      3: { damage: 41, pierce: 3, specialAbility: { chainLightning: { maxChains: 3, chainDamageMultiplier: 0.65 } } },
      4: { damage: 51, projectileCount: 2, cooldown: 0.5 },
      5: { damage: 64, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.4, duration: 2, stunDuration: 0.5 }], specialAbility: { chainLightning: { maxChains: 4, chainRange: 120 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

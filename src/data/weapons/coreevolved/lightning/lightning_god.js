/**
 * @fileoverview Lightning God - Lightning Core T4 Evolution (Epic)
 * @module Data/Weapons/CoreEvolved/Lightning/LightningGod
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.lightning_god = {
    id: 'lightning_god',
    name: 'Lightning God',

    // Evolution metadata
    coreId: 'lightning_core',
    baseWeaponId: 'thunder_strike',
    evolutionChain: 'lightning',
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
    damage: 40,
    cooldown: 0.45,
    projectileCount: 3,
    projectileSpeed: 750,
    range: 580,
    pierce: 4,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SHOCK,
        chance: 0.45,
        duration: 2.5,
        stunDuration: 0.7,
      },
    ],

    // T4 Special Ability: Thunder Strike
    specialAbility: {
      name: 'Thunder Strike',
      description: 'Random lightning strikes hit enemies every few seconds',
      thunderStrike: {
        enabled: true,
        interval: 3,
        strikeCount: 3,
        strikeDamage: 60,
        stunDuration: 0.5,
      },
      // Keeps overcharge from T3
      overcharge: {
        enabled: true,
        bonusDamageMultiplier: 1.35,
      },
      // Keeps chain lightning from T2
      chainLightning: {
        enabled: true,
        maxChains: 4,
        chainRange: 120,
        chainDamageMultiplier: 0.75,
      },
    },

    // Visual properties
    color: '#FFF200',
    size: 12,
    shape: 'bolt',
    lifetime: 2.5,
    icon: 'lightning_god',
    imageId: 'weapon_lightning_god',

    // Level upgrades
    upgrades: {
      2: { damage: 50, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.5, duration: 2.8, stunDuration: 0.8 }] },
      3: { damage: 63, pierce: 5, specialAbility: { thunderStrike: { strikeDamage: 80, strikeCount: 4 } } },
      4: { damage: 78, projectileCount: 4, cooldown: 0.4 },
      5: { damage: 98, statusEffects: [{ type: StatusEffectType.SHOCK, chance: 0.6, duration: 3, stunDuration: 1.0 }], specialAbility: { thunderStrike: { interval: 2.5, strikeCount: 5, strikeDamage: 100 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

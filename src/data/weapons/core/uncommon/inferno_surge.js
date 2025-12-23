/**
 * @fileoverview Inferno Surge - Fire Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Fire/InfernoSurge
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.inferno_surge = {
    id: 'inferno_surge',
    name: 'Inferno Surge',

    // Evolution metadata
    coreId: 'fire_core',
    baseWeaponId: 'inferno_bolt',
    evolutionChain: 'fire',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties (inherited from base)
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (1.6x base multiplier)
    damage: 23,
    cooldown: 0.85,
    projectileCount: 2,
    projectileSpeed: 400,
    range: 420,
    pierce: 1,
    spread: 15,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BURN,
        chance: 1.0,
        duration: 3.5,
        tickRate: 2,
        damagePerTick: 7,
      },
    ],

    // T2 Special Ability: Fire Trail
    specialAbility: {
      name: 'Fire Trail',
      description: 'Projectiles leave a burning trail',
      fireTrail: {
        enabled: true,
        width: 20,
        damage: 3,
        duration: 2.0,
        tickRate: 4,
      },
    },

    // Enhanced kill effect
    onKill: {
      chance: 0.6,
      explosion: { radius: 70, damage: 30 },
    },

    // Visual properties
    color: '#FF5500',
    visualScale: 1.2,
    size: 11,
    shape: 'circle',
    lifetime: 3.0,
    icon: 'inferno_surge',
    imageId: 'weapon_inferno_surge',
    projectileImageId: 'inferno_surge_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 28, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 3.5, tickRate: 2, damagePerTick: 9 }] },
      3: { damage: 35, pierce: 2, onKill: { chance: 0.75, explosion: { radius: 80, damage: 35 } } },
      4: { damage: 44, projectileCount: 3, cooldown: 0.75 },
      5: { damage: 55, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 12 }], onKill: { chance: 1.0, explosion: { radius: 90, damage: 45 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

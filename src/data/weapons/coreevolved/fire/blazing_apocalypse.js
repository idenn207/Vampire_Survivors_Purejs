/**
 * @fileoverview Blazing Apocalypse - Fire Core T4 Evolution (Epic)
 * @module Data/Weapons/CoreEvolved/Fire/BlazingApocalypse
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreEvolvedRegistry = Data.CoreEvolvedRegistry || {};

  Data.CoreEvolvedRegistry.blazing_apocalypse = {
    id: 'blazing_apocalypse',
    name: 'Blazing Apocalypse',

    // Evolution metadata
    coreId: 'fire_core',
    baseWeaponId: 'inferno_bolt',
    evolutionChain: 'fire',
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
    damage: 36,
    cooldown: 0.75,
    projectileCount: 4,
    projectileSpeed: 450,
    range: 480,
    pierce: 3,
    spread: 35,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BURN,
        chance: 1.0,
        duration: 4.5,
        tickRate: 2,
        damagePerTick: 14,
      },
    ],

    // T4 Special Ability: Fire Nova
    specialAbility: {
      name: 'Fire Nova',
      description: 'Releases a fire nova every 30 kills',
      fireNova: {
        enabled: true,
        killThreshold: 30,
        radius: 200,
        damage: 80,
        burnDuration: 3,
      },
    },

    // Enhanced kill effect
    onKill: {
      chance: 0.9,
      explosion: { radius: 100, damage: 50 },
    },

    // Visual properties
    color: '#FF7700',
    size: 14,
    shape: 'circle',
    lifetime: 3.5,
    icon: 'blazing_apocalypse',
    imageId: 'weapon_blazing_apocalypse',

    // Level upgrades
    upgrades: {
      2: { damage: 45, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 4.5, tickRate: 2, damagePerTick: 18 }] },
      3: { damage: 56, pierce: 4, specialAbility: { fireNova: { killThreshold: 25, damage: 100 } } },
      4: { damage: 70, projectileCount: 5, cooldown: 0.65 },
      5: { damage: 88, onKill: { chance: 1.0, explosion: { radius: 120, damage: 70 } }, specialAbility: { fireNova: { killThreshold: 20, radius: 250, damage: 120 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

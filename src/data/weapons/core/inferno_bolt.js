/**
 * @fileoverview Inferno Bolt - Fire Core starting weapon
 * @module Data/Weapons/Core/InfernoBolt
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.inferno_bolt = {
    id: 'inferno_bolt',
    name: 'Inferno Bolt',
    coreId: 'fire_core',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 18,
    cooldown: 0.9,
    projectileCount: 1,
    projectileSpeed: 380,
    range: 400,
    pierce: 0,
    spread: 0,

    statusEffects: [
      {
        type: StatusEffectType.BURN,
        chance: 1.0,
        duration: 3,
        tickRate: 2,
        damagePerTick: 5,
      },
    ],

    onKill: {
      chance: 0.5,
      explosion: { radius: 60, damage: 25 },
    },

    color: '#FF4500',
    size: 10,
    shape: 'circle',
    lifetime: 3.0,
    icon: 'inferno_bolt',
    imageId: 'weapon_inferno_bolt',

    upgrades: {
      2: { damage: 24, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 3, tickRate: 2, damagePerTick: 7 }] },
      3: { damage: 32, pierce: 1, onKill: { chance: 0.7, explosion: { radius: 70, damage: 30 } } },
      4: { damage: 42, projectileCount: 2, cooldown: 0.75 },
      5: { damage: 55, statusEffects: [{ type: StatusEffectType.BURN, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 10 }], onKill: { chance: 1.0, explosion: { radius: 80, damage: 40 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Frost Shard - Ice Core starting weapon
 * @module Data/Weapons/Core/FrostShard
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.frost_shard = {
    id: 'frost_shard',
    name: 'Frost Shard',
    coreId: 'ice_core',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 15,
    cooldown: 1.0,
    projectileCount: 1,
    projectileSpeed: 350,
    range: 420,
    pierce: 0,
    spread: 0,

    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 1.0,
        duration: 2,
        speedModifier: 0.7,
      },
      {
        type: StatusEffectType.FREEZE,
        chance: 0.1,
        duration: 1.5,
      },
    ],

    onKill: {
      chance: 1.0,
      shatter: { radius: 50, damage: 20 },
    },

    color: '#00BFFF',
    size: 9,
    shape: 'diamond',
    lifetime: 3.0,
    icon: 'frost_shard',
    imageId: 'weapon_frost_shard',

    upgrades: {
      2: { damage: 20, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 2, speedModifier: 0.65 }, { type: StatusEffectType.FREEZE, chance: 0.15, duration: 1.5 }] },
      3: { damage: 26, pierce: 1, onKill: { chance: 1.0, shatter: { radius: 60, damage: 25 } } },
      4: { damage: 34, projectileCount: 2, cooldown: 0.85 },
      5: { damage: 45, statusEffects: [{ type: StatusEffectType.SLOW, chance: 1.0, duration: 2.5, speedModifier: 0.6 }, { type: StatusEffectType.FREEZE, chance: 0.35, duration: 2 }], onKill: { chance: 1.0, shatter: { radius: 75, damage: 35 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

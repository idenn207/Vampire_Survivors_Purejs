/**
 * @fileoverview Void Rift - Void Core starting weapon
 * @module Data/Weapons/Core/VoidRift
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.void_rift = {
    id: 'void_rift',
    name: 'Void Rift',
    description: 'Dark rifts that pull enemies in and amplify damage taken',
    coreId: 'void_core',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 8,
    cooldown: 2.0,
    radius: 60,
    duration: 4.0,
    tickRate: 2,
    cloudCount: 1,
    spawnRange: 250,

    statusEffects: [
      {
        type: StatusEffectType.WEAKNESS,
        chance: 1.0,
        duration: 4,
        damageMultiplier: 1.25,
      },
      {
        type: StatusEffectType.PULL,
        chance: 1.0,
        duration: 4,
        pullForce: 50,
      },
    ],

    color: '#2F0032',
    icon: 'void_rift',
    imageId: 'weapon_void_rift',

    upgrades: {
      2: { damage: 11, statusEffects: [{ type: StatusEffectType.WEAKNESS, chance: 1.0, duration: 4, damageMultiplier: 1.3 }, { type: StatusEffectType.PULL, chance: 1.0, duration: 4, pullForce: 60 }] },
      3: { damage: 14, radius: 75, duration: 5.0 },
      4: { damage: 18, cloudCount: 2, statusEffects: [{ type: StatusEffectType.WEAKNESS, chance: 1.0, duration: 5, damageMultiplier: 1.4 }, { type: StatusEffectType.PULL, chance: 1.0, duration: 5, pullForce: 75 }] },
      5: { damage: 24, radius: 90, statusEffects: [{ type: StatusEffectType.WEAKNESS, chance: 1.0, duration: 6, damageMultiplier: 1.5 }, { type: StatusEffectType.PULL, chance: 1.0, duration: 6, pullForce: 100 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

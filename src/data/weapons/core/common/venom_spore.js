/**
 * @fileoverview Venom Spore - Nature Core starting weapon
 * @module Data/Weapons/Core/VenomSpore
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.venom_spore = {
    id: 'venom_spore',
    name: 'Venom Spore',
    description: 'Poison clouds that damage over time while regenerating the player',
    coreId: 'nature_core',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 6,
    cooldown: 1.5,
    radius: 50,
    duration: 3.0,
    tickRate: 2,
    cloudCount: 1,
    spawnRange: 200,

    statusEffects: [
      {
        type: StatusEffectType.POISON,
        chance: 1.0,
        duration: 5,
        tickRate: 1,
        damagePerTick: 2,
      },
    ],

    passivePlayerRegen: 2,

    color: '#228B22',
    icon: 'venom_spore',
    imageId: 'weapon_venom_spore',
    areaImageId: 'venom_spore_area',

    upgrades: {
      2: { damage: 8, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 5, tickRate: 1, damagePerTick: 3 }] },
      3: { damage: 10, cloudCount: 2, radius: 60 },
      4: { damage: 13, passivePlayerRegen: 3, duration: 4.0 },
      5: { damage: 18, cloudCount: 3, statusEffects: [{ type: StatusEffectType.POISON, chance: 1.0, duration: 6, tickRate: 1, damagePerTick: 5 }], passivePlayerRegen: 5 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Wind Cutter - Common fast crescent with knockback
 * @module Data/Weapons/Common/WindCutter
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.wind_cutter = {
    id: 'wind_cutter',
    name: 'Wind Cutter',
    description: 'A swift crescent blade of wind that knocks enemies back',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.MOUSE,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 14,
    cooldown: 0.5,
    projectileCount: 1,
    projectileSpeed: 600,
    range: 350,
    pierce: 2,
    spread: 0,

    color: '#CCFFFF',
    size: 12,
    shape: 'crescent',
    lifetime: 1.5,
    knockback: 50,
    icon: 'wind',
    imageId: 'weapon_wind_cutter',

    trail: {
      enabled: true,
      color: '#EEFFFF',
      length: 20,
      fade: 0.5,
    },

    particles: {
      enabled: true,
      type: 'wind_lines',
      color: '#FFFFFF',
      count: 4,
      spread: 15,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 19, pierce: 3, knockback: 65 },
      3: { damage: 25, cooldown: 0.45, projectileCount: 2 },
      4: { damage: 33, pierce: 4, knockback: 80 },
      5: { damage: 44, projectileCount: 3, pierce: 5 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

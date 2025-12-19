/**
 * @fileoverview Venom Fang - Common projectile with stacking poison
 * @module Data/Weapons/Common/VenomFang
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.venom_fang = {
    id: 'venom_fang',
    name: 'Venom Fang',
    description: 'Poison-tipped fangs that stack toxic damage on enemies',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 0.9,
    projectileCount: 1,
    projectileSpeed: 320,
    range: 280,
    pierce: 0,
    spread: 0,

    color: '#66FF44',
    size: 7,
    shape: 'fang',
    lifetime: 2.0,
    icon: 'venom',
    imageId: 'weapon_venom_fang',

    statusEffect: {
      type: 'poison',
      damage: 5,
      duration: 4.0,
      tickRate: 1,
      stackable: true,
      maxStacks: 3,
    },

    trail: {
      enabled: true,
      color: '#88FF66',
      length: 10,
      fade: 0.6,
    },

    particles: {
      enabled: true,
      type: 'droplets',
      color: '#AAFF88',
      count: 3,
      spread: 8,
      lifetime: 0.4,
    },

    upgrades: {
      2: { damage: 14, statusEffect: { damage: 7, maxStacks: 4 }, cooldown: 0.8 },
      3: { damage: 18, projectileCount: 2, statusEffect: { duration: 5.0 } },
      4: { damage: 24, statusEffect: { damage: 10, maxStacks: 5 } },
      5: { damage: 32, projectileCount: 3, pierce: 1 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

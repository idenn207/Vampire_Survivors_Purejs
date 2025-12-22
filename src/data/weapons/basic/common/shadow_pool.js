/**
 * @fileoverview Shadow Pool - Common area with brief blind effect
 * @module Data/Weapons/Common/ShadowPool
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.shadow_pool = {
    id: 'shadow_pool',
    name: 'Shadow Pool',
    description: 'A dark zone that blinds enemies, stopping their movement briefly',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 7,
    cooldown: 5.5,
    radius: 65,
    tickRate: 0.5,
    duration: 3.5,
    range: 240,

    color: '#330066',
    icon: 'shadow_pool',
    imageId: 'weapon_shadow_pool',
    areaImageId: 'shadow_pool_area',

    statusEffect: {
      type: 'stun',
      duration: 0.5,
      chance: 0.3,
    },

    areaVisual: {
      type: 'dark_pool',
      swirling: true,
      alpha: 0.7,
    },

    particles: {
      enabled: true,
      type: 'shadow_wisps',
      color: '#660099',
      count: 5,
      spread: 55,
      lifetime: 0.7,
    },

    upgrades: {
      2: { damage: 10, statusEffect: { chance: 0.35 }, radius: 75 },
      3: { damage: 13, duration: 4.0, statusEffect: { duration: 0.6 } },
      4: { damage: 17, statusEffect: { chance: 0.4 }, cooldown: 5.0 },
      5: { damage: 23, radius: 85, statusEffect: { duration: 0.8 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Poison Puddle - Common area with poison damage
 * @module Data/Weapons/Common/PoisonPuddle
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.poison_puddle = {
    id: 'poison_puddle',
    name: 'Poison Puddle',
    description: 'Creates a toxic pool that poisons enemies standing in it',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 8,
    cooldown: 4.0,
    radius: 60,
    tickRate: 0.5,
    duration: 5.0,
    range: 250,

    color: '#66FF44',
    icon: 'poison_pool',
    imageId: 'weapon_poison_puddle',
    areaImageId: 'poison_puddle_area',

    statusEffect: {
      type: 'poison',
      damage: 3,
      duration: 3.0,
      stackable: true,
      maxStacks: 3,
    },

    areaVisual: {
      type: 'bubbling_pool',
      bubbles: true,
      alpha: 0.6,
    },

    particles: {
      enabled: true,
      type: 'toxic_bubbles',
      color: '#88FF66',
      count: 5,
      spread: 50,
      lifetime: 0.8,
    },

    upgrades: {
      2: { damage: 11, radius: 70, statusEffect: { damage: 4 } },
      3: { damage: 15, duration: 6.0, cooldown: 3.5 },
      4: { damage: 20, radius: 80, statusEffect: { maxStacks: 4 } },
      5: { damage: 26, duration: 7.0, statusEffect: { damage: 6 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

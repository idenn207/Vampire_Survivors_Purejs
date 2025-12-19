/**
 * @fileoverview Ember Bolt - Common dual fire projectile with burn
 * @module Data/Weapons/Common/EmberBolt
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.ember_bolt = {
    id: 'ember_bolt',
    name: 'Ember Bolt',
    description: 'Twin fire bolts that ignite enemies with burning damage',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 0.7,
    projectileCount: 2,
    projectileSpeed: 400,
    range: 320,
    pierce: 0,
    spread: 15,

    color: '#FF6600',
    size: 7,
    shape: 'flame',
    lifetime: 2.0,
    icon: 'ember',
    imageId: 'weapon_ember_bolt',

    statusEffect: {
      type: 'burn',
      damage: 4,
      duration: 2.0,
      tickRate: 0.5,
    },

    trail: {
      enabled: true,
      color: '#FF9933',
      length: 15,
      fade: 0.7,
    },

    particles: {
      enabled: true,
      type: 'embers',
      color: '#FFAA00',
      count: 4,
      spread: 12,
      lifetime: 0.5,
    },

    glow: {
      enabled: true,
      radius: 10,
      intensity: 0.4,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 14, statusEffect: { damage: 6 }, projectileCount: 3 },
      3: { damage: 19, cooldown: 0.6, statusEffect: { duration: 2.5 } },
      4: { damage: 26, projectileCount: 4, pierce: 1 },
      5: { damage: 35, statusEffect: { damage: 10 }, spread: 25 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

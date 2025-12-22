/**
 * @fileoverview Cleaver - Common melee with execute damage on low HP enemies
 * @module Data/Weapons/Common/Cleaver
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.cleaver = {
    id: 'cleaver',
    name: 'Cleaver',
    description: 'A heavy blade that deals double damage to enemies below 20% health',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 35,
    cooldown: 1.1,
    range: 55,
    arcAngle: 90,
    swingDuration: 0.22,
    hitsPerSwing: 1,

    color: '#888888',
    icon: 'cleaver',
    imageId: 'weapon_cleaver',
    meleeImageId: 'cleaver_melee',

    // Execute mechanic
    execute: {
      enabled: true,
      threshold: 0.2,
      damageMultiplier: 2.0,
    },

    swingEffect: {
      type: 'heavy_slash',
      color: '#AAAAAA',
      alpha: 0.7,
    },

    particles: {
      enabled: true,
      type: 'metal_sparks',
      color: '#CCCCCC',
      count: 4,
      spread: 25,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 46, execute: { threshold: 0.25 } },
      3: { damage: 60, cooldown: 1.0, arcAngle: 100 },
      4: { damage: 78, execute: { damageMultiplier: 2.5 }, range: 60 },
      5: { damage: 100, execute: { threshold: 0.3 }, hitsPerSwing: 2 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Stone Throw - Common projectile with gravity arc
 * @module Data/Weapons/Common/StoneThrow
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.stone_throw = {
    id: 'stone_throw',
    name: 'Stone Throw',
    description: 'Heavy stones that arc through the air with gravitational pull',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 25,
    cooldown: 1.0,
    projectileCount: 1,
    projectileSpeed: 350,
    range: 300,
    pierce: 0,
    spread: 0,

    color: '#886644',
    size: 10,
    shape: 'rock',
    lifetime: 2.5,
    icon: 'stone',
    imageId: 'weapon_stone_throw',
    projectileImageId: 'stone_throw_projectile',

    // Gravity arc
    gravity: {
      enabled: true,
      force: 400,
      arcHeight: 80,
    },

    // Impact effect
    impact: {
      enabled: true,
      radius: 30,
      damage: 10,
      dustParticles: true,
    },

    particles: {
      enabled: true,
      type: 'dust',
      color: '#AA9977',
      count: 4,
      spread: 15,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 33, impact: { radius: 40 } },
      3: { damage: 44, projectileCount: 2, cooldown: 0.9 },
      4: { damage: 58, impact: { damage: 18 }, size: 12 },
      5: { damage: 75, projectileCount: 3, impact: { radius: 50 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

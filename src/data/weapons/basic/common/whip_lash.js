/**
 * @fileoverview Whip Lash - Common melee with long range and double hit
 * @module Data/Weapons/Common/WhipLash
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.whip_lash = {
    id: 'whip_lash',
    name: 'Whip Lash',
    description: 'A long-range whip that strikes twice - on the way out and back',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 18,
    cooldown: 0.85,
    range: 90,
    arcAngle: 45,
    swingDuration: 0.25,
    hitsPerSwing: 2,

    color: '#774422',
    icon: 'whip',
    imageId: 'weapon_whip_lash',
    meleeImageId: 'whip_lash_melee',

    swingEffect: {
      type: 'whip_crack',
      color: '#885533',
      alpha: 0.65,
      extendAnimation: true,
    },

    particles: {
      enabled: true,
      type: 'dust',
      color: '#AA8866',
      count: 3,
      spread: 30,
      lifetime: 0.25,
    },

    upgrades: {
      2: { damage: 24, range: 100, cooldown: 0.8 },
      3: { damage: 32, hitsPerSwing: 3, arcAngle: 55 },
      4: { damage: 42, range: 110, cooldown: 0.75 },
      5: { damage: 55, hitsPerSwing: 4, range: 120 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

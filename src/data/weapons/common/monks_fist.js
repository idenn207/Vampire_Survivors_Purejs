/**
 * @fileoverview Monk's Fist - Common melee with 3-hit combo
 * @module Data/Weapons/Common/MonksFist
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.monks_fist = {
    id: 'monks_fist',
    name: "Monk's Fist",
    description: 'Rapid punches in a 3-hit combo. The third hit deals 50% bonus damage',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 15,
    cooldown: 0.3,
    range: 40,
    arcAngle: 70,
    swingDuration: 0.1,
    hitsPerSwing: 1,

    color: '#FFFFFF',
    icon: 'fist',
    imageId: 'weapon_monks_fist',

    // Combo system
    combo: {
      enabled: true,
      maxHits: 3,
      resetTime: 1.5,
      thirdHitBonus: 0.5,
    },

    swingEffect: {
      type: 'punch',
      color: '#FFEECC',
      alpha: 0.7,
    },

    particles: {
      enabled: true,
      type: 'impact',
      color: '#FFFFFF',
      count: 3,
      spread: 15,
      lifetime: 0.2,
    },

    upgrades: {
      2: { damage: 20, cooldown: 0.27, thirdHitBonus: 0.6 },
      3: { damage: 26, range: 45, arcAngle: 80 },
      4: { damage: 34, cooldown: 0.24, thirdHitBonus: 0.75 },
      5: { damage: 45, range: 50, hitsPerSwing: 2 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

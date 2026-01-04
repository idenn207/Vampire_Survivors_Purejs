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
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 15,
    cooldown: 0.3,
    range: 45,

    // Thrust parameters (punch style)
    thrustStyle: 'punch',
    thrustDuration: 0.12,
    extendTime: 0.4,
    holdTime: 0,
    retractTime: 0.6,
    thrustWidth: 28,
    coneExpansion: 1.0,

    color: '#FFFFFF',
    visualScale: 1.2,
    icon: 'fist',
    imageId: 'weapon_monks_fist',
    meleeImageId: 'monks_fist_melee',

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
      3: { damage: 26, range: 50, thrustWidth: 32 },
      4: { damage: 34, cooldown: 0.24, thirdHitBonus: 0.75 },
      5: { damage: 45, range: 55, thrustWidth: 36 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

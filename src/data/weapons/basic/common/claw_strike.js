/**
 * @fileoverview Claw Strike - Common melee with rapid 3-hit and bleed
 * @module Data/Weapons/Common/ClawStrike
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.claw_strike = {
    id: 'claw_strike',
    name: 'Claw Strike',
    description: 'Rapid slashing claws that tear enemies and cause bleeding',
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 12,
    cooldown: 0.35,
    range: 50,

    // Thrust parameters (punch/claw style)
    thrustStyle: 'punch',
    thrustDuration: 0.1,
    extendTime: 0.35,
    holdTime: 0,
    retractTime: 0.65,
    thrustWidth: 35,
    coneExpansion: 1.2,

    color: '#CCCCCC',
    icon: 'claw',
    imageId: 'weapon_claw_strike',
    meleeImageId: 'claw_strike_melee',

    statusEffect: {
      type: 'bleed',
      damage: 2,
      duration: 2.5,
      tickRate: 0.5,
    },

    swingEffect: {
      type: 'claw_marks',
      color: '#DDDDDD',
      alpha: 0.65,
      tripleSlash: true,
    },

    particles: {
      enabled: true,
      type: 'slash_marks',
      color: '#EEEEEE',
      count: 3,
      spread: 20,
      lifetime: 0.25,
    },

    upgrades: {
      2: { damage: 16, statusEffect: { damage: 3 }, cooldown: 0.32 },
      3: { damage: 21, thrustWidth: 40, range: 55 },
      4: { damage: 28, statusEffect: { damage: 4, duration: 3.0 } },
      5: { damage: 37, thrustWidth: 45, cooldown: 0.28 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

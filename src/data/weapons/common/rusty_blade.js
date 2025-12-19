/**
 * @fileoverview Rusty Blade - Common melee with chance to cause tetanus bleed
 * @module Data/Weapons/Common/RustyBlade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.rusty_blade = {
    id: 'rusty_blade',
    name: 'Rusty Blade',
    description: 'A corroded blade with a chance to cause bleeding from tetanus',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 28,
    cooldown: 0.9,
    range: 55,
    arcAngle: 100,
    swingDuration: 0.18,
    hitsPerSwing: 1,

    color: '#AA6633',
    icon: 'rusty_blade',
    imageId: 'weapon_rusty_blade',

    statusEffect: {
      type: 'bleed',
      damage: 3,
      duration: 3.0,
      tickRate: 0.5,
      chance: 0.15,
    },

    swingEffect: {
      type: 'slash',
      color: '#996644',
      alpha: 0.6,
    },

    particles: {
      enabled: true,
      type: 'rust_flakes',
      color: '#884422',
      count: 3,
      spread: 20,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 37, arcAngle: 110, statusEffect: { chance: 0.2 } },
      3: { damage: 48, hitsPerSwing: 2, statusEffect: { damage: 5 } },
      4: { damage: 63, range: 65, statusEffect: { chance: 0.25 } },
      5: { damage: 82, hitsPerSwing: 3, cooldown: 0.7 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

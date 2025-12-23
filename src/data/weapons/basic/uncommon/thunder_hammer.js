/**
 * @fileoverview Thunder Hammer - Uncommon melee with stun shockwave
 * @module Data/Weapons/Uncommon/ThunderHammer
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.thunder_hammer = {
    id: 'thunder_hammer',
    name: 'Thunder Hammer',
    description: 'A mighty hammer that releases a stunning shockwave on impact',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 45,
    cooldown: 1.8,
    range: 70,
    arc: 90,
    knockback: 150,

    color: '#FFFF00',
    visualScale: 1.2,
    icon: 'thunder_hammer',
    imageId: 'weapon_thunder_hammer',
    meleeImageId: 'thunder_hammer_melee',

    shockwave: {
      enabled: true,
      radius: 80,
      damage: 15,
      stunDuration: 0.8,
    },

    statusEffect: {
      type: 'stun',
      duration: 0.5,
    },

    swingVisual: {
      type: 'hammer',
      headWidth: 40,
      headHeight: 25,
      handleLength: 50,
      headColor: '#888888',
      handleColor: '#553300',
    },

    trail: {
      enabled: true,
      type: 'electric',
      color: '#FFFF00',
      length: 35,
      width: 25,
      fade: true,
      sparks: true,
    },

    particles: {
      enabled: true,
      type: 'lightning_sparks',
      color: '#FFFF88',
      count: 10,
      spread: 50,
      lifetime: 0.3,
    },

    glow: {
      enabled: true,
      radius: 30,
      intensity: 0.7,
      color: '#FFFF00',
      pulse: true,
    },

    screenShake: {
      enabled: true,
      intensity: 5,
      duration: 0.15,
    },

    upgrades: {
      2: { damage: 59, shockwave: { radius: 100, damage: 20 } },
      3: { damage: 77, cooldown: 1.6, statusEffect: { duration: 0.7 } },
      4: { damage: 100, shockwave: { stunDuration: 1.0 }, knockback: 200 },
      5: { damage: 130, cooldown: 1.4, shockwave: { radius: 120, damage: 30 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Homing Missile - Uncommon target-tracking projectile
 * @module Data/Weapons/Uncommon/HomingMissile
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.homing_missile = {
    id: 'homing_missile',
    name: 'Homing Missile',
    description: 'Launches heat-seeking missiles that track enemies relentlessly',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 35,
    cooldown: 2.0,
    projectileCount: 1,
    projectileSpeed: 280,
    range: 500,
    pierce: 1,

    color: '#FF3300',
    icon: 'homing_missile',
    imageId: 'weapon_homing_missile',

    homing: {
      enabled: true,
      turnRate: 5.0,
      trackingRange: 300,
      lockOnDelay: 0.1,
    },

    projectileVisual: {
      type: 'missile',
      size: 14,
      shape: 'pointed',
      finColor: '#666666',
    },

    trail: {
      enabled: true,
      type: 'smoke',
      color: '#888888',
      secondaryColor: '#FF6600',
      length: 30,
      width: 8,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'exhaust',
      color: '#FF6600',
      count: 5,
      spread: 10,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.4,
      color: '#FF4400',
    },

    impactEffect: {
      type: 'explosion',
      radius: 40,
      color: '#FF6600',
      shake: true,
    },

    upgrades: {
      2: { damage: 46, homing: { turnRate: 6.0 }, projectileCount: 2 },
      3: { damage: 60, cooldown: 1.8, impactEffect: { radius: 50 } },
      4: { damage: 78, homing: { trackingRange: 400 }, projectileCount: 3 },
      5: { damage: 100, cooldown: 1.5, homing: { turnRate: 8.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

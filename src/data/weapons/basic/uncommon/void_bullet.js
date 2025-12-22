/**
 * @fileoverview Void Bullet - Uncommon projectile with gravity pull and explosion
 * @module Data/Weapons/Uncommon/VoidBullet
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.void_bullet = {
    id: 'void_bullet',
    name: 'Void Bullet',
    description: 'A dark bullet that pulls enemies inward before exploding',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 28,
    cooldown: 2.2,
    projectileCount: 1,
    projectileSpeed: 250,
    range: 350,
    pierce: 1,

    color: '#330066',
    icon: 'void_bullet',
    imageId: 'weapon_void_bullet',
    projectileImageId: 'void_bullet_projectile',

    gravity: {
      enabled: true,
      pullRadius: 80,
      pullStrength: 200,
      pullDuration: 0.5,
    },

    explosion: {
      enabled: true,
      radius: 60,
      damageMultiplier: 0.6,
      delay: 0.5,
    },

    projectileVisual: {
      type: 'void_sphere',
      size: 12,
      coreColor: '#000000',
      edgeColor: '#6600CC',
      distortion: true,
    },

    trail: {
      enabled: true,
      type: 'void',
      color: '#6600CC',
      length: 20,
      width: 10,
      fade: true,
      distortion: true,
    },

    particles: {
      enabled: true,
      type: 'void_wisps',
      color: '#9933FF',
      count: 6,
      spread: 30,
      lifetime: 0.4,
      inward: true,
    },

    glow: {
      enabled: true,
      radius: 25,
      intensity: 0.6,
      color: '#6600CC',
      pulse: true,
    },

    upgrades: {
      2: { damage: 37, gravity: { pullRadius: 100, pullStrength: 250 } },
      3: { damage: 48, cooldown: 2.0, explosion: { radius: 75 } },
      4: { damage: 63, gravity: { pullDuration: 0.7 }, projectileCount: 2 },
      5: { damage: 82, explosion: { damageMultiplier: 0.8 }, cooldown: 1.8 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

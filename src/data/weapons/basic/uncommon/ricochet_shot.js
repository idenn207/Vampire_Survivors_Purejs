/**
 * @fileoverview Ricochet Shot - Uncommon bouncing projectile
 * @module Data/Weapons/Uncommon/RicochetShot
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.ricochet_shot = {
    id: 'ricochet_shot',
    name: 'Ricochet Shot',
    description: 'A silver orb that bounces between enemies, gaining speed with each hit',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 20,
    cooldown: 1.4,
    projectileCount: 1,
    projectileSpeed: 400,
    range: 350,

    color: '#CCCCCC',
    icon: 'ricochet_shot',
    imageId: 'weapon_ricochet_shot',
    projectileImageId: 'ricochet_shot_projectile',

    ricochet: {
      enabled: true,
      bounces: 3,
      bounceRange: 150,
      damageRetention: 0.9,
      speedMultiplier: 1.1,
    },

    projectileVisual: {
      type: 'orb',
      size: 12,
      shape: 'sphere',
      metallic: true,
    },

    trail: {
      enabled: true,
      type: 'streak',
      color: '#FFFFFF',
      length: 20,
      width: 4,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'sparks',
      color: '#FFFFFF',
      count: 4,
      spread: 15,
      lifetime: 0.2,
      onBounce: true,
    },

    glow: {
      enabled: true,
      radius: 12,
      intensity: 0.5,
      color: '#FFFFFF',
    },

    upgrades: {
      2: { damage: 26, ricochet: { bounces: 4, bounceRange: 180 } },
      3: { damage: 34, cooldown: 1.2, projectileCount: 2 },
      4: { damage: 44, ricochet: { bounces: 5, damageRetention: 0.95 } },
      5: { damage: 58, ricochet: { bounces: 6, speedMultiplier: 1.2 }, cooldown: 1.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

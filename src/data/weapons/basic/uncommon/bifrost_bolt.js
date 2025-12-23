/**
 * @fileoverview Bifrost Bolt - Uncommon dual fire+ice projectile
 * @module Data/Weapons/Uncommon/BifrostBolt
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.bifrost_bolt = {
    id: 'bifrost_bolt',
    name: 'Bifrost Bolt',
    description: 'Fires twin bolts of fire and ice that apply burn and slow',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 18,
    cooldown: 1.2,
    projectileCount: 2,
    projectileSpeed: 350,
    range: 400,
    pierce: 2,
    spread: 15,

    color: '#FF6699',
    visualScale: 1.2,
    icon: 'bifrost_bolt',
    imageId: 'weapon_bifrost_bolt',
    projectileImageId: 'bifrost_bolt_projectile',

    dualElement: {
      fire: {
        color: '#FF4400',
        statusEffect: {
          type: 'burn',
          damage: 4,
          duration: 2.0,
          tickRate: 0.5,
        },
      },
      ice: {
        color: '#44DDFF',
        statusEffect: {
          type: 'slow',
          speedModifier: 0.6,
          duration: 1.5,
        },
      },
    },

    projectileVisual: {
      type: 'dual_orb',
      size: 10,
      fireTrail: {
        enabled: true,
        color: '#FF6600',
        length: 15,
      },
      iceTrail: {
        enabled: true,
        color: '#66CCFF',
        length: 15,
      },
    },

    particles: {
      enabled: true,
      type: 'elemental_sparks',
      colors: ['#FF4400', '#44DDFF'],
      count: 6,
      spread: 20,
      lifetime: 0.3,
    },

    glow: {
      enabled: true,
      radius: 18,
      intensity: 0.5,
      colors: ['#FF4400', '#44DDFF'],
      alternate: true,
    },

    upgrades: {
      2: { damage: 24, pierce: 3, dualElement: { fire: { statusEffect: { damage: 5 } } } },
      3: { damage: 32, cooldown: 1.1, projectileCount: 3 },
      4: { damage: 42, pierce: 4, dualElement: { ice: { statusEffect: { duration: 2.0 } } } },
      5: { damage: 55, cooldown: 1.0, projectileCount: 4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

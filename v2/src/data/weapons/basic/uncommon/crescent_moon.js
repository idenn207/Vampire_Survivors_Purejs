/**
 * @fileoverview Crescent Moon - Uncommon melee that launches crescent projectiles
 * @module Data/Weapons/Uncommon/CrescentMoon
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.crescent_moon = {
    id: 'crescent_moon',
    name: 'Crescent Moon',
    description: 'Each swing launches a silver crescent projectile that cuts through enemies',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 22,
    cooldown: 1.0,
    range: 80,
    arc: 110,
    knockback: 60,

    color: '#CCCCFF',
    visualScale: 1.2,
    icon: 'crescent_moon',
    imageId: 'weapon_crescent_moon',
    meleeImageId: 'crescent_moon_melee',

    projectileOnSwing: {
      enabled: true,
      damage: 18,
      speed: 400,
      range: 350,
      pierce: 3,
      size: 20,
    },

    swingVisual: {
      type: 'crescent',
      width: 10,
      length: 80,
      curveAmount: 0.5,
      bladeColor: '#DDDDFF',
    },

    projectileVisual: {
      type: 'crescent_wave',
      color: '#CCCCFF',
      size: 20,
      rotation: true,
      rotationSpeed: 360,
    },

    trail: {
      enabled: true,
      type: 'moonlight',
      color: '#CCCCFF',
      length: 25,
      width: 10,
      fade: true,
      shimmer: true,
    },

    particles: {
      enabled: true,
      type: 'stardust',
      color: '#FFFFFF',
      count: 5,
      spread: 20,
      lifetime: 0.3,
    },

    glow: {
      enabled: true,
      radius: 18,
      intensity: 0.5,
      color: '#CCCCFF',
    },

    upgrades: {
      2: { damage: 29, projectileOnSwing: { damage: 24, pierce: 4 } },
      3: { damage: 38, cooldown: 0.9, projectileOnSwing: { range: 400 } },
      4: { damage: 50, projectileOnSwing: { damage: 32, pierce: 5 } },
      5: { damage: 65, cooldown: 0.8, projectileOnSwing: { damage: 42, pierce: 6 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

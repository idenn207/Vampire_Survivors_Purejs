/**
 * @fileoverview Arcane Dart - Common fast-firing magic projectile
 * @module Data/Weapons/Common/ArcaneDart
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.arcane_dart = {
    id: 'arcane_dart',
    name: 'Arcane Dart',
    description: 'Fast-firing magic darts that seek the nearest enemy',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 12,
    cooldown: 0.6,
    projectileCount: 1,
    projectileSpeed: 450,
    range: 350,
    pierce: 0,
    spread: 0,

    color: '#9966FF',
    size: 6,
    shape: 'dart',
    lifetime: 2.0,
    icon: 'arcane_dart',
    imageId: 'weapon_arcane_dart',
    projectileImageId: 'test_projectile',
    visualScale: 1.5,

    trail: {
      enabled: true,
      color: '#9966FF',
      length: 10,
      fade: 0.6,
    },

    glow: {
      enabled: true,
      radius: 8,
      intensity: 0.4,
      color: '#9966FF',
    },

    upgrades: {
      2: { damage: 16, cooldown: 0.5, projectileCount: 2 },
      3: { damage: 22, pierce: 1, range: 400 },
      4: { damage: 30, projectileCount: 3, cooldown: 0.45 },
      5: { damage: 40, pierce: 2, projectileSpeed: 500 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Scatter Shot - Common wide spread projectile
 * @module Data/Weapons/Common/ScatterShot
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.scatter_shot = {
    id: 'scatter_shot',
    name: 'Scatter Shot',
    description: 'A wide spread of golden pellets covering a large area',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 8,
    cooldown: 1.1,
    projectileCount: 8,
    projectileSpeed: 380,
    range: 200,
    pierce: 0,
    spread: 60,

    color: '#FFCC00',
    size: 5,
    shape: 'pellet',
    lifetime: 1.5,
    icon: 'scatter',
    imageId: 'weapon_scatter_shot',
    projectileImageId: 'scatter_shot_projectile',

    trail: {
      enabled: true,
      color: '#FFE066',
      length: 8,
      fade: 0.6,
    },

    particles: {
      enabled: true,
      type: 'sparkle',
      color: '#FFDD44',
      count: 2,
      spread: 6,
      lifetime: 0.2,
    },

    upgrades: {
      2: { damage: 11, projectileCount: 10, spread: 65 },
      3: { damage: 15, cooldown: 1.0, range: 230 },
      4: { damage: 20, projectileCount: 12, pierce: 1 },
      5: { damage: 26, projectileCount: 15, spread: 75 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

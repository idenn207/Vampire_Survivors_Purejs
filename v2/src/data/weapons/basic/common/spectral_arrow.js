/**
 * @fileoverview Spectral Arrow - Common projectile that targets weakest enemy
 * @module Data/Weapons/Common/SpectralArrow
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.spectral_arrow = {
    id: 'spectral_arrow',
    name: 'Spectral Arrow',
    description: 'Ghostly arrows that seek out the weakest enemies with high pierce',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.WEAKEST,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 18,
    cooldown: 0.9,
    projectileCount: 1,
    projectileSpeed: 420,
    range: 400,
    pierce: 3,
    spread: 0,

    color: '#66FF99',
    size: 9,
    visualScale: 1.2,
    shape: 'arrow',
    lifetime: 2.5,
    icon: 'spectral',
    imageId: 'weapon_spectral_arrow',
    projectileImageId: 'spectral_arrow_projectile',

    // Ghostly appearance
    ghostly: {
      enabled: true,
      alpha: 0.7,
      phaseThrough: false,
    },

    trail: {
      enabled: true,
      color: '#88FFAA',
      length: 18,
      fade: 0.5,
      ghostEffect: true,
    },

    particles: {
      enabled: true,
      type: 'wisps',
      color: '#AAFFCC',
      count: 3,
      spread: 8,
      lifetime: 0.5,
    },

    upgrades: {
      2: { damage: 24, pierce: 4, range: 450 },
      3: { damage: 32, projectileCount: 2, cooldown: 0.8 },
      4: { damage: 42, pierce: 5, projectileSpeed: 480 },
      5: { damage: 55, projectileCount: 3, pierce: 6 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

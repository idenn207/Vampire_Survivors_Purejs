/**
 * @fileoverview Spirit Wisps - Common particle with 5 wisps at varying distances
 * @module Data/Weapons/Common/SpiritWisps
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.spirit_wisps = {
    id: 'spirit_wisps',
    name: 'Spirit Wisps',
    description: 'Ghostly wisps orbit at varying distances, creating layered protection',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 14,
    cooldown: 0.0,
    particleCount: 5,
    orbitRadius: 60, // Inner radius
    orbitSpeed: 1.2,

    color: '#66FFFF',
    size: 8,
    icon: 'wisps',
    imageId: 'weapon_spirit_wisps',
    bladeImageId: 'spirit_wisps_blade',

    // Varying orbit distances
    orbitLayers: {
      enabled: true,
      radii: [50, 70, 90],
      distribution: 'even',
    },

    trail: {
      enabled: true,
      color: '#AAFFFF',
      length: 12,
      fade: 0.5,
    },

    particles: {
      enabled: true,
      type: 'ghostly',
      color: '#CCFFFF',
      count: 2,
      spread: 8,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 10,
      intensity: 0.4,
      color: '#66FFFF',
    },

    upgrades: {
      2: { damage: 19, particleCount: 6, orbitSpeed: 1.3 },
      3: { damage: 25, particleCount: 7, size: 10 },
      4: { damage: 33, orbitSpeed: 1.5, radii: [50, 75, 100] },
      5: { damage: 44, particleCount: 9, orbitSpeed: 1.7 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

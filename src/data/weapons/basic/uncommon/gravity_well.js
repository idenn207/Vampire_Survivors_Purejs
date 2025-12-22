/**
 * @fileoverview Gravity Well - Uncommon area that pulls enemies to center
 * @module Data/Weapons/Uncommon/GravityWell
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.gravity_well = {
    id: 'gravity_well',
    name: 'Gravity Well',
    description: 'Creates a vortex that pulls enemies to its center, crushing them together',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 12,
    cooldown: 5.0,
    radius: 100,
    duration: 3.0,
    tickRate: 0.3,
    range: 300,

    color: '#9900CC',
    icon: 'gravity_well',
    imageId: 'weapon_gravity_well',
    areaImageId: 'gravity_well_area',

    pull: {
      enabled: true,
      strength: 150,
      coreRadius: 20,
      coreDamageMultiplier: 2.0,
    },

    areaVisual: {
      type: 'vortex',
      coreColor: '#000000',
      edgeColor: '#9900CC',
      spiralLines: true,
      distortion: true,
    },

    particles: {
      enabled: true,
      type: 'void_spiral',
      color: '#CC66FF',
      count: 12,
      spread: 80,
      lifetime: 0.5,
      inward: true,
    },

    glow: {
      enabled: true,
      radius: 50,
      intensity: 0.5,
      color: '#9900CC',
      pulse: true,
    },

    upgrades: {
      2: { damage: 16, pull: { strength: 180 }, radius: 110 },
      3: { damage: 21, cooldown: 4.5, pull: { coreDamageMultiplier: 2.5 } },
      4: { damage: 28, pull: { strength: 220 }, duration: 3.5 },
      5: { damage: 36, cooldown: 4.0, radius: 130 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

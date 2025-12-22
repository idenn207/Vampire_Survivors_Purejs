/**
 * @fileoverview Magnetic Mine - Uncommon mine that pulls enemies
 * @module Data/Weapons/Uncommon/MagneticMine
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.magnetic_mine = {
    id: 'magnetic_mine',
    name: 'Magnetic Mine',
    description: 'A mine that constantly pulls nearby enemies toward it before exploding',
    attackType: AttackType.MINE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 40,
    cooldown: 5.0,
    range: 300,
    triggerRadius: 35,
    explosionRadius: 70,
    duration: 15.0,

    color: '#0066FF',
    icon: 'magnetic_mine',
    imageId: 'weapon_magnetic_mine',
    mineImageId: 'magnetic_mine_mine',

    magneticPull: {
      enabled: true,
      pullRadius: 120,
      pullStrength: 80,
      continuous: true,
    },

    mineVisual: {
      type: 'magnetic',
      coreColor: '#0044CC',
      fieldColor: '#4488FF',
      magneticField: true,
      fieldPulse: true,
    },

    particles: {
      enabled: true,
      type: 'magnetic_arcs',
      color: '#66AAFF',
      count: 8,
      spread: 100,
      lifetime: 0.4,
      inward: true,
    },

    glow: {
      enabled: true,
      radius: 35,
      intensity: 0.5,
      color: '#0066FF',
      pulse: true,
      pulseRate: 2,
    },

    upgrades: {
      2: { damage: 52, magneticPull: { pullRadius: 140, pullStrength: 100 } },
      3: { damage: 68, cooldown: 4.5, explosionRadius: 80 },
      4: { damage: 88, magneticPull: { pullRadius: 160, pullStrength: 120 } },
      5: { damage: 115, cooldown: 4.0, explosionRadius: 90 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Flame Dancers - Uncommon dual orbit fire particles
 * @module Data/Weapons/Uncommon/FlameDancers
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.flame_dancers = {
    id: 'flame_dancers',
    name: 'Flame Dancers',
    description: 'Dual rings of fire orbit in opposite directions, burning all they touch',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 12,
    cooldown: 0.0,
    particleCount: 6,
    orbitSpeed: 200,
    particleSize: 10,

    color: '#FF6600',
    icon: 'flame_dancers',
    imageId: 'weapon_flame_dancers',
    bladeImageId: 'flame_dancers_blade',

    dualOrbit: {
      enabled: true,
      innerRadius: 50,
      outerRadius: 90,
      innerParticles: 3,
      outerParticles: 3,
      oppositeDirection: true,
    },

    statusEffect: {
      type: 'burn',
      damage: 4,
      duration: 2.0,
      tickRate: 0.4,
    },

    particleVisual: {
      type: 'flame',
      coreColor: '#FFCC00',
      outerColor: '#FF4400',
      flicker: true,
      flickerRate: 8,
    },

    trail: {
      enabled: true,
      type: 'fire_trail',
      colors: ['#FF6600', '#FFAA00'],
      length: 25,
      width: 8,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'embers',
      colors: ['#FF4400', '#FFAA00', '#FFCC00'],
      count: 4,
      spread: 15,
      lifetime: 0.35,
      rising: true,
    },

    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.5,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 16, dualOrbit: { innerParticles: 4, outerParticles: 4 } },
      3: { damage: 21, orbitSpeed: 240, statusEffect: { damage: 5 } },
      4: { damage: 27, dualOrbit: { innerParticles: 5, outerParticles: 5 } },
      5: { damage: 35, orbitSpeed: 280, statusEffect: { damage: 7, duration: 2.5 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

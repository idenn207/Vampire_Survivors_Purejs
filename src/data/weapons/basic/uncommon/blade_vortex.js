/**
 * @fileoverview Blade Vortex - Uncommon particle orbit that expands on kills
 * @module Data/Weapons/Uncommon/BladeVortex
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.blade_vortex = {
    id: 'blade_vortex',
    name: 'Blade Vortex',
    description: 'Spinning blades orbit you, with the orbit expanding on kills',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 16,
    cooldown: 0.0,
    particleCount: 4,
    orbitRadius: 60,
    orbitSpeed: 240,
    particleSize: 14,

    color: '#CCCCCC',
    visualScale: 1.2,
    icon: 'blade_vortex',
    imageId: 'weapon_blade_vortex',
    bladeImageId: 'blade_vortex_blade',

    orbitExpansion: {
      enabled: true,
      expansionPerKill: 3,
      maxExpansion: 40,
      decayRate: 1,
    },

    statusEffect: {
      type: 'bleed',
      damage: 3,
      duration: 1.5,
      tickRate: 0.3,
    },

    particleVisual: {
      type: 'blade',
      shape: 'curved',
      width: 8,
      length: 20,
      metallic: true,
      rotation: true,
    },

    trail: {
      enabled: true,
      type: 'slash',
      color: '#DDDDDD',
      length: 15,
      width: 4,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'metal_sparks',
      color: '#FFFFFF',
      count: 3,
      spread: 20,
      lifetime: 0.15,
    },

    glow: {
      enabled: true,
      radius: 12,
      intensity: 0.3,
      color: '#FFFFFF',
    },

    upgrades: {
      2: { damage: 21, particleCount: 5, orbitExpansion: { maxExpansion: 50 } },
      3: { damage: 27, orbitSpeed: 280, statusEffect: { damage: 4 } },
      4: { damage: 35, particleCount: 6, orbitExpansion: { expansionPerKill: 4 } },
      5: { damage: 46, orbitSpeed: 320, particleCount: 7 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

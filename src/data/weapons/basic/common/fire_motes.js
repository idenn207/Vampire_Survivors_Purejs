/**
 * @fileoverview Fire Motes - Common particle with 6 small fire particles
 * @module Data/Weapons/Common/FireMotes
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.fire_motes = {
    id: 'fire_motes',
    name: 'Fire Motes',
    description: 'Dancing flames orbit around you, burning enemies on contact',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 10,
    cooldown: 0.0,
    particleCount: 6,
    orbitRadius: 65,
    orbitSpeed: 1.5,

    color: '#FF6600',
    size: 6,
    icon: 'fire_motes',
    imageId: 'weapon_fire_motes',
    bladeImageId: 'fire_motes_blade',

    statusEffect: {
      type: 'burn',
      damage: 3,
      duration: 1.5,
      tickRate: 0.5,
    },

    trail: {
      enabled: true,
      color: '#FFAA00',
      length: 10,
      fade: 0.6,
    },

    particles: {
      enabled: true,
      type: 'embers',
      color: '#FFCC00',
      count: 2,
      spread: 6,
      lifetime: 0.3,
    },

    glow: {
      enabled: true,
      radius: 8,
      intensity: 0.5,
      color: '#FF6600',
    },

    upgrades: {
      2: { damage: 14, particleCount: 7, statusEffect: { damage: 4 } },
      3: { damage: 18, orbitSpeed: 1.7, orbitRadius: 75 },
      4: { damage: 24, particleCount: 8, statusEffect: { damage: 5 } },
      5: { damage: 32, particleCount: 10, orbitSpeed: 2.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

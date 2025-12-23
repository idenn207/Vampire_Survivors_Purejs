/**
 * @fileoverview Soul Orbit - Uncommon particle that gains orbs on kill
 * @module Data/Weapons/Uncommon/SoulOrbit
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.soul_orbit = {
    id: 'soul_orbit',
    name: 'Soul Orbit',
    description: 'Ethereal souls orbit you, gaining +1 soul per kill (max +4 bonus)',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 14,
    cooldown: 0.0,
    particleCount: 3,
    orbitRadius: 70,
    orbitSpeed: 180,
    particleSize: 12,

    color: '#00FFCC',
    visualScale: 1.2,
    icon: 'soul_orbit',
    imageId: 'weapon_soul_orbit',
    bladeImageId: 'soul_orbit_blade',

    soulGain: {
      enabled: true,
      maxBonusSouls: 4,
      killsPerSoul: 10,
      temporaryDuration: 0,
    },

    particleVisual: {
      type: 'soul',
      coreColor: '#FFFFFF',
      outerColor: '#00FFCC',
      ghostly: true,
      faceTrail: true,
    },

    trail: {
      enabled: true,
      type: 'ethereal',
      color: '#66FFDD',
      length: 20,
      width: 8,
      fade: true,
    },

    particles: {
      enabled: true,
      type: 'soul_wisps',
      color: '#88FFEE',
      count: 3,
      spread: 15,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 15,
      intensity: 0.5,
      color: '#00FFCC',
    },

    upgrades: {
      2: { damage: 18, particleCount: 4, soulGain: { killsPerSoul: 8 } },
      3: { damage: 24, orbitRadius: 80, orbitSpeed: 200 },
      4: { damage: 31, particleCount: 5, soulGain: { maxBonusSouls: 5 } },
      5: { damage: 40, soulGain: { killsPerSoul: 6, maxBonusSouls: 6 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

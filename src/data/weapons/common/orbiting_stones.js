/**
 * @fileoverview Orbiting Stones - Common particle with 3 large orbiting rocks
 * @module Data/Weapons/Common/OrbitingStones
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.orbiting_stones = {
    id: 'orbiting_stones',
    name: 'Orbiting Stones',
    description: 'Three heavy stones orbit around you, crushing nearby enemies',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.ROTATING,
    isAuto: true,
    rarity: Rarity.COMMON,

    tier: 1,
    isExclusive: false,
    maxTier: 4,

    damage: 22,
    cooldown: 0.0,
    particleCount: 3,
    orbitRadius: 70,
    orbitSpeed: 1.0,

    color: '#886644',
    size: 14,
    icon: 'stones',
    imageId: 'weapon_orbiting_stones',

    particles: {
      enabled: true,
      type: 'dust',
      color: '#AA9977',
      count: 2,
      spread: 10,
      lifetime: 0.3,
    },

    upgrades: {
      2: { damage: 30, particleCount: 4, orbitRadius: 80 },
      3: { damage: 40, orbitSpeed: 1.2, size: 16 },
      4: { damage: 52, particleCount: 5, orbitRadius: 90 },
      5: { damage: 68, orbitSpeed: 1.4, particleCount: 6 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

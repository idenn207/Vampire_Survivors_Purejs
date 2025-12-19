/**
 * @fileoverview Umbral Wave - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/UmbralWave
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.umbral_wave = {
    id: 'umbral_wave',
    name: 'Umbral Wave',
    description: 'Shadow pulses that radiate outward in dark waves',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'area_damage',
    targetingMode: 'self',

    // Stats
    damage: 35,
    cooldown: 2.0,
    range: 200,
    areaRadius: 150,
    duration: 2.0,

    // Shadow nova effect
    pulseWave: {
      enabled: true,
      pulseCount: 3,
      pulseInterval: 0.3,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'umbral_wave',
    imageId: 'weapon_umbral_wave',

    // Level upgrades
    upgrades: {
      2: { damage: 45, areaRadius: 170, pulseWave: { pulseCount: 4 } },
      3: { damage: 58, cooldown: 1.8, duration: 2.5 },
      4: { damage: 75, areaRadius: 190, pulseWave: { pulseCount: 5 } },
      5: { damage: 98, areaRadius: 220, cooldown: 1.5, pulseWave: { pulseCount: 6 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

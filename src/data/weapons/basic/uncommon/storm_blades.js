/**
 * @fileoverview Storm Blades - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/StormBlades
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.storm_blades = {
    id: 'storm_blades',
    name: 'Storm Blades',
    description: 'Orbiting blades that create a protective barrier around you',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'particle',
    targetingMode: 'orbit',

    // Stats
    damage: 20,
    cooldown: 0.1,
    particleCount: 6,
    orbitRadius: 120,
    orbitSpeed: 4.0,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'storm_blades',
    imageId: 'weapon_storm_blades',
    bladeImageId: 'storm_blades_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 26, particleCount: 7 },
      3: { damage: 33, orbitRadius: 140, orbitSpeed: 4.5 },
      4: { damage: 42, particleCount: 8, cooldown: 0.08 },
      5: { damage: 55, particleCount: 10, orbitRadius: 160 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

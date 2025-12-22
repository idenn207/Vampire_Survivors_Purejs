/**
 * @fileoverview Rock Storm - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/RockStorm
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.rock_storm = {
    id: 'rock_storm',
    name: 'Rock Storm',
    description: 'Orbiting boulders that crush enemies on contact',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'particle',
    targetingMode: 'orbit',

    // Stats
    damage: 22,
    cooldown: 0.2,
    particleCount: 6,
    orbitRadius: 100,
    orbitSpeed: 3.5,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'rock_storm',
    imageId: 'weapon_rock_storm',
    bladeImageId: 'rock_storm_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 28, particleCount: 7, orbitRadius: 110 },
      3: { damage: 36, particleCount: 8, orbitSpeed: 4.0 },
      4: { damage: 47, particleCount: 9, orbitRadius: 120, cooldown: 0.15 },
      5: { damage: 62, particleCount: 12, orbitRadius: 140, orbitSpeed: 4.5 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

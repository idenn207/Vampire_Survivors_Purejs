/**
 * @fileoverview Death Ray - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/DeathRay
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.death_ray = {
    id: 'death_ray',
    name: 'Death Ray',
    description: 'Continuous laser beam that melts through all enemies in its path',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'laser',
    targetingMode: 'nearest',

    // Stats
    damage: 15,
    cooldown: 0.05,
    range: 600,
    laserWidth: 12,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'death_ray',
    imageId: 'weapon_death_ray',

    // Level upgrades
    upgrades: {
      2: { damage: 20, laserWidth: 15 },
      3: { damage: 25, range: 700 },
      4: { damage: 32, laserWidth: 18, cooldown: 0.04 },
      5: { damage: 42, range: 800, laserWidth: 22 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

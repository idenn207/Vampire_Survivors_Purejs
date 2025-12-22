/**
 * @fileoverview Storm Scatter - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/StormScatter
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.storm_scatter = {
    id: 'storm_scatter',
    name: 'Storm Scatter',
    description: 'Rapid spread of projectiles that blanket the battlefield',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 22,
    cooldown: 0.7,
    projectileCount: 6,
    projectileSpeed: 420,
    projectileSize: 7,
    range: 350,
    spread: 60,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'storm_scatter',
    imageId: 'weapon_storm_scatter',
    projectileImageId: 'storm_scatter_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 28, projectileCount: 7, projectileSpeed: 450 },
      3: { damage: 36, projectileCount: 8, cooldown: 0.6 },
      4: { damage: 46, projectileCount: 9, spread: 70, range: 400 },
      5: { damage: 60, projectileCount: 12, projectileSpeed: 500, cooldown: 0.5 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

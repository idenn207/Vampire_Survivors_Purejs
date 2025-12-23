/**
 * @fileoverview Spread Seeker - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/SpreadSeeker
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.spread_seeker = {
    id: 'spread_seeker',
    name: 'Spread Seeker',
    description: 'Wide spray of projectiles that covers a large area',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 25,
    cooldown: 1.0,
    projectileCount: 8,
    projectileSpeed: 350,
    projectileSize: 8,
    spread: 45,
    range: 400,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    visualScale: 1.2,
    icon: 'spread_seeker',
    imageId: 'weapon_spread_seeker',
    projectileImageId: 'spread_seeker_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 32, projectileCount: 10 },
      3: { damage: 40, spread: 55, projectileSpeed: 380 },
      4: { damage: 52, projectileCount: 12, cooldown: 0.9 },
      5: { damage: 68, projectileCount: 15, spread: 65, range: 450 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

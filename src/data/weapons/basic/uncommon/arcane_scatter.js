/**
 * @fileoverview Arcane Scatter - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/ArcaneScatter
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.arcane_scatter = {
    id: 'arcane_scatter',
    name: 'Arcane Scatter',
    description: 'Piercing arcane bolts that spread in a wide fan',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 25,
    cooldown: 0.8,
    projectileCount: 5,
    projectileSpeed: 380,
    projectileSize: 8,
    range: 380,
    spread: 45,
    pierce: 2,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'arcane_scatter',
    imageId: 'weapon_arcane_scatter',
    projectileImageId: 'arcane_scatter_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 32, projectileCount: 6, pierce: 3 },
      3: { damage: 42, projectileSpeed: 420, spread: 55, cooldown: 0.7 },
      4: { damage: 55, projectileCount: 7, pierce: 4, range: 420 },
      5: { damage: 72, projectileCount: 9, projectileSpeed: 460, spread: 65 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

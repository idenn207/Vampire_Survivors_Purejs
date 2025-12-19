/**
 * @fileoverview Arcane Cannon - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/ArcaneCannon
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.arcane_cannon = {
    id: 'arcane_cannon',
    name: 'Arcane Cannon',
    description: 'Powerful arcane projectiles that blast through enemy lines',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 50,
    cooldown: 0.8,
    projectileCount: 3,
    projectileSpeed: 400,
    projectileSize: 12,
    range: 500,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'arcane_cannon',
    imageId: 'weapon_arcane_cannon',

    // Level upgrades
    upgrades: {
      2: { damage: 65, projectileCount: 4 },
      3: { damage: 80, projectileSpeed: 450, range: 550 },
      4: { damage: 100, projectileCount: 5, cooldown: 0.7 },
      5: { damage: 130, projectileCount: 6, range: 600 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

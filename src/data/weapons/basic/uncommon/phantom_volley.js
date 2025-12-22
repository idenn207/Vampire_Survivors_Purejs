/**
 * @fileoverview Phantom Volley - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/PhantomVolley
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.phantom_volley = {
    id: 'phantom_volley',
    name: 'Phantom Volley',
    description: 'Ghostly arrows that pierce through multiple enemies',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'weakest',

    // Stats
    damage: 28,
    cooldown: 0.8,
    projectileCount: 4,
    projectileSpeed: 400,
    projectileSize: 8,
    range: 450,
    pierce: 5,

    // Ghostly effect
    ghostly: {
      enabled: true,
      alpha: 0.7,
      phaseThrough: false,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'phantom_volley',
    imageId: 'weapon_phantom_volley',
    projectileImageId: 'phantom_volley_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 36, projectileCount: 5, pierce: 6 },
      3: { damage: 46, projectileSpeed: 450, cooldown: 0.7 },
      4: { damage: 58, projectileCount: 6, pierce: 7 },
      5: { damage: 75, projectileCount: 8, pierce: 8, range: 500 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

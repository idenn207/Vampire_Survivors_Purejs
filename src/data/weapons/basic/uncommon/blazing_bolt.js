/**
 * @fileoverview Blazing Bolt - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/BlazingBolt
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.blazing_bolt = {
    id: 'blazing_bolt',
    name: 'Blazing Bolt',
    description: 'Fiery projectiles that explode on impact for area damage',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 40,
    cooldown: 0.9,
    projectileCount: 2,
    projectileSpeed: 380,
    projectileSize: 10,
    range: 450,

    // Explosion on hit
    explosion: {
      enabled: true,
      radius: 60,
      damage: 20,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'blazing_bolt',
    imageId: 'weapon_blazing_bolt',
    projectileImageId: 'blazing_bolt_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 52, explosion: { damage: 26 } },
      3: { damage: 65, projectileCount: 3, explosion: { radius: 75 } },
      4: { damage: 82, explosion: { damage: 35 }, cooldown: 0.8 },
      5: { damage: 105, projectileCount: 4, explosion: { radius: 90, damage: 45 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

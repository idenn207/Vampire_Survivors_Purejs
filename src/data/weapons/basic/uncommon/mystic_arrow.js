/**
 * @fileoverview Mystic Arrow - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/MysticArrow
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.mystic_arrow = {
    id: 'mystic_arrow',
    name: 'Mystic Arrow',
    description: 'Enchanted arrows that home in on their targets',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 32,
    cooldown: 0.9,
    projectileCount: 2,
    projectileSpeed: 450,
    projectileSize: 9,
    range: 500,
    pierce: 2,

    // Homing effect
    homing: {
      enabled: true,
      turnRate: 3.0,
      seekRange: 150,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'mystic_arrow',
    imageId: 'weapon_mystic_arrow',
    projectileImageId: 'mystic_arrow_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 42, projectileCount: 3, homing: { turnRate: 3.5 } },
      3: { damage: 54, pierce: 3, projectileSpeed: 500 },
      4: { damage: 70, projectileCount: 4, homing: { turnRate: 4.0, seekRange: 180 } },
      5: { damage: 90, projectileCount: 5, pierce: 4, cooldown: 0.8 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

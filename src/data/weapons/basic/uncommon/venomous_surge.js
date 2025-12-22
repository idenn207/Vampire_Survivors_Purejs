/**
 * @fileoverview Venomous Surge - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/VenomousSurge
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.venomous_surge = {
    id: 'venomous_surge',
    name: 'Venomous Surge',
    description: 'Poison pools that spread deadly toxins to nearby enemies',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'area_damage',
    targetingMode: 'random',

    // Stats
    damage: 20,
    cooldown: 1.5,
    range: 250,
    areaRadius: 120,
    duration: 4.0,
    tickRate: 0.3,

    // Poison effect
    statusEffect: {
      type: 'poison',
      damage: 5,
      duration: 3.0,
      tickRate: 0.5,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'venomous_surge',
    imageId: 'weapon_venomous_surge',
    areaImageId: 'venomous_surge_area',

    // Level upgrades
    upgrades: {
      2: { damage: 26, areaRadius: 140, statusEffect: { damage: 7 } },
      3: { damage: 34, duration: 5.0, cooldown: 1.3 },
      4: { damage: 44, areaRadius: 160, statusEffect: { damage: 10, duration: 4.0 } },
      5: { damage: 58, areaRadius: 180, duration: 6.0, tickRate: 0.25 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

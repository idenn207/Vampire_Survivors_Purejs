/**
 * @fileoverview Radiant Ground - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/RadiantGround
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.radiant_ground = {
    id: 'radiant_ground',
    name: 'Radiant Ground',
    description: 'Holy ground that damages enemies and heals allies',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'area_damage',
    targetingMode: 'self',

    // Stats
    damage: 25,
    cooldown: 1.8,
    range: 200,
    areaRadius: 130,
    duration: 5.0,
    tickRate: 0.4,

    // Holy persistent field
    holyAura: {
      enabled: true,
      healPercent: 0.5,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'radiant_ground',
    imageId: 'weapon_radiant_ground',

    // Level upgrades
    upgrades: {
      2: { damage: 32, areaRadius: 150, holyAura: { healPercent: 0.7 } },
      3: { damage: 42, duration: 6.0, tickRate: 0.35 },
      4: { damage: 55, areaRadius: 170, cooldown: 1.5 },
      5: { damage: 72, duration: 7.0, areaRadius: 200, holyAura: { healPercent: 1.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

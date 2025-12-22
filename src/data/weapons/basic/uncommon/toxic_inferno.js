/**
 * @fileoverview Toxic Inferno - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/ToxicInferno
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.toxic_inferno = {
    id: 'toxic_inferno',
    name: 'Toxic Inferno',
    description: 'Burning poison zones that devastate enemies over time',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'area_damage',
    targetingMode: 'random',

    // Stats
    damage: 25,
    cooldown: 2.0,
    range: 300,
    areaRadius: 150,
    duration: 5.0,
    tickRate: 0.3,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'toxic_inferno',
    imageId: 'weapon_toxic_inferno',
    areaImageId: 'toxic_inferno_area',

    // Level upgrades
    upgrades: {
      2: { damage: 32, areaRadius: 170 },
      3: { damage: 40, duration: 6.0, tickRate: 0.25 },
      4: { damage: 52, areaRadius: 190, cooldown: 1.8 },
      5: { damage: 68, areaRadius: 220, duration: 7.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

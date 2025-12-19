/**
 * @fileoverview Blade Storm - Basic Evolved Weapon T2
 * @module Data/Weapons/Evolved/Basic/BladeStorm
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.blade_storm = {
    id: 'blade_storm',
    name: 'Blade Storm',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'melee_swing',
    targetingMode: 'random',

    // Stats
    damage: 40,
    cooldown: 0.4,
    range: 120,
    arcAngle: 360,
    swingDuration: 0.2,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'blade_storm',
    imageId: 'weapon_blade_storm',

    // Level upgrades
    upgrades: {
      2: { damage: 52, range: 140 },
      3: { damage: 65, cooldown: 0.35 },
      4: { damage: 82, range: 160, swingDuration: 0.15 },
      5: { damage: 105, range: 180, cooldown: 0.3 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

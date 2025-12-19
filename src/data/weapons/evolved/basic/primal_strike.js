/**
 * @fileoverview Primal Strike - Regular Evolved Weapon T2
 * @module Data/Weapons/Evolved/Basic/PrimalStrike
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.primal_strike = {
    id: 'primal_strike',
    name: 'Primal Strike',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'melee_swing',
    targetingMode: 'nearest',

    // Stats
    damage: 35,
    cooldown: 0.5,
    range: 60,
    arcAngle: 90,
    swingDuration: 0.15,
    hitsPerSwing: 2,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'primal_strike',
    imageId: 'weapon_primal_strike',

    // Level upgrades
    upgrades: {
      2: { damage: 45, hitsPerSwing: 3, cooldown: 0.45 },
      3: { damage: 58, range: 70, arcAngle: 100 },
      4: { damage: 74, hitsPerSwing: 4, cooldown: 0.4 },
      5: { damage: 95, hitsPerSwing: 5, range: 80, swingDuration: 0.12 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

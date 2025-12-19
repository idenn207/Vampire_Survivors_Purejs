/**
 * @fileoverview Explosive Trap - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/ExplosiveTrap
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.explosive_trap = {
    id: 'explosive_trap',
    name: 'Explosive Trap',
    description: 'Deployed traps that detonate with massive explosions',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'deployable',
    targetingMode: 'random',

    // Stats
    damage: 60,
    cooldown: 3.0,
    range: 300,
    trapRadius: 80,
    triggerDelay: 0.5,

    // Explosion effect
    explosion: {
      enabled: true,
      radius: 100,
      damage: 40,
    },

    // Trap properties
    trap: {
      maxTraps: 3,
      duration: 10.0,
      triggerOnContact: true,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'explosive_trap',
    imageId: 'weapon_explosive_trap',

    // Level upgrades
    upgrades: {
      2: { damage: 78, explosion: { damage: 52, radius: 120 } },
      3: { damage: 100, trap: { maxTraps: 4 }, cooldown: 2.7 },
      4: { damage: 130, explosion: { damage: 70, radius: 140 } },
      5: { damage: 168, trap: { maxTraps: 5 }, explosion: { damage: 90, radius: 160 }, cooldown: 2.4 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

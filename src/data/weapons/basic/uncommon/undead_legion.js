/**
 * @fileoverview Undead Legion - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/UndeadLegion
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.undead_legion = {
    id: 'undead_legion',
    name: 'Undead Legion',
    description: 'Summons an army of skeleton warriors to fight for you',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'summon',
    targetingMode: 'nearest',

    // Stats
    damage: 15,
    cooldown: 4.0,
    summonCount: 3,
    summonDuration: 10.0,
    summonHealth: 30,

    // Summon properties
    summon: {
      type: 'skeleton',
      attackSpeed: 1.0,
      moveSpeed: 80,
      maxSummons: 6,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'undead_legion',
    imageId: 'weapon_undead_legion',
    summonImageId: 'undead_legion_summon',

    // Level upgrades
    upgrades: {
      2: { damage: 20, summonCount: 4, summon: { maxSummons: 8 } },
      3: { damage: 26, summonHealth: 45, summon: { attackSpeed: 0.8 } },
      4: { damage: 34, summonCount: 5, summonDuration: 12.0, cooldown: 3.5 },
      5: { damage: 45, summonCount: 6, summon: { maxSummons: 12, moveSpeed: 100 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

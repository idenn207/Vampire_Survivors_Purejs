/**
 * @fileoverview Blood Cleaver - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/BloodCleaver
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.blood_cleaver = {
    id: 'blood_cleaver',
    name: 'Blood Cleaver',
    description: 'Heavy cleaving strikes that cause enemies to bleed',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'melee_swing',
    targetingMode: 'nearest',

    // Stats
    damage: 45,
    cooldown: 0.7,
    range: 70,
    arcAngle: 120,
    swingDuration: 0.2,
    hitsPerSwing: 1,

    // Status effect
    statusEffect: {
      type: 'bleed',
      damage: 8,
      duration: 4.0,
      tickRate: 0.5,
      chance: 0.4,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'blood_cleaver',
    imageId: 'weapon_blood_cleaver',

    // Level upgrades
    upgrades: {
      2: { damage: 58, statusEffect: { damage: 10 } },
      3: { damage: 72, range: 80, statusEffect: { chance: 0.5 } },
      4: { damage: 90, hitsPerSwing: 2, cooldown: 0.6 },
      5: { damage: 115, statusEffect: { damage: 15, duration: 5.0 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

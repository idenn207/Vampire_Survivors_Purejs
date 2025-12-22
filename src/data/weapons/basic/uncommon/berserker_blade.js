/**
 * @fileoverview Berserker Blade - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/BerserkerBlade
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.berserker_blade = {
    id: 'berserker_blade',
    name: 'Berserker Blade',
    description: 'Massive sweeping swings with devastating wide arcs',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'melee_swing',
    targetingMode: 'nearest',

    // Stats
    damage: 55,
    cooldown: 0.9,
    range: 80,
    arcAngle: 150,
    swingDuration: 0.25,
    hitsPerSwing: 1,

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'berserker_blade',
    imageId: 'weapon_berserker_blade',
    meleeImageId: 'berserker_blade_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 72, range: 90, arcAngle: 170 },
      3: { damage: 92, cooldown: 0.8, hitsPerSwing: 2 },
      4: { damage: 118, range: 100, arcAngle: 200 },
      5: { damage: 150, arcAngle: 240, cooldown: 0.7, hitsPerSwing: 3 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

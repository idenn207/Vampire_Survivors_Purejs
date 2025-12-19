/**
 * @fileoverview Elemental Clash - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/ElementalClash
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.elemental_clash = {
    id: 'elemental_clash',
    name: 'Elemental Clash',
    description: 'Alternating fire and ice zones that burn and freeze enemies',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'area_damage',
    targetingMode: 'random',

    // Stats
    damage: 40,
    cooldown: 2.5,
    range: 300,
    areaRadius: 140,
    duration: 3.0,

    // Dual element effect
    dualElement: {
      fire: true,
      ice: true,
      alternating: true,
    },

    // Status effects
    statusEffects: {
      burn: { damage: 5, duration: 2.0, tickRate: 0.5 },
      slow: { percent: 0.3, duration: 2.0 },
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'elemental_clash',
    imageId: 'weapon_elemental_clash',

    // Level upgrades
    upgrades: {
      2: { damage: 52, areaRadius: 160, statusEffects: { burn: { damage: 7 } } },
      3: { damage: 68, duration: 4.0, cooldown: 2.2 },
      4: { damage: 88, areaRadius: 180, statusEffects: { slow: { percent: 0.4 } } },
      5: { damage: 115, areaRadius: 200, duration: 5.0, cooldown: 2.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

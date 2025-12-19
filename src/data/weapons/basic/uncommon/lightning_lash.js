/**
 * @fileoverview Lightning Lash - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/LightningLash
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.lightning_lash = {
    id: 'lightning_lash',
    name: 'Lightning Lash',
    description: 'Electric melee strikes that chain lightning to nearby foes',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'melee_swing',
    targetingMode: 'nearest',

    // Stats
    damage: 30,
    cooldown: 0.4,
    range: 100,
    arcAngle: 180,
    swingDuration: 0.18,
    hitsPerSwing: 1,

    // Chain lightning effect
    chainLightning: {
      enabled: true,
      bounces: 3,
      damageDecay: 0.7,
      chainRange: 80,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    icon: 'lightning_lash',
    imageId: 'weapon_lightning_lash',

    // Level upgrades
    upgrades: {
      2: { damage: 39, chainLightning: { bounces: 4 } },
      3: { damage: 50, range: 120, cooldown: 0.35 },
      4: { damage: 65, chainLightning: { bounces: 5, damageDecay: 0.75 } },
      5: { damage: 84, chainLightning: { bounces: 6, chainRange: 100 }, cooldown: 0.3 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

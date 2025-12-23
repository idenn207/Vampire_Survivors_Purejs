/**
 * @fileoverview Frozen Burst - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/FrozenBurst
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.frozen_burst = {
    id: 'frozen_burst',
    name: 'Frozen Burst',
    description: 'Ice projectiles that shatter into damaging fragments',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'projectile',
    targetingMode: 'nearest',

    // Stats
    damage: 35,
    cooldown: 1.0,
    projectileCount: 3,
    projectileSpeed: 350,
    projectileSize: 9,
    range: 400,
    pierce: 4,

    // Shatter effect
    shatter: {
      enabled: true,
      fragments: 4,
      fragmentDamage: 15,
      fragmentSpeed: 280,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    visualScale: 1.2,
    icon: 'frozen_burst',
    imageId: 'weapon_frozen_burst',
    projectileImageId: 'frozen_burst_projectile',

    // Level upgrades
    upgrades: {
      2: { damage: 45, shatter: { fragmentDamage: 20 } },
      3: { damage: 58, projectileCount: 4, pierce: 5 },
      4: { damage: 74, shatter: { fragments: 6, fragmentDamage: 25 }, cooldown: 0.9 },
      5: { damage: 95, projectileCount: 5, shatter: { fragments: 8, fragmentDamage: 32 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Inferno Swarm - Uncommon Evolved Weapon (Tier 2)
 * @module Data/Weapons/Evolved/Uncommon/InfernoSwarm
 */
(function (Data) {
  'use strict';

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.inferno_swarm = {
    id: 'inferno_swarm',
    name: 'Inferno Swarm',
    description: 'Fire sprites that swarm enemies and ignite them',

    // Evolution metadata
    isEvolved: true,
    isCore: false,

    // Attack properties
    attackType: 'area_damage',
    targetingMode: 'random',

    // Stats
    damage: 18,
    cooldown: 1.2,
    range: 280,
    areaRadius: 100,
    duration: 6.0,
    tickRate: 0.25,

    // Fire DOT
    statusEffect: {
      type: 'burn',
      damage: 6,
      duration: 3.0,
      tickRate: 0.5,
    },

    // Swarm effect
    swarm: {
      enabled: true,
      fireSprites: 4,
      spriteSpeed: 60,
    },

    // Tier properties
    tier: 2,
    isExclusive: false,
    maxTier: 4,

    // Visual
    visualScale: 1.2,
    icon: 'inferno_swarm',
    imageId: 'weapon_inferno_swarm',
    areaImageId: 'inferno_swarm_area',

    // Level upgrades
    upgrades: {
      2: { damage: 23, swarm: { fireSprites: 5 }, statusEffect: { damage: 8 } },
      3: { damage: 30, areaRadius: 120, duration: 7.0 },
      4: { damage: 39, swarm: { fireSprites: 6 }, cooldown: 1.0, tickRate: 0.2 },
      5: { damage: 52, swarm: { fireSprites: 8 }, areaRadius: 140, duration: 8.0 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

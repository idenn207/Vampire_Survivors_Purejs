/**
 * @fileoverview Toxic Spores - Uncommon area that spreads on kill
 * @module Data/Weapons/Uncommon/ToxicSpores
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.toxic_spores = {
    id: 'toxic_spores',
    name: 'Toxic Spores',
    description: 'A poison cloud that spawns new clouds when enemies die inside it',
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 8,
    cooldown: 4.0,
    radius: 70,
    duration: 5.0,
    tickRate: 0.4,
    range: 250,

    color: '#66AA00',
    visualScale: 1.2,
    icon: 'toxic_spores',
    imageId: 'weapon_toxic_spores',
    areaImageId: 'toxic_spores_area',

    spreadOnKill: {
      enabled: true,
      chance: 0.6,
      childDuration: 3.0,
      childRadius: 50,
      maxChildren: 3,
    },

    statusEffect: {
      type: 'poison',
      damage: 4,
      duration: 3.0,
      tickRate: 0.5,
      stacks: true,
      maxStacks: 5,
    },

    areaVisual: {
      type: 'spore_cloud',
      coreColor: '#448800',
      edgeColor: '#88CC00',
      pulsate: true,
      sporeParticles: true,
    },

    particles: {
      enabled: true,
      type: 'spores',
      color: '#88CC00',
      count: 10,
      spread: 50,
      lifetime: 0.6,
      floating: true,
    },

    glow: {
      enabled: true,
      radius: 40,
      intensity: 0.3,
      color: '#66AA00',
    },

    upgrades: {
      2: { damage: 11, spreadOnKill: { chance: 0.7 }, statusEffect: { damage: 5 } },
      3: { damage: 14, cooldown: 3.5, radius: 80 },
      4: { damage: 18, spreadOnKill: { maxChildren: 4 }, statusEffect: { maxStacks: 7 } },
      5: { damage: 24, cooldown: 3.0, spreadOnKill: { chance: 0.85 } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

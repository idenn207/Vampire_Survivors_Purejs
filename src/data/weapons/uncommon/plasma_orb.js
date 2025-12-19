/**
 * @fileoverview Plasma Orb - Uncommon projectile that grows with each pierce
 * @module Data/Weapons/Uncommon/PlasmaOrb
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.plasma_orb = {
    id: 'plasma_orb',
    name: 'Plasma Orb',
    description: 'A pulsing energy sphere that grows larger and stronger with each enemy pierced',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 16,
    cooldown: 1.5,
    projectileCount: 1,
    projectileSpeed: 300,
    range: 450,
    pierce: 5,

    color: '#FF00FF',
    icon: 'plasma_orb',
    imageId: 'weapon_plasma_orb',

    growth: {
      enabled: true,
      sizePerPierce: 1.15,
      damagePerPierce: 1.1,
      maxScale: 2.5,
    },

    projectileVisual: {
      type: 'plasma',
      size: 14,
      shape: 'sphere',
      pulseRate: 4,
      coreColor: '#FFFFFF',
      outerColor: '#FF00FF',
    },

    trail: {
      enabled: true,
      type: 'energy',
      color: '#FF66FF',
      length: 25,
      width: 8,
      fade: true,
      glow: true,
    },

    particles: {
      enabled: true,
      type: 'plasma_sparks',
      color: '#FF88FF',
      count: 5,
      spread: 20,
      lifetime: 0.25,
    },

    glow: {
      enabled: true,
      radius: 20,
      intensity: 0.6,
      color: '#FF00FF',
      pulse: true,
      pulseRate: 3,
    },

    upgrades: {
      2: { damage: 21, pierce: 6, growth: { damagePerPierce: 1.12 } },
      3: { damage: 28, cooldown: 1.3, growth: { sizePerPierce: 1.2 } },
      4: { damage: 36, pierce: 8, growth: { maxScale: 3.0 } },
      5: { damage: 47, cooldown: 1.1, projectileCount: 2 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Crystal Lance - Uncommon high-pierce crystalline projectile
 * @module Data/Weapons/Uncommon/CrystalLance
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var Rarity = Data.Rarity;

  Data.WeaponRegistry.crystal_lance = {
    id: 'crystal_lance',
    name: 'Crystal Lance',
    description: 'A crystalline spear that shatters into 8 fragments at maximum range',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,
    rarity: Rarity.UNCOMMON,

    tier: 2,
    isExclusive: false,
    maxTier: 4,

    damage: 30,
    cooldown: 1.8,
    projectileCount: 1,
    projectileSpeed: 500,
    range: 450,
    pierce: 8,

    color: '#00FFFF',
    visualScale: 1.2,
    icon: 'crystal_lance',
    imageId: 'weapon_crystal_lance',
    projectileImageId: 'crystal_lance_projectile',

    shatter: {
      enabled: true,
      fragmentCount: 8,
      fragmentDamage: 0.35,
      fragmentSpeed: 300,
      fragmentRange: 150,
      spreadAngle: 360,
      triggerAtMaxRange: true,
    },

    projectileVisual: {
      type: 'lance',
      size: 24,
      shape: 'crystal',
      facets: 6,
      transparency: 0.7,
      coreColor: '#FFFFFF',
      edgeColor: '#00CCFF',
    },

    trail: {
      enabled: true,
      type: 'crystal',
      color: '#66FFFF',
      length: 35,
      width: 6,
      fade: true,
      shimmer: true,
    },

    particles: {
      enabled: true,
      type: 'crystal_shards',
      color: '#88FFFF',
      count: 8,
      spread: 40,
      lifetime: 0.4,
    },

    glow: {
      enabled: true,
      radius: 18,
      intensity: 0.5,
      color: '#00FFFF',
    },

    upgrades: {
      2: { damage: 40, pierce: 10, shatter: { fragmentCount: 10 } },
      3: { damage: 52, cooldown: 1.6, shatter: { fragmentDamage: 0.4 } },
      4: { damage: 68, pierce: 12, shatter: { fragmentCount: 12, fragmentRange: 180 } },
      5: { damage: 88, cooldown: 1.4, projectileCount: 2 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

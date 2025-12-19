/**
 * @fileoverview Arcane Barrage - Arcane Core starting weapon
 * @module Data/Weapons/Core/ArcaneBarrage
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.arcane_barrage = {
    id: 'arcane_barrage',
    name: 'Arcane Barrage',
    coreId: 'arcane_core',
    attackType: AttackType.PROJECTILE,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 12,
    cooldown: 0.6,
    projectileCount: 3,
    projectileSpeed: 450,
    range: 400,
    pierce: 0,
    spread: 20,

    passiveCDR: 0.1,

    color: '#9932CC',
    size: 8,
    shape: 'circle',
    lifetime: 2.5,
    icon: 'arcane_barrage',
    imageId: 'weapon_arcane_barrage',

    upgrades: {
      2: { damage: 15, passiveCDR: 0.12 },
      3: { damage: 19, projectileCount: 4, pierce: 1 },
      4: { damage: 24, cooldown: 0.5, passiveCDR: 0.18 },
      5: { damage: 30, projectileCount: 6, passiveCDR: 0.25, pierce: 2 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Shadow Blade - Shadow Core starting weapon
 * @module Data/Weapons/Core/ShadowBlade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.shadow_blade = {
    id: 'shadow_blade',
    name: 'Shadow Blade',
    description: 'Swift melee strikes with high critical chance and execute damage on low-health foes',
    coreId: 'shadow_core',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 40,
    cooldown: 0.7,
    range: 60,
    arcAngle: 90,
    swingDuration: 0.12,
    hitsPerSwing: 1,

    critChance: 0.3,
    critMultiplier: 2.5,

    executeThreshold: 0.25,
    executeMultiplier: 2.0,

    color: '#4B0082',
    icon: 'shadow_blade',
    imageId: 'weapon_shadow_blade',
    meleeImageId: 'shadow_blade_melee',

    upgrades: {
      2: { damage: 52, critChance: 0.35 },
      3: { damage: 66, range: 70, executeThreshold: 0.28 },
      4: { damage: 82, hitsPerSwing: 2, cooldown: 0.6, critChance: 0.4 },
      5: { damage: 105, critChance: 0.5, critMultiplier: 2.5, executeThreshold: 0.3, executeMultiplier: 2.5 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

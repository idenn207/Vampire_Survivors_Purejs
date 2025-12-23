/**
 * @fileoverview Steel Hammer - Steel Core starting weapon (MANUAL)
 * @module Data/Weapons/Core/SteelHammer
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.steel_hammer = {
    id: 'steel_hammer',
    name: 'Steel Hammer',
    description: 'Powerful manual strikes that pierce armor and send enemies flying',
    coreId: 'steel_core',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.MOUSE,
    isAuto: false,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 55,
    cooldown: 1.1,
    range: 70,
    arcAngle: 100,
    swingDuration: 0.2,
    hitsPerSwing: 1,

    knockback: 300,
    armorPierce: 0.3,

    color: '#708090',
    visualScale: 1.2,
    icon: 'steel_hammer',
    imageId: 'weapon_steel_hammer',
    meleeImageId: 'steel_hammer_melee',

    upgrades: {
      2: { damage: 72, knockback: 380 },
      3: { damage: 92, range: 85, armorPierce: 0.45 },
      4: { damage: 118, hitsPerSwing: 2, cooldown: 0.95, knockback: 480 },
      5: { damage: 155, knockback: 600, armorPierce: 0.8, arcAngle: 120 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

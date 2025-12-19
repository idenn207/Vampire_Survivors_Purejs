/**
 * @fileoverview Holy Lance - Holy Core starting weapon
 * @module Data/Weapons/Core/HolyLance
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.holy_lance = {
    id: 'holy_lance',
    name: 'Holy Lance',
    description: 'Divine laser beam that pierces all enemies, healing you and smiting foes',
    coreId: 'holy_core',
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 40,
    cooldown: 2.0,
    duration: 0.4,
    width: 8,
    range: 600,
    pierce: 999,
    tickRate: 8,

    healOnHit: 2,

    onHit: {
      chance: 0.2,
      smite: { radius: 40, damage: 50 },
    },

    color: '#FFD700',
    icon: 'holy_lance',
    imageId: 'weapon_holy_lance',

    upgrades: {
      2: { damage: 52, healOnHit: 3 },
      3: { damage: 68, width: 10, onHit: { chance: 0.28, smite: { radius: 50, damage: 60 } } },
      4: { damage: 88, cooldown: 1.7, healOnHit: 4 },
      5: { damage: 120, healOnHit: 5, onHit: { chance: 0.4, smite: { radius: 60, damage: 80 } }, width: 14 },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

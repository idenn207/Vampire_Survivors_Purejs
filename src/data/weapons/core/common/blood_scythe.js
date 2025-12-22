/**
 * @fileoverview Blood Scythe - Blood Core starting weapon
 * @module Data/Weapons/Core/BloodScythe
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.blood_scythe = {
    id: 'blood_scythe',
    name: 'Blood Scythe',
    description: 'Sweeping scythe that drains life and causes bleeding wounds',
    coreId: 'blood_core',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 30,
    cooldown: 0.8,
    range: 70,
    arcAngle: 140,
    swingDuration: 0.15,
    hitsPerSwing: 1,

    lifesteal: 0.15,

    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 1.0,
        duration: 4,
        tickRate: 2,
        damagePerTick: 3,
      },
    ],

    color: '#8B0000',
    icon: 'blood_scythe',
    imageId: 'weapon_blood_scythe',
    meleeImageId: 'blood_scythe_melee',

    upgrades: {
      2: { damage: 40, lifesteal: 0.18 },
      3: { damage: 52, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 5 }] },
      4: { damage: 66, hitsPerSwing: 2, lifesteal: 0.22 },
      5: { damage: 85, lifesteal: 0.28, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 5, tickRate: 2, damagePerTick: 7 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

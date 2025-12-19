/**
 * @fileoverview Thunder Strike - Lightning Core starting weapon
 * @module Data/Weapons/Core/ThunderStrike
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.thunder_strike = {
    id: 'thunder_strike',
    name: 'Thunder Strike',
    coreId: 'lightning_core',
    attackType: AttackType.PARTICLE,
    targetingMode: TargetingMode.CHAIN,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 28,
    cooldown: 1.2,
    chainCount: 3,
    chainRange: 120,
    chainDamageDecay: 0.8,
    range: 400,

    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.15,
        duration: 0.8,
      },
    ],

    color: '#FFD700',
    size: 8,
    icon: 'thunder_strike',
    imageId: 'weapon_thunder_strike',

    upgrades: {
      2: { damage: 36, chainCount: 4, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.2, duration: 0.8 }] },
      3: { damage: 46, chainRange: 150, chainDamageDecay: 0.85 },
      4: { damage: 58, chainCount: 5, cooldown: 1.0, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.25, duration: 1.0 }] },
      5: { damage: 75, chainCount: 7, chainRange: 180, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.35, duration: 1.2 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

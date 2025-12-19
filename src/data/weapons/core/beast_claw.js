/**
 * @fileoverview Beast Claw - Beast Core starting weapon
 * @module Data/Weapons/Core/BeastClaw
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.CoreWeaponRegistry = Data.CoreWeaponRegistry || {};

  Data.CoreWeaponRegistry.beast_claw = {
    id: 'beast_claw',
    name: 'Beast Claw',
    coreId: 'beast_core',
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 20,
    cooldown: 0.6,
    range: 50,
    arcAngle: 85,
    swingDuration: 0.1,
    hitsPerSwing: 2,

    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.7,
        duration: 3,
        tickRate: 2,
        damagePerTick: 4,
      },
    ],

    frenzy: {
      attackSpeedPerKill: 0.05,
      maxStacks: 10,
      decayTime: 5,
    },

    color: '#FF6347',
    icon: 'beast_claw',
    imageId: 'weapon_beast_claw',

    upgrades: {
      2: { damage: 26, frenzy: { attackSpeedPerKill: 0.06, maxStacks: 10, decayTime: 5 } },
      3: { damage: 34, hitsPerSwing: 3, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.8, duration: 3, tickRate: 2, damagePerTick: 5 }] },
      4: { damage: 44, cooldown: 0.5, frenzy: { attackSpeedPerKill: 0.07, maxStacks: 12, decayTime: 6 } },
      5: { damage: 58, hitsPerSwing: 4, frenzy: { attackSpeedPerKill: 0.08, maxStacks: 15, decayTime: 7 }, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 7 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

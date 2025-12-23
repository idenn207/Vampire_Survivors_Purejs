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
    description: 'Savage claw attacks that cause bleeding and build frenzy on kills',
    coreId: 'beast_core',
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    tier: 1,
    isExclusive: false,
    maxTier: 5,

    damage: 20,
    cooldown: 0.6,
    range: 50,

    // Thrust parameters (punch/claw style)
    thrustStyle: 'punch',
    thrustDuration: 0.1,
    extendTime: 0.35,
    holdTime: 0,
    retractTime: 0.65,
    thrustWidth: 35,
    coneExpansion: 1.2,

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
    visualScale: 1.2,
    icon: 'beast_claw',
    imageId: 'weapon_beast_claw',
    meleeImageId: 'beast_claw_melee',

    upgrades: {
      2: { damage: 26, frenzy: { attackSpeedPerKill: 0.06, maxStacks: 10, decayTime: 5 } },
      3: { damage: 34, thrustWidth: 40, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.8, duration: 3, tickRate: 2, damagePerTick: 5 }] },
      4: { damage: 44, cooldown: 0.5, frenzy: { attackSpeedPerKill: 0.07, maxStacks: 12, decayTime: 6 } },
      5: { damage: 58, thrustWidth: 45, range: 55, frenzy: { attackSpeedPerKill: 0.08, maxStacks: 15, decayTime: 7 }, statusEffects: [{ type: StatusEffectType.BLEED, chance: 1.0, duration: 4, tickRate: 2, damagePerTick: 7 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

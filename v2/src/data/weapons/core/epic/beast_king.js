/**
 * @fileoverview Beast King - Beast Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Beast/BeastKing
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.beast_king = {
    id: 'beast_king',
    name: 'Beast King',

    // Evolution metadata
    coreId: 'beast_core',
    baseWeaponId: 'beast_claw',
    evolutionChain: 'beast',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_THRUST,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 32,
    cooldown: 0.3,
    range: 80,
    pierce: 999,

    // Thrust parameters (punch/claw style)
    thrustStyle: 'punch',
    thrustDuration: 0.1,
    extendTime: 0.35,
    holdTime: 0,
    retractTime: 0.65,
    thrustWidth: 46,
    coneExpansion: 1.2,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.55,
        duration: 5,
        tickRate: 3,
        damagePerTick: 9,
      },
    ],

    // T4 Special Ability: Savage Roar
    specialAbility: {
      name: 'Savage Roar',
      description: 'Periodically roars, fearing enemies and boosting damage',
      savageRoar: {
        enabled: true,
        interval: 12,
        roarRadius: 200,
        fearDuration: 2,
        damageBoost: 0.3,
        boostDuration: 5,
      },
      // Keeps pack hunt from T3
      packHunt: {
        enabled: true,
        wolfCount: 3,
        wolfDamage: 25,
        wolfDuration: 6,
        wolfSpeed: 280,
      },
      // Keeps frenzy from T2
      frenzy: {
        enabled: true,
        attackSpeedBonus: 0.15,
        duration: 5,
        maxStacks: 8,
      },
    },

    // Visual properties
    color: '#CD853F',
    visualScale: 1.2,
    size: 50,
    shape: 'claw',
    lifetime: 0.18,
    icon: 'beast_king',
    imageId: 'weapon_beast_king',
    meleeImageId: 'beast_king_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 40, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.6, duration: 5.5, tickRate: 3, damagePerTick: 11 }] },
      3: { damage: 50, thrustWidth: 50, specialAbility: { savageRoar: { roarRadius: 240, damageBoost: 0.4 } } },
      4: { damage: 63, cooldown: 0.25, range: 85 },
      5: { damage: 78, specialAbility: { savageRoar: { interval: 10, roarRadius: 280, fearDuration: 3, damageBoost: 0.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

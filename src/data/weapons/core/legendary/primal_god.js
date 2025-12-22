/**
 * @fileoverview Primal God - Beast Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Beast/PrimalGod
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.primal_god = {
    id: 'primal_god',
    name: 'Primal God',

    // Evolution metadata
    coreId: 'beast_core',
    baseWeaponId: 'beast_claw',
    evolutionChain: 'beast',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 40,
    cooldown: 0.25,
    range: 125,
    arc: 180,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.BLEED,
        chance: 0.7,
        duration: 6,
        tickRate: 3,
        damagePerTick: 12,
      },
    ],

    // T5 Special Ability: Primal Fury
    specialAbility: {
      name: 'Primal Fury',
      description: 'Permanent beastly aura with multiple attack bonuses',
      primalFury: {
        enabled: true,
        radius: 160,
        damagePerSecond: 12,
        attackSpeedBonus: 0.15,
        movementSpeedBonus: 0.1,
        bleedChance: 0.1,
      },
      // Enhanced savage roar from T4
      savageRoar: {
        enabled: true,
        interval: 10,
        roarRadius: 260,
        fearDuration: 2.5,
        damageBoost: 0.45,
        boostDuration: 6,
      },
      // Enhanced pack hunt from T3
      packHunt: {
        enabled: true,
        wolfCount: 4,
        wolfDamage: 35,
        wolfDuration: 8,
        wolfSpeed: 320,
      },
      // Enhanced frenzy from T2
      frenzy: {
        enabled: true,
        attackSpeedBonus: 0.18,
        duration: 6,
        maxStacks: 10,
      },
    },

    // Visual properties
    color: '#DAA520',
    size: 55,
    shape: 'claw',
    lifetime: 0.2,
    icon: 'primal_god',
    imageId: 'weapon_primal_god',
    meleeImageId: 'primal_god_melee',

    // Level upgrades
    upgrades: {
      2: { damage: 50, statusEffects: [{ type: StatusEffectType.BLEED, chance: 0.75, duration: 6.5, tickRate: 3, damagePerTick: 15 }] },
      3: { damage: 63, arc: 200, specialAbility: { primalFury: { radius: 200, damagePerSecond: 18, attackSpeedBonus: 0.2 } } },
      4: { damage: 78, cooldown: 0.2, range: 140 },
      5: { damage: 98, specialAbility: { primalFury: { radius: 260, damagePerSecond: 30, attackSpeedBonus: 0.3, movementSpeedBonus: 0.2, bleedChance: 0.2 }, packHunt: { wolfCount: 6, wolfDamage: 50, wolfDuration: 10 }, savageRoar: { interval: 8, damageBoost: 0.6 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

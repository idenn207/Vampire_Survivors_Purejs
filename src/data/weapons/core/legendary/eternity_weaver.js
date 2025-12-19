/**
 * @fileoverview Eternity Weaver - Time Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Time/EternityWeaver
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.eternity_weaver = {
    id: 'eternity_weaver',
    name: 'Eternity Weaver',

    // Evolution metadata
    coreId: 'time_core',
    baseWeaponId: 'chrono_beam',
    evolutionChain: 'time',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.LASER,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 38,
    cooldown: 0.6,
    range: 550,
    laserWidth: 24,
    laserDuration: 0.6,
    pierce: 999,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.SLOW,
        chance: 0.8,
        duration: 4,
        slowAmount: 0.7,
      },
      {
        type: StatusEffectType.TIME_FREEZE,
        chance: 0.25,
        duration: 2.5,
      },
    ],

    // T5 Special Ability: Time Aura
    specialAbility: {
      name: 'Time Aura',
      description: 'Permanent aura that slows enemies and speeds player',
      timeAura: {
        enabled: true,
        radius: 200,
        enemySlowAmount: 0.25,
        playerSpeedBoost: 0.15,
        cooldownReduction: 0.1,
        damagePerSecond: 10,
      },
      // Enhanced time loop from T4
      timeLoop: {
        enabled: true,
        interval: 15,
        cooldownReduction: 0.7,
        duration: 4,
      },
      // Enhanced temporal prison from T3
      temporalPrison: {
        enabled: true,
        freezeChance: 0.3,
        freezeDuration: 3,
        damageAmplification: 0.5,
      },
      // Enhanced time decay from T2
      timeDecay: {
        enabled: true,
        damageIncreasePerHit: 0.18,
        maxDamageIncrease: 1.0,
        decayDuration: 8,
      },
    },

    // Visual properties
    color: '#B0E0E6',
    size: 24,
    shape: 'beam',
    lifetime: 0.6,
    icon: 'eternity_weaver',
    imageId: 'weapon_eternity_weaver',

    // Level upgrades
    upgrades: {
      2: { damage: 47, statusEffects: [{ type: StatusEffectType.SLOW, chance: 0.85, duration: 4.5, slowAmount: 0.75 }, { type: StatusEffectType.TIME_FREEZE, chance: 0.3, duration: 2.8 }] },
      3: { damage: 59, laserWidth: 28, specialAbility: { timeAura: { radius: 250, enemySlowAmount: 0.3, cooldownReduction: 0.15 } } },
      4: { damage: 74, cooldown: 0.52, range: 600 },
      5: { damage: 92, specialAbility: { timeAura: { radius: 320, enemySlowAmount: 0.4, playerSpeedBoost: 0.25, cooldownReduction: 0.2, damagePerSecond: 20 }, timeLoop: { interval: 12, cooldownReduction: 0.9, duration: 5 }, temporalPrison: { freezeChance: 0.4, freezeDuration: 4 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

/**
 * @fileoverview Continental Drift - Earth Core T5 Evolution (Legendary)
 * @module Data/Weapons/Evolved/Earth/ContinentalDrift
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.continental_drift = {
    id: 'continental_drift',
    name: 'Continental Drift',

    // Evolution metadata
    coreId: 'earth_core',
    baseWeaponId: 'earth_spike',
    evolutionChain: 'earth',
    isEvolved: true,
    isCore: true,

    // Tier properties (Legendary)
    tier: 5,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (10.0x base multiplier)
    damage: 55,
    cooldown: 0.95,
    areaRadius: 100,
    range: 450,
    spikeCount: 6,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.55,
        duration: 1.2,
      },
      {
        type: StatusEffectType.SLOW,
        chance: 0.6,
        duration: 3,
        slowAmount: 0.5,
      },
    ],

    // T5 Special Ability: Earth Aura
    specialAbility: {
      name: 'Earth Aura',
      description: 'Permanent aura that increases armor and damages enemies',
      earthAura: {
        enabled: true,
        radius: 160,
        armorBoost: 0.25,
        damagePerSecond: 15,
        slowEnemies: 0.15,
      },
      // Enhanced tectonic shift from T4
      tectonicShift: {
        enabled: true,
        interval: 10,
        quakeRadius: 260,
        quakeDamage: 140,
        stunDuration: 2,
        knockback: 200,
      },
      // Enhanced stone barrier from T3
      stoneBarrier: {
        enabled: true,
        barrierDuration: 5,
        barrierHealth: 120,
        reflectDamage: 40,
      },
      // Enhanced aftershock from T2
      aftershock: {
        enabled: true,
        aftershockRadius: 80,
        aftershockDamage: 35,
        aftershockDelay: 0.2,
      },
    },

    // Visual properties
    color: '#DEB887',
    size: 100,
    shape: 'spike',
    lifetime: 0.8,
    icon: 'continental_drift',
    imageId: 'weapon_continental_drift',
    areaImageId: 'continental_drift_area',

    // Level upgrades
    upgrades: {
      2: { damage: 69, spikeCount: 7, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.6, duration: 1.3 }, { type: StatusEffectType.SLOW, chance: 0.65, duration: 3.3, slowAmount: 0.55 }] },
      3: { damage: 86, areaRadius: 115, specialAbility: { earthAura: { radius: 200, armorBoost: 0.3, damagePerSecond: 22 } } },
      4: { damage: 108, cooldown: 0.85, range: 500 },
      5: { damage: 135, specialAbility: { earthAura: { radius: 260, armorBoost: 0.4, damagePerSecond: 35, slowEnemies: 0.25 }, tectonicShift: { interval: 8, quakeRadius: 340, quakeDamage: 220, stunDuration: 2.5 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

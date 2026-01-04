/**
 * @fileoverview Earthquake - Earth Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Earth/Earthquake
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.earthquake = {
    id: 'earthquake',
    name: 'Earthquake',

    // Evolution metadata
    coreId: 'earth_core',
    baseWeaponId: 'earth_spike',
    evolutionChain: 'earth',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 44,
    cooldown: 1.0,
    areaRadius: 80,
    range: 400,
    spikeCount: 5,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.45,
        duration: 1.0,
      },
      {
        type: StatusEffectType.SLOW,
        chance: 0.5,
        duration: 2.5,
        slowAmount: 0.4,
      },
    ],

    // T4 Special Ability: Tectonic Shift
    specialAbility: {
      name: 'Tectonic Shift',
      description: 'Periodically creates a massive earthquake',
      tectonicShift: {
        enabled: true,
        interval: 12,
        quakeRadius: 200,
        quakeDamage: 80,
        stunDuration: 1.5,
        knockback: 150,
      },
      // Keeps stone barrier from T3
      stoneBarrier: {
        enabled: true,
        barrierDuration: 4,
        barrierHealth: 80,
        reflectDamage: 25,
      },
      // Keeps aftershock from T2
      aftershock: {
        enabled: true,
        aftershockRadius: 65,
        aftershockDamage: 25,
        aftershockDelay: 0.25,
      },
    },

    // Visual properties
    color: '#CD853F',
    visualScale: 1.2,
    size: 80,
    shape: 'spike',
    lifetime: 0.7,
    icon: 'earthquake',
    imageId: 'weapon_earthquake',
    areaImageId: 'earthquake_area',

    // Level upgrades
    upgrades: {
      2: { damage: 55, spikeCount: 6, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.5, duration: 1.1 }, { type: StatusEffectType.SLOW, chance: 0.55, duration: 2.8, slowAmount: 0.45 }] },
      3: { damage: 69, areaRadius: 95, specialAbility: { tectonicShift: { quakeRadius: 240, quakeDamage: 110 } } },
      4: { damage: 86, cooldown: 0.9, range: 450 },
      5: { damage: 108, specialAbility: { tectonicShift: { interval: 10, quakeRadius: 280, quakeDamage: 150, stunDuration: 2 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

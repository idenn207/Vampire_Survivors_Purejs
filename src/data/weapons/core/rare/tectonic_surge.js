/**
 * @fileoverview Tectonic Surge - Earth Core T3 Evolution (Rare)
 * @module Data/Weapons/Evolved/Earth/TectonicSurge
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.tectonic_surge = {
    id: 'tectonic_surge',
    name: 'Tectonic Surge',

    // Evolution metadata
    coreId: 'earth_core',
    baseWeaponId: 'earth_spike',
    evolutionChain: 'earth',
    isEvolved: true,
    isCore: true,

    // Tier properties (Rare)
    tier: 3,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (2.5x base multiplier)
    damage: 35,
    cooldown: 1.05,
    areaRadius: 65,
    range: 360,
    spikeCount: 4,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.35,
        duration: 0.8,
      },
      {
        type: StatusEffectType.SLOW,
        chance: 0.4,
        duration: 2,
        slowAmount: 0.3,
      },
    ],

    // T3 Special Ability: Stone Barrier
    specialAbility: {
      name: 'Stone Barrier',
      description: 'Creates temporary stone shields on spike locations',
      stoneBarrier: {
        enabled: true,
        barrierDuration: 3,
        barrierHealth: 50,
        reflectDamage: 10,
      },
      // Keeps aftershock from T2
      aftershock: {
        enabled: true,
        aftershockRadius: 55,
        aftershockDamage: 18,
        aftershockDelay: 0.3,
      },
    },

    // Visual properties
    color: '#A0522D',
    size: 65,
    shape: 'spike',
    lifetime: 0.6,
    icon: 'tectonic_surge',
    imageId: 'weapon_tectonic_surge',
    areaImageId: 'tectonic_surge_area',

    // Level upgrades
    upgrades: {
      2: { damage: 44, spikeCount: 5, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.4, duration: 0.9 }, { type: StatusEffectType.SLOW, chance: 0.45, duration: 2.3, slowAmount: 0.35 }] },
      3: { damage: 55, areaRadius: 75, specialAbility: { stoneBarrier: { barrierHealth: 75, reflectDamage: 18 } } },
      4: { damage: 69, cooldown: 0.95, range: 400 },
      5: { damage: 86, specialAbility: { stoneBarrier: { barrierDuration: 4, barrierHealth: 100, reflectDamage: 30 }, aftershock: { aftershockRadius: 70, aftershockDamage: 30 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

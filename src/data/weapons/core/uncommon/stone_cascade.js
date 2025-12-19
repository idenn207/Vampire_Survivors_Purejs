/**
 * @fileoverview Stone Cascade - Earth Core T2 Evolution (Uncommon)
 * @module Data/Weapons/Evolved/Earth/StoneCascade
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.stone_cascade = {
    id: 'stone_cascade',
    name: 'Stone Cascade',

    // Evolution metadata
    coreId: 'earth_core',
    baseWeaponId: 'earth_spike',
    evolutionChain: 'earth',
    isEvolved: true,
    isCore: true,

    // Tier properties (Uncommon)
    tier: 2,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.AREA_DAMAGE,
    targetingMode: TargetingMode.RANDOM,
    isAuto: true,

    // Stats (1.3x base multiplier)
    damage: 29,
    cooldown: 1.15,
    areaRadius: 55,
    range: 330,
    spikeCount: 3,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.25,
        duration: 0.6,
      },
    ],

    // T2 Special Ability: Aftershock
    specialAbility: {
      name: 'Aftershock',
      description: 'Spikes create secondary tremors',
      aftershock: {
        enabled: true,
        aftershockRadius: 40,
        aftershockDamage: 10,
        aftershockDelay: 0.3,
      },
    },

    // Visual properties
    color: '#8B4513',
    size: 55,
    shape: 'spike',
    lifetime: 0.5,
    icon: 'stone_cascade',
    imageId: 'weapon_stone_cascade',

    // Level upgrades
    upgrades: {
      2: { damage: 36, spikeCount: 4, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.3, duration: 0.7 }] },
      3: { damage: 45, areaRadius: 65, specialAbility: { aftershock: { aftershockRadius: 50, aftershockDamage: 15 } } },
      4: { damage: 56, cooldown: 1.0, range: 360 },
      5: { damage: 70, spikeCount: 5, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.4, duration: 0.9 }] },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);

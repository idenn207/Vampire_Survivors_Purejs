/**
 * @fileoverview Adamantine Breaker - Steel Core T4 Evolution (Epic)
 * @module Data/Weapons/Evolved/Steel/AdamantineBreaker
 */
(function (Data) {
  'use strict';

  var AttackType = Data.AttackType;
  var TargetingMode = Data.TargetingMode;
  var StatusEffectType = Data.StatusEffectType;

  Data.EvolvedWeaponRegistry = Data.EvolvedWeaponRegistry || {};

  Data.EvolvedWeaponRegistry.adamantine_breaker = {
    id: 'adamantine_breaker',
    name: 'Adamantine Breaker',

    // Evolution metadata
    coreId: 'steel_core',
    baseWeaponId: 'steel_hammer',
    evolutionChain: 'steel',
    isEvolved: true,
    isCore: true,

    // Tier properties (Epic)
    tier: 4,
    isExclusive: false,
    maxTier: 5,

    // Attack properties
    attackType: AttackType.MELEE_SWING,
    targetingMode: TargetingMode.NEAREST,
    isAuto: true,

    // Stats (4.0x base multiplier)
    damage: 70,
    cooldown: 0.95,
    range: 115,
    arc: 170,
    pierce: 999,
    knockback: 260,

    // Enhanced status effect
    statusEffects: [
      {
        type: StatusEffectType.STUN,
        chance: 0.4,
        duration: 1.0,
      },
      {
        type: StatusEffectType.ARMOR_BREAK,
        chance: 0.35,
        duration: 5,
        armorReduction: 0.3,
      },
    ],

    // T4 Special Ability: Seismic Slam
    specialAbility: {
      name: 'Seismic Slam',
      description: 'Every 5th hit creates a massive ground slam',
      seismicSlam: {
        enabled: true,
        hitThreshold: 5,
        slamRadius: 120,
        slamDamage: 80,
        stunDuration: 1.0,
      },
      // Keeps crushing blow from T3
      crushingBlow: {
        enabled: true,
        bonusDamageMultiplier: 1.75,
        guaranteedStunOnCrit: true,
        critChance: 0.2,
      },
      // Keeps heavy impact from T2
      heavyImpact: {
        enabled: true,
        shockwaveRadius: 80,
        shockwaveDamage: 35,
        shockwaveKnockback: 140,
      },
    },

    // Visual properties
    color: '#87CEEB',
    size: 60,
    shape: 'arc',
    lifetime: 0.35,
    icon: 'adamantine_breaker',
    imageId: 'weapon_adamantine_breaker',

    // Level upgrades
    upgrades: {
      2: { damage: 88, statusEffects: [{ type: StatusEffectType.STUN, chance: 0.45, duration: 1.1 }, { type: StatusEffectType.ARMOR_BREAK, chance: 0.4, duration: 5.5, armorReduction: 0.35 }] },
      3: { damage: 110, arc: 190, specialAbility: { seismicSlam: { slamRadius: 145, slamDamage: 110 } } },
      4: { damage: 138, cooldown: 0.85, range: 125 },
      5: { damage: 172, knockback: 320, specialAbility: { seismicSlam: { hitThreshold: 4, slamRadius: 170, slamDamage: 150, stunDuration: 1.3 } } },
    },
    maxLevel: 5,
  };
})(window.VampireSurvivors.Data);
